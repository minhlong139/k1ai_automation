"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, RefreshCw, Send, User, Bot } from "lucide-react";
import * as marked from "marked";

const API_KEY = process.env.NEXT_PUBLIC_CHATBOT_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_BASE_URL;
const MODEL = process.env.NEXT_PUBLIC_CHATBOT_MODEL;

const SYSTEM_PROMPT = `Bạn là trợ lý ảo của Bùi Minh Long, chuyên gia BĐS và AI. 
Mục tiêu: Tư vấn ngắn gọn, chuyên nghiệp và thu thập thông tin khách hàng.

QUY TẮC XÁC THỰC THÔNG TIN (VALIDATION):
1. Tên
2. Số điện thoại: Phải là SĐT Việt Nam (10-11 số). Nếu khách nhập sai, hãy lịch sự yêu cầu họ cung cấp lại.
3. Email: Phải có định dạng chuẩn (ví dụ: abc@company.com). Nếu sai định dạng, hãy nhắc khách kiểm tra lại.
4. Interest (Dự án quan tâm)
5. Intent Level (Hot/Warm/Cold)

QUY TẮC TRẢ LỜI:
- Trả lời cực kỳ ngắn gọn, tự nhiên. 
- TUYỆT ĐỐI KHÔNG tiết lộ nhãn phân loại (Warm, Hot, Cold) cho khách thấy.
- Nếu khách nhập SAI SĐT hoặc Email: Hãy phản hồi ngay là thông tin chưa chính xác và nhờ khách cung cấp lại.
- Khi có thông tin MỚI VÀ ĐÚNG, chèn mã JSON vào cuối:
||LEAD_DATA: {"name": "...", "phone": "...", "email": "...", "interest": "...", "intent_level": "..."}||`;

interface Message {
  role: "user" | "bot";
  content: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Chào bạn! Tôi là trợ lý của anh Long. Bạn đang quan tâm đến dự án nào hay cần tư vấn về giải pháp AI?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const leadDataBuffer = useRef<any>({
    name: null,
    phone: null,
    email: null,
    interest: null,
    intent_level: null
  });

  useEffect(() => {
    // Generate session ID once on mount
    const id = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    setSessionId(id);
  }, []);

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMessages([{ role: "bot", content: "Chào bạn! Tôi là trợ lý của anh Long. Bạn đang quan tâm đến dự án nào hay cần tư vấn về giải pháp AI?" }]);
      setIsRefreshing(false);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })),
            { role: "user", content: input }
          ],
        }),
      });

      const data = await response.json();
      let botContent = data.choices?.[0]?.message?.content || "Xin lỗi, tôi gặp chút trục trặc. Bạn vui lòng thử lại sau nhé!";

      // Process lead data if present
      botContent = processAIResponse(botContent, [...messages, userMsg, { role: "bot", content: botContent }]);

      setMessages(prev => [...prev, { role: "bot", content: botContent }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isValidVietnamesePhone = (phone: string) => {
    // Loại bỏ các ký tự không phải số
    const cleaned = phone.replace(/\D/g, '');
    // Chấp nhận 10 hoặc 11 chữ số (để linh hoạt)
    return /^(0|84)(3|5|7|8|9)[0-9]{8,9}$/.test(cleaned);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const processAIResponse = (aiResponse: string, chatHistoryArray: Message[] = []) => {
    const dataPattern = /\|\|LEAD_DATA:\s*(\{.*?\})\s*\|\|/;

    // Format chat history for Google Sheets
    let formattedHistory = "";
    if (chatHistoryArray && chatHistoryArray.length > 0) {
      formattedHistory = chatHistoryArray.map(msg => {
        const role = msg.role === 'user' ? 'Khách' : 'AI';
        const content = msg.content.replace(dataPattern, "").trim();
        return `${role}: ${content}`;
      }).join('\n\n');
    }

    if (aiResponse.includes("||LEAD_DATA:")) {
      const match = aiResponse.match(dataPattern);

      if (match && match[1]) {
        try {
          const newData = JSON.parse(match[1]);
          
          // Validate dữ liệu trước khi merge
          const validName = newData.name && newData.name !== "null" ? newData.name : leadDataBuffer.current.name;
          const validPhone = newData.phone && isValidVietnamesePhone(newData.phone) ? newData.phone : leadDataBuffer.current.phone;
          const validEmail = newData.email && isValidEmail(newData.email) ? newData.email : leadDataBuffer.current.email;

          // Merge data
          leadDataBuffer.current = {
            name: validName,
            phone: validPhone,
            email: validEmail,
            interest: newData.interest || leadDataBuffer.current.interest,
            intent_level: newData.intent_level || leadDataBuffer.current.intent_level,
          };

          // Chỉ sync lên Sheet nếu có ít nhất 1 thông tin hợp lệ
          if (validName || validPhone || validEmail) {
            sendLeadToGoogleSheets(leadDataBuffer.current, formattedHistory);
            console.log("🚀 Syncing valid lead data:", leadDataBuffer.current);
          }
        } catch (error) {
          console.error("❌ Error parsing lead JSON:", error);
        }
      }
      return aiResponse.replace(dataPattern, "").trim();
    }
    return aiResponse;
  };

  const sendLeadToGoogleSheets = async (leadData: any, chatHistoryText: string) => {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn("⚠️ Google Script URL is not configured.");
      return;
    }

    try {
      // Ép kiểu Số điện thoại sang String bằng cách thêm dấu ' ở đầu nếu cần thiết
      const phoneString = leadData.phone ? (leadData.phone.toString().startsWith("'") ? leadData.phone : "'" + leadData.phone) : '';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name || '',
          phone: phoneString,
          email: leadData.email || '',
          interest: leadData.interest || '',
          intent_level: leadData.intent_level || '',
          source: typeof window !== 'undefined' ? window.location.href : '',
          sessionId: sessionId,
          chatHistory: chatHistoryText,
          timestamp: new Date().toLocaleString('vi-VN')
        })
      });
      console.log("📤 Data synced to Google Sheets!");
    } catch (err) {
      console.warn("⚠️ Failed to send lead data:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <MessageSquare className="relative z-10" size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] rounded-3xl overflow-hidden glass shadow-2xl border border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Bot size={20} className="text-blue-500" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Assistant</h3>
                  <p className="text-[10px] text-green-500 font-medium uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className={`p-2 rounded-full hover:bg-white/10 text-white/60 transition-all ${isRefreshing ? "animate-spin-once" : ""}`}
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-purple-600/20" : "bg-blue-600/20"}`}>
                      {msg.role === "user" ? <User size={16} className="text-purple-500" /> : <Bot size={16} className="text-blue-500" />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm chat-markdown ${msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white/10 text-white/90 border border-white/5 rounded-tl-none"
                        }`}
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                    />
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Bot size={16} className="text-blue-500" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/5 rounded-tl-none flex flex-col gap-2">
                      <span className="text-xs text-white/40 italic">Đang nhập...</span>
                      <div className="typing-dots">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Hỏi tôi bất cứ điều gì..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:bg-white/10 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
