import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { Cpu, Trophy, Lightbulb, Users, Terminal } from 'lucide-react';

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
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>ABOUT THE CSE SYMPOSIUM MATRIX</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-orbitron tracking-tight text-white mb-6 leading-tight">
              WELCOME TO <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">{SYMPOSIUM_CONFIG.name}</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              <strong className="text-white font-semibold">{SYMPOSIUM_CONFIG.name}</strong> is an elite Technical & Non-Technical Symposium organized by the <strong className="text-cyan-400 font-semibold">{SYMPOSIUM_CONFIG.department}</strong> at <strong className="text-white">{SYMPOSIUM_CONFIG.collegeName}</strong>. Designed specifically for computer science visionaries to compete, code, present groundbreaking research, and conquer creative challenges.
            </p>
          </motion.div>

          {/* HIGHLIGHT PILLARS GRID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col items-start gap-3 hover:border-cyan-500/40 transition-colors cyber-card"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
