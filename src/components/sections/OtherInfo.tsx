"use client";

import { motion } from "framer-motion";
import { CV_DATA } from "@/lib/constants";
import { GraduationCap, Award, Heart } from "lucide-react";

export const EducationAndInterests = () => {
  return (
    <section id="education" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Education & Certs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif">Academic Foundation</h2>
            </div>

            <div className="p-8 rounded-2xl glass mb-12">
              <h3 className="text-xl font-semibold mb-1 text-white/90">{CV_DATA.education.degree}</h3>
              <div className="text-blue-400 font-medium mb-3">{CV_DATA.education.institution}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mb-4 font-bold">{CV_DATA.education.period}</div>
              <p className="text-white/60 font-light leading-relaxed">{CV_DATA.education.details}</p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Award size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif">Certifications</h2>
            </div>
            
            <ul className="space-y-4">
              {CV_DATA.certifications.map((cert) => (
                <li key={cert} className="flex gap-3 text-white/70 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Interests & Lifestyle */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <Heart size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif">Interests & Lifestyle</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {CV_DATA.interests.map((interest) => (
                <div key={interest} className="p-6 rounded-2xl glass-card flex items-center justify-center text-center">
                  <span className="text-white/80 font-medium tracking-wide">{interest}</span>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-16 p-10 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 text-center">
              <h3 className="text-2xl font-serif mb-6 italic text-gradient">&quot;Let&apos;s define the next big deal together.&quot;</h3>
              <div className="flex flex-col items-center gap-4 text-white/60">
                <p>Available for Sales Director opportunities.</p>
                <div className="flex gap-6 mt-4">
                   <a href={`mailto:${CV_DATA.contact.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">Email</a>
                   <a href={`https://${CV_DATA.contact.linkedin}`} target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
