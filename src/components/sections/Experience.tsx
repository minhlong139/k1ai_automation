"use client";

import { motion } from "framer-motion";
import { CV_DATA } from "@/lib/constants";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export const Experience = () => {
  return (
    <section id="experience" className="py-24 px-4 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Professional Journey</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto" />
        </motion.div>

        <div className="flex flex-col gap-12 relative">
          {/* Timeline Line */}
          <div className="absolute left-0 h-full w-px bg-white/10 hidden md:block md:left-1/2 md:-translate-x-1/2" />

          {CV_DATA.experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.role}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative flex flex-col md:flex-row gap-8 items-start ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-500 hidden md:block md:left-1/2 md:-translate-x-1/2 translate-y-2 border-4 border-[#0a0a0a] z-10" />

              <div className="flex-1 w-full md:w-1/2">
                <div className="p-8 rounded-2xl glass-card transition-all hover:border-blue-500/30">
                  <div className="flex items-center gap-3 text-blue-400 mb-4">
                    <Briefcase size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">{exp.period}</span>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-1">{exp.role}</h3>
                  <div className="text-lg text-white/80 font-medium mb-4">{exp.company}</div>
                  
                  <div className="space-y-3">
                    <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-bold">Key Achievements</div>
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        {achievement}
                      </div>
                    ))}
                  </div>

                  {exp.projects && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                      {exp.projects.map((project) => (
                        <span key={project} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/50 uppercase tracking-widest uppercase">
                          {project}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Spacer for MD screens to keep timeline layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
