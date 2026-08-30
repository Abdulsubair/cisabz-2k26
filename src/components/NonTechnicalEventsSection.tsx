import React from 'react';
import { motion } from 'framer-motion';
import { NON_TECHNICAL_EVENTS } from '../data/symposiumData';
import { EventCard } from './EventCard';
import type { EventItem } from '../types';
import { Gamepad2 } from 'lucide-react';

interface NonTechnicalEventsSectionProps {
  onViewGuidelines: (event: EventItem) => void;
  onRegister: (eventId: string) => void;
  onViewCinematicDemo?: (event: EventItem) => void;
}

export const NonTechnicalEventsSection: React.FC<NonTechnicalEventsSectionProps> = ({
  onViewGuidelines,
  onRegister,
  onViewCinematicDemo,
}) => {
  return (
    <section id="non-technical-events" className="py-24 relative bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>OFFICIAL NON-TECHNICAL CATEGORY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            NON-TECHNICAL <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">EVENTS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Think differently. Play smart. Have fun.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NON_TECHNICAL_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewGuidelines={onViewGuidelines}
              onRegister={onRegister}
              onViewCinematicDemo={onViewCinematicDemo}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
