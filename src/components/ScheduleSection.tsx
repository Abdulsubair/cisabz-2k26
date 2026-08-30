import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SCHEDULE_DATA } from '../data/symposiumData';
import { Calendar, Clock, MapPin, Table as TableIcon, LayoutList } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  const currentItems = SCHEDULE_DATA[selectedDay]?.items || [];

  return (
    <section id="schedule" className="py-24 relative bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>OFFICIAL SYMPOSIUM TIMELINE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            EVENT <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">SCHEDULE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 font-light"
          >
            Official Inauguration & Complete Event Schedule for CISABZ-2K26.
          </motion.p>
        </div>

        {/* CONTROLS BAR: DATE & VIEW MODE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            {SCHEDULE_DATA.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  selectedDay === idx
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{day.date}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Official Table</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>Timeline View</span>
            </button>
          </div>
        </div>

        {/* SCHEDULE CONTENT */}
        <div className="max-w-5xl mx-auto">
          {viewMode === 'table' ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm text-slate-200">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-cyan-400 font-mono uppercase text-xs tracking-wider">
                      <th className="p-4 text-center w-16 border-r border-slate-800 font-bold">S. No</th>
                      <th className="p-4 border-r border-slate-800 font-bold w-56 sm:w-64">Time</th>
                      <th className="p-4 border-r border-slate-800 font-bold">Event</th>
                      <th className="p-4 font-bold">Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, idx) => {
                      const isHighlightRow = item.isHighlight || item.type === 'Break';
                      return (
                        <tr
                          key={idx}
                          className={`border-b border-slate-800/80 transition-colors ${
                            isHighlightRow
                              ? 'bg-amber-500/10 font-bold text-amber-300 hover:bg-amber-500/15'
                              : 'hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="p-4 text-center font-mono border-r border-slate-800 text-slate-400 font-bold">
                            {item.sNo || idx + 1}.
                          </td>
                          <td className="p-4 font-mono border-r border-slate-800 whitespace-nowrap text-cyan-300 font-semibold">
                            {item.time}
                          </td>
                          <td className="p-4 border-r border-slate-800 font-medium">
                            <div className="flex items-center gap-2">
                              <span className={isHighlightRow ? 'font-black text-amber-300 text-base' : 'text-white font-semibold'}>
                                {item.event}
                              </span>
                              {item.type && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                                    item.type === 'Technical'
                                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                                      : item.type === 'Non-Technical'
                                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                                      : item.type === 'Ceremony'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                      : 'bg-slate-950 text-amber-400 border-amber-800/40'
                                  }`}
                                >
                                  {item.type}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-medium">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <span>{item.venue}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    item.isHighlight
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border shrink-0 ${
                      item.isHighlight
                        ? 'bg-amber-950 border-amber-500/50 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-cyan-400'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                          {item.time}
                        </span>
                        {item.type && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
                            {item.type}
                          </span>
                        )}
                      </div>
                      <h3 className={`text-lg font-bold ${item.isHighlight ? 'text-amber-300 font-black' : 'text-white'}`}>
                        {item.sNo ? `${item.sNo}. ` : ''}{item.event}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{item.venue}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
