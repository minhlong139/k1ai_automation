"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Competencies", href: "#competencies" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 md:py-4" : "py-4 md:py-8"}`}>
      <div className="container mx-auto px-6">
        <div className={`glass px-6 py-3 rounded-full flex items-center justify-between transition-all ${isScrolled ? "bg-black/60 border-white/10" : "bg-transparent border-transparent"}`}>
          <a href="#" className="flex-1 text-sm md:text-base lg:text-xl font-serif font-bold tracking-tighter truncate mr-4">
            Homework1 - K1 AI Automation<span className="text-blue-500">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" style={{ display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : undefined }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 left-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-serif text-white/60 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
