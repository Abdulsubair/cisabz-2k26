import React from 'react';
import { motion } from 'framer-motion';
import { STUDENT_COORDINATORS, STAFF_COORDINATORS } from '../data/symposiumData';
import { Phone, User, GraduationCap, UserCheck, Sparkles } from 'lucide-react';

export const CoordinatorsSection: React.FC = () => {
  return (
    <section className="py-24 relative bg-slate-950/90 border-t border-slate-900 overflow-hidden">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>ORGANIZING COMMITTEE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-orbitron text-white tracking-tight mb-4"
          >
            EVENT <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">COORDINATORS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Reach out to our student and staff coordinators for any queries or guidance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* STUDENT COORDINATORS */}
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-md">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-orbitron text-white">Student Coordinators</h3>
                <p className="text-xs text-slate-400">Primary event operations & participant support</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STUDENT_COORDINATORS.map((coord, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] cyber-card overflow-hidden"
                >
                  <div>
                    {/* UNIFORM CINEMATIC PORTRAIT FRAME */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-5 bg-slate-950 group-hover:border-cyan-400 transition-colors">
                      {coord.avatar ? (
                        <>
                          <img
                            src={coord.avatar}
                            alt={coord.name}
                            className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-950 text-cyan-400 flex items-center justify-center font-bold text-3xl">
                          {coord.name.charAt(0)}
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 backdrop-blur-md">
                        STUDENT LEAD
                      </div>
                    </div>

                    <h4 className="text-lg font-extrabold font-orbitron text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {coord.name}
                    </h4>
                    <p className="text-xs font-mono text-cyan-400 mb-4 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{coord.role}</span>
                    </p>
                  </div>

                  <a
                    href={`tel:${coord.phone.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{coord.phone}</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* STAFF COORDINATORS */}
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-md">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-orbitron text-white">Staff Coordinators</h3>
                <p className="text-xs text-slate-400">Department faculty supervision & oversight</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STAFF_COORDINATORS.map((coord, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] cyber-card overflow-hidden"
                >
                  <div>
                    {/* UNIFORM CINEMATIC PORTRAIT FRAME */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)] mb-5 bg-slate-950 group-hover:border-purple-400 transition-colors">
                      {coord.avatar ? (
                        <>
                          <img
                            src={coord.avatar}
                            alt={coord.name}
                            className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-950 text-purple-400 flex items-center justify-center font-bold text-3xl">
                          {coord.name.charAt(4) || 'S'}
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 backdrop-blur-md">
                        FACULTY LEAD
                      </div>
                    </div>

                    <h4 className="text-lg font-extrabold font-orbitron text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {coord.name}
                    </h4>
                    <p className="text-xs font-mono text-purple-400 mb-4 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{coord.role}</span>
                    </p>
                  </div>

                  <a
                    href={`tel:${coord.phone.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 hover:bg-purple-950 hover:text-purple-300 text-slate-300 border border-slate-800 hover:border-purple-500/40 text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span>{coord.phone}</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
