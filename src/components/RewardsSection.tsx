import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Coffee, FileCheck } from 'lucide-react';

export const RewardsSection: React.FC = () => {
  const perks = [
    {
      icon: Trophy,
      title: 'Grand Cash Rewards & Trophies',
      description: 'Exciting cash rewards, winner trophies & official shields for all top team finalists.',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'from-amber-950/40 via-slate-900 to-slate-950',
    },
    {
      icon: Award,
      title: 'Merit & Winner Certificates',
      description: 'Prestigious merit certificates issued by the Department of CSE to top winners.',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'from-cyan-950/40 via-slate-900 to-slate-950',
    },
    {
      icon: FileCheck,
      title: 'Participation Certificates for All',
      description: 'Official participation certificates awarded to every single registered student attendee.',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'from-purple-950/40 via-slate-900 to-slate-950',
    },
    {
      icon: Coffee,
      title: 'Complimentary Food & Refreshments',
      description: 'Full delicious lunch buffet & morning/evening high-tea refreshments provided.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'from-emerald-950/40 via-slate-900 to-slate-950',
    },
  ];

  return (
    <section id="rewards" className="py-24 relative bg-slate-950/95 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-4"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>PRIZES & REWARDS SHOWCASE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-orbitron text-white tracking-tight mb-4"
          >
            EXCITING <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">CASH PRIZES</span> & PERKS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Compete with top engineering minds across the region and win grand prizes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-8 rounded-3xl bg-gradient-to-br ${perk.bg} border ${perk.border} backdrop-blur-2xl shadow-xl flex items-start gap-5 cyber-card group hover:scale-[1.02] transition-transform`}
              >
                <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${perk.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-orbitron text-white mb-2 flex items-center gap-2">
                    <span>{perk.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {perk.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
