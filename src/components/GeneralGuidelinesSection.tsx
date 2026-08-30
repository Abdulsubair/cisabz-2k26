import React from 'react';
import { motion } from 'framer-motion';
import { GENERAL_RULES } from '../data/symposiumData';
import {
  Users,
  Layers,
  CreditCard,
  Flame,
  ShieldCheck,
  Award,
  UserCheck,
  Building,
  FileCheck,
  Coffee,
  CheckCircle,
} from 'lucide-react';

const ruleIconMap: Record<string, React.ElementType> = {
  Users,
  Layers,
  CreditCard,
  Flame,
  ShieldCheck,
  Award,
  UserCheck,
  Building,
  FileCheck,
  Coffee,
};

export const GeneralGuidelinesSection: React.FC = () => {
  return (
    <section id="guidelines" className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFICIAL SYMPOSIUM POLICY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            GENERAL <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">GUIDELINES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Essential rules & regulations for all symposium participants.
          </motion.p>
        </div>

        {/* GUIDELINES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GENERAL_RULES.map((rule, index) => {
            const Icon = ruleIconMap[rule.iconName] || CheckCircle;
            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex items-start gap-4 ${
                  rule.highlight
                    ? 'bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-sm font-mono font-bold text-cyan-400/80 mb-2">
                    #{String(rule.id).padStart(2, '0')}
                  </span>
                  <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${rule.highlight ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                    <span>{rule.title}</span>
                    {rule.highlight && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-semibold uppercase">
                        IMPORTANT
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {rule.description}
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
