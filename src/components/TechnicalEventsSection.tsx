import React from 'react';
import { motion } from 'framer-motion';
import { TECHNICAL_EVENTS } from '../data/symposiumData';
import { EventCard } from './EventCard';
import type { EventItem } from '../types';
import { Cpu, FileText } from 'lucide-react';

interface TechnicalEventsSectionProps {
  onViewGuidelines: (event: EventItem) => void;
  onRegister: (eventId: string) => void;
}

export const TechnicalEventsSection: React.FC<TechnicalEventsSectionProps> = ({
  onViewGuidelines,
  onRegister,
}) => {
  return (
    <section id="technical-events" className="py-24 relative bg-slate-950/90 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>OFFICIAL TECHNICAL CATEGORY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            TECHNICAL <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">EVENTS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Challenge your knowledge. Showcase your skills.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNICAL_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewGuidelines={onViewGuidelines}
              onRegister={onRegister}
            />
          ))}
        </div>

        {/* UNIQUE-COLORED END-OF-SECTION GUIDELINE PDF CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.3)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
              <FileText className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <span className="text-base font-extrabold font-orbitron text-amber-300">
                  TECHNICAL EVENT GUIDELINES (PDF)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold uppercase animate-pulse">
                  OFFICIAL PDF
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-rajdhani">
                Click to view or download the official PDF brochure containing complete rules, presentation topics, and evaluation criteria.
              </p>
            </div>
          </div>

          <a
            href="/CISABZ-2K26_Event_Guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>OPEN GUIDELINES PDF</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
