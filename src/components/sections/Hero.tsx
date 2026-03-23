"use client";

import { motion } from "framer-motion";
import { CV_DATA } from "@/lib/constants";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 md:pt-40 lg:pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#050505]" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Content - Left (Text) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:col-span-12 xl:col-span-6 z-10 text-center xl:text-left"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-500 font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            Senior Real Estate Sales Specialist
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-gradient leading-[1.1] mb-8 break-words"
          >
            {CV_DATA.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl lg:ml-0 mx-auto px-6 py-8 rounded-2xl glass-card backdrop-blur-md relative"
          >
            <div className="absolute -left-2 top-0 h-full w-1 bg-blue-500 rounded-full hidden lg:block" />
            <p className="text-lg leading-relaxed text-white/80 italic font-light">
              &quot;10+ years of excellence in high-end real estate, consistently exceeding multi-billion VND targets.&quot;
            </p>
          </motion.div>
        </motion.div>

        {/* Hero Image - Right (Full/Clear) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="lg:col-span-12 xl:col-span-6 relative"
        >
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden glass shadow-2xl group">
            {/* Visual glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            
            <Image
              src="/assets/reference.jpg"
              alt={CV_DATA.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              priority
            />

            <div className="absolute bottom-8 left-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 inline-block">
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Industry Leader</span>
               </div>
            </div>
          </div>
          
          {/* Decorative frame */}
          <div className="absolute -inset-4 border border-white/5 rounded-[40px] -z-10 pointer-events-none" />
          <div className="absolute -inset-8 border border-white/5 rounded-[48px] -z-10 pointer-events-none opacity-50" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/20"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};
