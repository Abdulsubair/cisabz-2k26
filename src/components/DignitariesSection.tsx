import React from 'react';
import { motion } from 'framer-motion';
import { DIGNITARIES } from '../data/symposiumData';
import { Award, Star, Building, Sparkles } from 'lucide-react';

export const DignitariesSection: React.FC = () => {
  return (
    <section id="patrons" className="py-24 relative bg-slate-950/95 border-t border-slate-900 overflow-hidden">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>LEADERSHIP & CHIEF PATRONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-4xl sm:text-5xl font-black font-orbitron text-white tracking-tight mb-4"
          >
            DISTINGUISHED <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-cyan-300 to-indigo-400">DIGNITARIES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-base sm:text-lg text-slate-400 font-light"
          >
            Honored academic leaders, patrons, and visionaries guiding CISABZ-2K26.
          </motion.p>
        </div>

        {/* DIGNITARIAN CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {DIGNITARIES.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] cyber-card"
            >
              {/* CARD TOP MEDIA CONTAINER (UNIFORM ASPECT RATIO & CINEMATIC OVERLAY) */}
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* CINEMATIC GRADIENT LIGHTING VIGNETTE */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                  {/* TOP-RIGHT STAR BADGE */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-400 backdrop-blur-md shadow-md group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>

                  {/* BADGE PILL OVERLAY */}
                  {person.badge && (
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-[10px] font-mono font-bold tracking-wider text-cyan-300 backdrop-blur-md shadow-sm">
                      {person.badge}
                    </div>
                  )}
                </div>

                {/* CARD BODY CONTENT */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-extrabold font-orbitron text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {person.name}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold mb-2.5 self-start">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{person.role}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-3">
                    <Building className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{person.institution}</span>
                  </p>

                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {person.description}
                  </p>
                </div>
              </div>

              {/* BOTTOM ACCENT BAR */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-cyan-400 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
