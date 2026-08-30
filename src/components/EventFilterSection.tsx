import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_EVENTS } from '../data/symposiumData';
import { EventCard } from './EventCard';
import type { EventItem, EventCategory } from '../types';
import { Filter } from 'lucide-react';

interface EventFilterSectionProps {
  onViewGuidelines: (event: EventItem) => void;
  onRegister: (eventId: string) => void;
  onViewCinematicDemo?: (event: EventItem) => void;
}

export const EventFilterSection: React.FC<EventFilterSectionProps> = ({
  onViewGuidelines,
  onRegister,
  onViewCinematicDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | EventCategory>('all');

  const filteredEvents = ALL_EVENTS.filter((event) => {
    if (activeTab === 'all') return true;
    return event.category === activeTab;
  });

  return (
    <section className="py-16 relative bg-slate-950/70 border-t border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-semibold uppercase mb-2">
              <Filter className="w-3.5 h-3.5" />
              <span>INTERACTIVE EVENT EXPLORER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Filter Events By Category
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            {[
              { label: 'ALL EVENTS (8)', value: 'all' },
              { label: 'TECHNICAL (4)', value: 'technical' },
              { label: 'NON-TECHNICAL (4)', value: 'non-technical' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === tab.value
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard
                  event={event}
                  onViewGuidelines={onViewGuidelines}
                  onRegister={onRegister}
                  onViewCinematicDemo={onViewCinematicDemo}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
