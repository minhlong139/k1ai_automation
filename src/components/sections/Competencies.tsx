"use client";

import { motion } from "framer-motion";
import { CV_DATA } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

export const Competencies = () => {
  return (
    <section id="competencies" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Core Competencies</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CV_DATA.competencies.map((comp, index) => (
            <motion.div
              key={comp.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl glass-card flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white/90">{comp.title}</h3>
              <p className="text-white/60 font-light leading-relaxed">
                {comp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
