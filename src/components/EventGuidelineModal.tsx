import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventItem } from '../types';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { X, CheckCircle, Users, Layers, Award, FileText, ArrowRight, Phone, User } from 'lucide-react';

interface EventGuidelineModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegister: (eventId: string) => void;
}

export const EventGuidelineModal: React.FC<EventGuidelineModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[92vh] overflow-y-auto"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER INFORMATION */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase border border-cyan-500/30">
                EVENT {event.code} &bull; {event.category.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-medium">{event.type}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold font-orbitron text-white tracking-tight">
              {event.name}
            </h3>
            <div className="mt-2">
              <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                {event.subtitle} — {event.tagline}
              </p>
            </div>
          </div>

          {/* QUICK EVENT ROUNDS, FORMAT & ORGANISER BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Rounds Structure</div>
                <div className="text-xs font-semibold text-slate-200">{event.rounds}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-purple-400 border border-purple-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Team Format</div>
                <div className="text-xs font-semibold text-slate-200">{event.teamSize}</div>
              </div>
            </div>

            {event.organiser && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-amber-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Event Organiser</div>
                  <a
                    href={`tel:${event.organiser.phone.replace(/\s+/g, '')}`}
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>{event.organiser.name}</span>
                    <Phone className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* OFFICIAL GUIDELINES */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Official Event Guidelines</span>
              </h4>
              <div className="space-y-2.5">
                {event.guidelines.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {event.evaluationCriteria && event.evaluationCriteria.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Evaluation Criteria</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.evaluationCriteria.map((criterion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                    >
                      &bull; {criterion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.shortDescription && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 block mb-1 font-mono uppercase">Event Concept Summary:</strong>
                {event.shortDescription}
              </div>
            )}

            {/* OFFICIAL PDF GUIDELINE ITEM AT THE END OF SECTION (UNIQUE COLOR & DIRECT LINK) */}
            <a
              href="/CISABZ-2K26_Event_Guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/20 border-2 border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-amber-300 group-hover:text-amber-100 font-orbitron">
                      Official Symposium PDF Guidelines
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold uppercase animate-pulse">
                      PDF FILE
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80 font-rajdhani mt-0.5">
                    Click here to open, view, and download the full official rulebook document.
                  </p>
                </div>
              </div>

              <div className="shrink-0 ml-3 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 group-hover:bg-amber-300 transition-colors shadow-md">
                <span>View PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </motion.div>

          {/* MODAL FOOTER */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Registration deadline: <strong className="text-slate-200">{SYMPOSIUM_CONFIG.registrationEndDate}</strong>
            </div>

            <button
              onClick={() => {
                onClose();
                onRegister(event.id);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <span>REGISTER FOR THIS EVENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
