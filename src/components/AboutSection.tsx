import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import { Cpu, Trophy, Lightbulb, Users, Terminal, Code2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Cpu,
      title: 'Technology',
      desc: 'Explore cutting-edge tech trends, CS fundamentals & AI challenges.',
      color: 'text-cyan-400',
    },
    {
      icon: Trophy,
      title: 'Competition',
      desc: 'Test your speed, accuracy, and tactical bidding in high-stakes rounds.',
      color: 'text-amber-400',
    },
    {
      icon: Lightbulb,
      title: 'Creativity',
      desc: 'Express groundbreaking paper presentations & solve visual link puzzles.',
      color: 'text-pink-400',
    },
    {
      icon: Users,
      title: 'Collaboration',
      desc: 'Form individual or 2-member teams to synergize and conquer challenges.',
      color: 'text-emerald-400',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>ABOUT THE CSE SYMPOSIUM MATRIX</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-orbitron tracking-tight text-white mb-6 leading-tight">
              WELCOME TO <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">{SYMPOSIUM_CONFIG.name}</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              <strong className="text-white font-semibold">{SYMPOSIUM_CONFIG.name}</strong> is an elite Technical & Non-Technical Symposium organized by the <strong className="text-cyan-400 font-semibold">{SYMPOSIUM_CONFIG.department}</strong> at <strong className="text-white">{SYMPOSIUM_CONFIG.collegeName}</strong>. Designed specifically for computer science visionaries to compete, code, present groundbreaking research, and conquer creative challenges.
            </p>

            {/* HIGHLIGHT PILLARS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-start gap-3 hover:border-cyan-500/40 transition-colors cyber-card"
                  >
                    <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${pillar.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-orbitron font-bold text-white mb-1">{pillar.title}</h4>
                      <p className="text-xs text-slate-400 leading-normal">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: CAMPUS & TECH VISUAL CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative group cyber-card">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500" />

              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-2xl">
                <img
                  src={ASSET_IMAGES.cseDepartment}
                  alt="Department of Computer Science & Engineering"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-orbitron font-bold text-white">Department of CSE Complex</h4>
                        <p className="text-xs font-mono text-cyan-400">Kings College of Engineering</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
