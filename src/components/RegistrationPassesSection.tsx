import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface RegistrationPassesSectionProps {
  onRegisterClick: (eventId?: string) => void;
}

export const RegistrationPassesSection: React.FC<RegistrationPassesSectionProps> = ({ onRegisterClick }) => {
  const passes = [
    {
      name: 'STANDARD COMBO PASS',
      price: '200',
      badge: 'OFFICIAL STANDARD PASS',
      ribbon: 'STANDARD',
      color: 'from-cyan-500 via-blue-600 to-indigo-600',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_35px_rgba(6,182,212,0.3)]',
      popular: true,
      features: [
        'Access to 2 Technical Events + 1 Non-Technical Event',
        'Complimentary Delicious Lunch Buffet & High-Tea',
        'Official Symposium Kit Bag & Pen',
        'Participation Certificate for All Attendees',
        'Eligible for Cash Rewards & Trophy Awards',
      ],
    },
    {
      name: 'EXTRA EVENT ADD-ON PASS',
      price: '250',
      badge: 'ADDITIONAL EVENTS (+₹50)',
      ribbon: 'FULL ACCESS',
      color: 'from-amber-400 via-yellow-500 to-amber-600',
      border: 'border-amber-500/50',
      glow: 'shadow-[0_0_45px_rgba(212,175,55,0.4)]',
      popular: false,
      features: [
        'Includes Standard Combo Pass (2 Tech + 1 Non-Tech)',
        'Additional Technical / Non-Technical Event (+₹50)',
        'Priority Event Entry & Front Row Seating',
        'Complimentary Delicious Lunch Buffet & High-Tea',
        'Official Symposium Kit Bag & Merit Certificates',
      ],
    },
  ];

  return (
    <section id="passes" className="py-24 relative bg-slate-950/95 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span>OFFICIAL SYMPOSIUM PASSES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-cinzel text-white tracking-tight mb-4"
          >
            SELECT YOUR <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400">ENTRY PASS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Standard entry is ₹200 for 2 Technical + 1 Non-Technical Event. Extra events available for +₹50!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {passes.map((pass, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`relative rounded-3xl p-1 bg-gradient-to-b ${pass.color} ${pass.glow} animate-float-pass cyber-card group overflow-hidden`}
            >
              <div className={`absolute top-6 right-[-35px] rotate-45 py-1 px-10 text-[10px] font-mono font-black uppercase tracking-widest text-black shadow-lg ${pass.popular ? 'bg-cyan-400' : 'bg-amber-400'}`}>
                {pass.ribbon}
              </div>

              <div className="h-full rounded-[22px] bg-slate-950 p-8 flex flex-col justify-between backdrop-blur-2xl animate-sweep-light relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-cyan-400 uppercase mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{pass.badge}</span>
                  </div>

                  <h3 className="text-2xl font-black font-orbitron text-white mb-2">{pass.name}</h3>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-lg font-bold text-cyan-400">₹</span>
                    <span className="text-5xl font-black font-cinzel text-white drop-shadow-md">{pass.price}</span>
                    <span className="text-xs font-mono text-slate-400">/ participant</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300 font-normal">
                    {pass.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onRegisterClick()}
                  className={`w-full py-4 rounded-xl font-orbitron font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    pass.popular
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 hover:scale-105'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:opacity-90 hover:scale-105'
                  }`}
                >
                  <span>CLAIM YOUR PASS NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
