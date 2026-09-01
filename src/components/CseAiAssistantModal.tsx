import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS, STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '../data/symposiumData';
import type { EventItem } from '../types';
import { X, RotateCcw, Globe, Phone, ChevronRight, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react';
import symbotClockBadge from '../assets/symbot-clock-badge.png';

interface CseAiAssistantModalProps {
  onOpenRegistration?: (eventId?: string) => void;
}

type ViewState = 'main' | 'technical_list' | 'non_tech_list' | 'event_detail' | 'rules' | 'contact' | 'custom_help';

export const CseAiAssistantModal: React.FC<CseAiAssistantModalProps> = ({ onOpenRegistration }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'overview' | 'rules' | 'team' | 'eligibility' | 'evaluation'>('overview');
  const [userQuery, setUserQuery] = useState<string>('');
  const [customReply, setCustomReply] = useState<string | null>(null);

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setActiveTabFilter('overview');
    setCurrentView('event_detail');
  };

  const handleReset = () => {
    setCurrentView('main');
    setSelectedEvent(null);
    setActiveTabFilter('overview');
    setUserQuery('');
    setCustomReply(null);
  };

  const handleCustomQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const lower = userQuery.toLowerCase();
    let reply = `Thank you for your query about ${SYMPOSIUM_CONFIG.name}! `;

    if (lower.includes('fee') || lower.includes('cost') || lower.includes('pay') || lower.includes('price')) {
      reply += `Base registration fee is ₹${SYMPOSIUM_CONFIG.registrationFee} which includes up to 2 events (1 Technical + 1 Non-Technical), complimentary lunch & certificate. Any additional event costs ₹${SYMPOSIUM_CONFIG.additionalEventFee}.`;
    } else if (lower.includes('date') || lower.includes('when') || lower.includes('timing')) {
      reply += `The symposium takes place on ${SYMPOSIUM_CONFIG.eventDate}. Registration closes on ${SYMPOSIUM_CONFIG.registrationEndDate}.`;
    } else if (lower.includes('venue') || lower.includes('location') || lower.includes('where')) {
      reply += `The venue is ${SYMPOSIUM_CONFIG.venueName} at ${SYMPOSIUM_CONFIG.collegeName}, ${SYMPOSIUM_CONFIG.collegeAddress}.`;
    } else if (lower.includes('food') || lower.includes('lunch') || lower.includes('certificate')) {
      reply += `Complimentary lunch, tea/refreshments, and official participation certificates will be provided to all registered attendees!`;
    } else {
      reply += `For specific queries, feel free to contact our student coordinators: C. Vignesh (${STUDENT_COORDINATORS[0].phone}) or M. Mubashir (${STUDENT_COORDINATORS[1].phone}).`;
    }

    setCustomReply(reply);
  };

  // Helper to retrieve coordinator contact per event
  const getEventOrganiser = (eventId?: string) => {
    if (eventId === 'techverse' || eventId === 'pinpoint') {
      return { name: 'C. Vignesh', phone: '7871630097' };
    } else if (eventId === 'tech-brainiac' || eventId === 'brand-spot') {
      return { name: 'M. Mubashir', phone: '95143 59887' };
    } else if (eventId === 'prompt-fusion' || eventId === 'hammer-hit') {
      return { name: 'Ms. B. Bavithra', phone: '78452 86608' };
    } else {
      return { name: 'Ms. S. Abikayil Aarthi', phone: '80128 15838' };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none font-sans">
      {/* FLOATING MASCOT TRIGGER BUTTON */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          className="relative flex items-center cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {/* FLOATING NEED HELP SPEECH BUBBLE */}
          <div className="absolute -top-10 -left-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-mono text-xs font-bold px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-1.5 border border-amber-300/50 animate-bounce">
            <span>Need help?</span>
            <div className="w-2 h-2 bg-orange-500 rotate-45 border-r border-b border-amber-300 absolute -bottom-1 left-6" />
          </div>

          {/* ORANGE CLOCK MASCOT CHARACTER CONTAINER */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform">
            <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl animate-pulse" />
            <img
              src={symbotClockBadge}
              alt="SymBot Orange Clock Mascot"
              className="w-full h-full object-contain relative z-10 rounded-full border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.8)]"
            />
          </div>
        </motion.div>
      )}

      {/* SYMBOT CHATBOT MODAL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3 }}
            className="w-[92vw] sm:w-[390px] h-[580px] max-h-[85vh] rounded-3xl overflow-hidden bg-slate-950/95 border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col justify-between relative"
          >
            {/* BACKGROUND DIAGONAL GRID PATTERN */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER BAR */}
            <div className="relative z-10 px-5 py-3.5 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border-b border-amber-500/20 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center overflow-hidden shrink-0">
                  <img src={symbotClockBadge} alt="SymBot Clock Mascot" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-orbitron text-white tracking-wide leading-tight flex items-center gap-1.5">
                    <span>SymBot Assistant</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400 font-semibold">Online</span>
                    <span>— {SYMPOSIUM_CONFIG.name}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (RESET & CLOSE) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  title="Reset to main menu"
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CHATBOT CONTENT BODY */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* VIEW 1: MAIN WELCOME SCREEN */}
              {currentView === 'main' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  {/* WELCOME CARD */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md shadow-lg">
                    <div className="flex items-start gap-3">
                      <img src={symbotClockBadge} alt="SymBot Mascot" className="w-10 h-10 rounded-full border border-amber-400/60 object-cover shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white leading-relaxed">
                          Hi! 👋 I&apos;m the <strong className="text-amber-300 font-orbitron">{SYMPOSIUM_CONFIG.name} Assistant</strong>.
                        </p>
                        <p className="text-xs text-slate-300 mt-1">How can I help you today?</p>
                      </div>
                    </div>
                  </div>

                  {/* QUICK INFO PROMPT CARD */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>QUICK NAVIGATION</span>
                    </div>
                    <p>Select a topic below to view event lists, guidelines, rules, or contact coordinators!</p>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: TECHNICAL EVENTS LIST */}
              {currentView === 'technical_list' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900/90 border border-cyan-500/30">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                      <Globe className="w-4 h-4" />
                      <span>TECHNICAL EVENTS</span>
                    </div>
                    <p className="text-xs text-slate-300">Click any event to view guidelines, venue & organiser contact:</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {TECHNICAL_EVENTS.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => handleSelectEvent(evt)}
                        className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                            {evt.code}
                          </span>
                          <div>
                            <div className="text-xs font-bold font-orbitron text-white group-hover:text-cyan-300 transition-colors">
                              {evt.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{evt.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentView('main')}
                    className="mt-2 py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Menu</span>
                  </button>
                </motion.div>
              )}

              {/* VIEW 3: NON-TECHNICAL EVENTS LIST */}
              {currentView === 'non_tech_list' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-slate-900/90 border border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                      <Trophy className="w-4 h-4" />
                      <span>NON-TECHNICAL EVENTS</span>
                    </div>
                    <p className="text-xs text-slate-300">Click any event to view guidelines, venue & organiser contact:</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {NON_TECHNICAL_EVENTS.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => handleSelectEvent(evt)}
                        className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/20 hover:border-purple-400 text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-mono font-bold flex items-center justify-center border border-purple-500/30">
                            {evt.code}
                          </span>
                          <div>
                            <div className="text-xs font-bold font-orbitron text-white group-hover:text-purple-300 transition-colors">
                              {evt.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{evt.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentView('main')}
                    className="mt-2 py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Menu</span>
                  </button>
                </motion.div>
              )}

              {/* VIEW 4: DETAILED EVENT CARD (MATCHES SCREENSHOT IMAGE 1 EXACTLY!) */}
              {currentView === 'event_detail' && selectedEvent && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3">
                  
                  {/* TITLE CARD */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <div>
                        <h4 className="text-sm font-black font-orbitron text-white leading-tight">
                          {selectedEvent.name}
                        </h4>
                        <span className="text-[11px] font-mono text-cyan-300">{selectedEvent.subtitle}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                      {selectedEvent.category}
                    </span>
                  </div>

                  {/* EVENT METADATA CARD (MODE, TEAM SIZE, VENUE, RULES) */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 flex flex-col gap-2">
                    {activeTabFilter === 'overview' && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span><strong>Mode:</strong> Offline, on-campus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span><strong>Team size:</strong> {selectedEvent.teamSize}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span><strong>Time & Venue:</strong> {selectedEvent.time} ({selectedEvent.venue})</span>
                        </div>
                        <div className="mt-1 pt-2 border-t border-slate-800/80 text-slate-300">
                          <p className="italic text-[11px]">{selectedEvent.shortDescription}</p>
                        </div>
                      </>
                    )}

                    {activeTabFilter === 'rules' && (
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-cyan-300 text-[11px] uppercase font-mono">Event Guidelines & Rules:</span>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                          {selectedEvent.guidelines.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTabFilter === 'team' && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-amber-300 text-[11px] uppercase font-mono">Team & Format Structure:</span>
                        <p className="text-[11px]">{selectedEvent.rounds}</p>
                        <p className="text-[11px]">Maximum Team Size: <strong>{selectedEvent.teamSize}</strong></p>
                      </div>
                    )}

                    {activeTabFilter === 'eligibility' && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-rose-300 text-[11px] uppercase font-mono">Eligibility Requirements:</span>
                        <p className="text-[11px]">Open to all BE / B.Tech / MCA / CS & allied engineering students. College ID card and Bonafide certificate are mandatory.</p>
                      </div>
                    )}

                    {activeTabFilter === 'evaluation' && (
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-purple-300 text-[11px] uppercase font-mono">Evaluation Criteria:</span>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                          {selectedEvent.evaluationCriteria ? (
                            selectedEvent.evaluationCriteria.map((c, i) => <li key={i}>{c}</li>)
                          ) : (
                            <li>Evaluated on speed, accuracy, technical depth, and presentation clarity.</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* ORGANISER CONTACT CARD (PHONE NUMBER) */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      <span>
                        <strong>Organiser:</strong> {getEventOrganiser(selectedEvent.id).name}
                      </span>
                    </div>
                    <a
                      href={`tel:${getEventOrganiser(selectedEvent.id).phone.replace(/\s+/g, '')}`}
                      className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-500/40 transition-colors"
                    >
                      {getEventOrganiser(selectedEvent.id).phone}
                    </a>
                  </div>
                </motion.div>
              )}

              {/* VIEW 5: SYMPOSIUM GENERAL RULES */}
              {currentView === 'rules' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>GENERAL SYMPOSIUM RULES</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      <li>Participation cap: Maximum 2 events (1 Tech + 1 Non-Tech).</li>
                      <li>Additional event fee: ₹50 per extra event.</li>
                      <li>College ID card & Bonafide certificate mandatory.</li>
                      <li>Formal dress code required on campus grounds.</li>
                      <li>Complimentary lunch & certificate provided.</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentView('main')}
                    className="py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Menu</span>
                  </button>
                </motion.div>
              )}

              {/* VIEW 6: COORDINATOR CONTACT LIST */}
              {currentView === 'contact' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-rose-500/30">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      <Phone className="w-4 h-4" />
                      <span>COORDINATOR CONTACTS</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">Student Coordinators:</div>
                      {STUDENT_COORDINATORS.map((sc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <span className="text-white font-semibold">{sc.name}</span>
                          <a href={`tel:${sc.phone.replace(/\s+/g, '')}`} className="text-cyan-300 font-mono text-[11px] underline">
                            {sc.phone}
                          </a>
                        </div>
                      ))}

                      <div className="text-[11px] font-mono text-purple-400 font-bold uppercase mt-1">Faculty Coordinators:</div>
                      {FACULTY_COORDINATORS.map((fc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <span className="text-white font-semibold">{fc.name}</span>
                          <a href={`tel:${fc.phone.replace(/\s+/g, '')}`} className="text-purple-300 font-mono text-[11px] underline">
                            {fc.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('main')}
                    className="py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Menu</span>
                  </button>
                </motion.div>
              )}

              {/* VIEW 7: CUSTOM HELP / QUERY SCREEN */}
              {currentView === 'custom_help' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <form onSubmit={handleCustomQuerySubmit} className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-cyan-300 font-bold uppercase">Ask any question or issue:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold font-mono hover:brightness-110 transition-all"
                      >
                        Ask
                      </button>
                    </div>
                  </form>

                  {customReply && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{customReply}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setCurrentView('main')}
                    className="py-2 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Menu</span>
                  </button>
                </motion.div>
              )}

            </div>

            {/* BOTTOM QUICK ACTION PILL BUTTONS (MATCHES SCREENSHOT IMAGE 1 & 2 EXACTLY!) */}
            <div className="relative z-10 p-3.5 bg-slate-950 border-t border-rose-500/20 flex flex-col gap-2">
              {/* PRIMARY ACTION PILLS ROW 1 */}
              <div className="flex flex-wrap items-center gap-1.5">
                {currentView === 'event_detail' ? (
                  <>
                    <button
                      onClick={() => setActiveTabFilter('rules')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTabFilter === 'rules'
                          ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.6)]'
                          : 'bg-slate-900 text-slate-200 border border-rose-500/40 hover:bg-slate-800'
                      }`}
                    >
                      Rules
                    </button>

                    <button
                      onClick={() => setActiveTabFilter('team')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTabFilter === 'team'
                          ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.6)]'
                          : 'bg-slate-900 text-slate-200 border border-purple-500/40 hover:bg-slate-800'
                      }`}
                    >
                      Team Size
                    </button>

                    <button
                      onClick={() => setActiveTabFilter('eligibility')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTabFilter === 'eligibility'
                          ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.6)]'
                          : 'bg-slate-900 text-slate-200 border border-indigo-500/40 hover:bg-slate-800'
                      }`}
                    >
                      Eligibility
                    </button>

                    <button
                      onClick={() => setActiveTabFilter('evaluation')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        activeTabFilter === 'evaluation'
                          ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                          : 'bg-slate-900 text-slate-200 border border-blue-500/40 hover:bg-slate-800'
                      }`}
                    >
                      Evaluation
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenRegistration && selectedEvent) {
                          onOpenRegistration(selectedEvent.id);
                          setIsOpen(false);
                        }
                      }}
                      className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
                    >
                      Register
                    </button>

                    <button
                      onClick={() => {
                        if (selectedEvent?.category === 'technical') {
                          setCurrentView('technical_list');
                        } else {
                          setCurrentView('non_tech_list');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-xs hover:bg-slate-800 cursor-pointer"
                    >
                      Back
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentView('technical_list')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        currentView === 'technical_list'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                          : 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-slate-200 border border-blue-500/40 hover:brightness-125'
                      }`}
                    >
                      Technical
                    </button>

                    <button
                      onClick={() => setCurrentView('non_tech_list')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        currentView === 'non_tech_list'
                          ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.6)]'
                          : 'bg-gradient-to-r from-purple-900/60 to-rose-900/60 text-slate-200 border border-purple-500/40 hover:brightness-125'
                      }`}
                    >
                      Non-Tech
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenRegistration) {
                          onOpenRegistration();
                          setIsOpen(false);
                        }
                      }}
                      className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
                    >
                      Register
                    </button>

                    <button
                      onClick={() => setCurrentView('rules')}
                      className="px-4 py-1.5 rounded-full bg-indigo-900/60 text-slate-200 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-800 transition-all cursor-pointer"
                    >
                      Rules
                    </button>

                    <button
                      onClick={() => setCurrentView('contact')}
                      className="px-4 py-1.5 rounded-full bg-slate-900 text-slate-200 border border-cyan-500/40 text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Contact
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentView('custom_help')}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(225,29,72,0.5)] hover:scale-105 transition-all cursor-pointer ml-auto"
                >
                  Need help?
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
