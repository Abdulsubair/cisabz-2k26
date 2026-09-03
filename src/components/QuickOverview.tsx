import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Gamepad2, Calendar, Award } from 'lucide-react';

export const QuickOverview: React.FC = () => {
  const stats = [
    {
      number: '4',
      label: 'TECHNICAL EVENTS',
      subtext: 'Paper Presentation, Quiz, AI & Debugging',
      icon: Cpu,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      textColor: 'text-cyan-400',
    },
    {
      number: '4',
      label: 'NON-TECHNICAL EVENTS',
      subtext: 'Pinpoint, Logo Spot, IPL Auction & Connections',
      icon: Gamepad2,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      number: '1',
      label: 'DAY GRAND SYMPOSIUM',
      subtext: 'Grand Symposium & Innovation Festival',
      icon: Calendar,
      gradient: 'from-amber-500/20 to-yellow-500/20',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      number: '₹50',
      label: 'ADDITIONAL EVENT FEE',
      subtext: 'Max 2 events included in base registration',
      icon: Award,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '200px' }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.15 } }}
              className={`p-6 rounded-3xl bg-slate-900/90 border ${stat.border} backdrop-blur-xl shadow-xl flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-4xl font-black font-mono ${stat.textColor}`}>
                  {stat.number}
                </span>
                <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${stat.textColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-wider text-white uppercase mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {stat.subtext}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
