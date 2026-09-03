import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  Terminal,
  Database,
  Presentation,
  X,
} from 'lucide-react';

interface CseEventBox {
  id: number;
  title: string;
  category: string;
  academicYear: string;
  date: string;
  icon: any;
  description: string;
  objective: string;
  badgeColor: string;
  borderColor: string;
}

export const AboutSection: React.FC = () => {
  const [activePopupEvent, setActivePopupEvent] = useState<CseEventBox | null>(null);

  // OFFICIAL CSE DEPARTMENT EVENTS (BOX TYPE - NO IMAGES)
  const cseEventBoxes: CseEventBox[] = [
    {
      id: 1,
      title: 'Guest Lecture: Network Troubleshooting & AI Rapid Prototyping',
      category: 'Department Guest Lecture',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '24.02.2026 & 27.02.2026',
      icon: Presentation,
      description:
        'Guest Lecture titled "Back to Basics: Essential Network Troubleshooting Techniques" organized on 24.02.2026 and "AI & Innovation Sprints Rapid Prototyping for Digital Transformation" organized on 27.02.2026.',
      objective: 'Empowering CSE students with real-world network troubleshooting skills & rapid AI prototyping.',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      borderColor: 'hover:border-cyan-400',
    },
    {
      id: 2,
      title: 'Guest Lecture: Enterprise Cyber Defense & Immersive AR / VR Technologies',
      category: 'Cyber Security & AR/VR Conclave',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '21.02.2026 & 31.03.2026',
      icon: ShieldCheck,
      description:
        'Guest Lecture titled "Enterprise Cybers Defense: Essentials and Best Practices" organized on 21.02.2026 and "Immersive Technologies - AR / VR" organized on 31.03.2026.',
      objective: 'Training CSE delegates in enterprise cybersecurity defense mechanisms and AR/VR spatial computing.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      borderColor: 'hover:border-purple-400',
    },
    {
      id: 3,
      title: 'Orientation Programme: Industry Alignment, GATE & Microprocessors',
      category: 'Department Orientation Programme',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '05.01.2025',
      icon: Layers,
      description:
        'Bridging Gap Between Industry with Education, GATE / Competitive Exam Awareness & Evolution of Microprocessor & Microcontroller, NPTEL Swayam Course Orientation.',
      objective: 'Preparing students for GATE competitive exams, industry readiness & NPTEL Swayam certifications.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      borderColor: 'hover:border-amber-400',
    },
    {
      id: 4,
      title: 'Bridge Course: Cyber Security, Linux Commands, HTML, CSS & JavaScript',
      category: 'Technical Foundation Bridge Course',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '05.01.2025',
      icon: Terminal,
      description:
        'Specialized Bridge Course Programme covering Cyber Security and Renewable Energy, Linux Commands, HTML, CSS, and JAVASCRIPT organized on 05.01.2025.',
      objective: 'Hands-on web development, Linux shell commands, and fundamental cybersecurity practices.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      borderColor: 'hover:border-emerald-400',
    },
    {
      id: 5,
      title: 'Workshop: Structured Query Language & Project Ideas into Patents',
      category: 'Technical & Patent Workshop',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '25.02.2026 & 09.04.2026',
      icon: Database,
      description:
        '3-Day Workshop titled "Structured Query Language" (SQL) organized from 09.04.2026 to 11.04.2026 and "Converting Project Ideas into Patents" organized on 25.02.2026.',
      objective: 'Master database query architecture and convert innovative student research into registered patents.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      borderColor: 'hover:border-blue-400',
    },
    {
      id: 6,
      title: 'CISABZ-2K26 National Level Technical & Non-Technical Symposium',
      category: 'Flagship National Symposium',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: SYMPOSIUM_CONFIG.eventDate,
      icon: Sparkles,
      description:
        'National Level Technical & Non-Technical Symposium featuring Paper Presentations (TechVerse), AI Prompt Fusion, Code Debugging (Bug Bash), Technical Quiz, and Bidding Events.',
      objective: 'Providing a premier national arena for computer science visionaries to compete and innovate.',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      borderColor: 'hover:border-rose-400',
    },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>ABOUT KINGS COLLEGE & DEPARTMENT OF CSE</span>
            </div>

            {/* MAIN TITLE REQUESTED BY USER */}
            <h2 className="text-3xl sm:text-5xl font-black font-orbitron tracking-tight text-white mb-4 leading-tight">
              WELCOME TO{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-amber-300 to-yellow-400">
                KINGS COLLEGE OF ENGINEERING
              </span>
            </h2>

            <p className="text-xs sm:text-sm font-bold font-mono text-cyan-300 uppercase tracking-widest mb-6">
              DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING &bull; ORGANIZERS OF {SYMPOSIUM_CONFIG.name}
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-sans font-normal">
              The <strong className="text-white font-semibold">Department of Computer Science and Engineering (CSE)</strong> at Kings College of Engineering (Autonomous) was established in the year 2001. Approved by AICTE, New Delhi and affiliated to Anna University, Chennai, the department administers B.E. Computer Science & Engineering and M.E. Computer Science & Engineering programmes. Our primary goal is to provide world-class IT infrastructure, a research-oriented learning environment, and foster technological leadership through active professional societies (IEI, ISTE) and industry collaborations.
            </p>
          </motion.div>
        </div>

        {/* OFFICIAL CSE DEPARTMENT EVENTS - 2 PER ROW ON MOBILE WITH LONG PRESS POPUP */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-xl sm:text-3xl font-black font-orbitron text-white flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span>DEPARTMENT OF CSE OFFICIAL EVENTS</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Academic Year 2025-2026 (EVEN & ODD) &bull; Click or hold card to preview full details
            </p>
          </div>

          {/* BOX CARDS GRID: 1 COLUMN ON MOBILE, 2 ON TABLET, 3 ON DESKTOP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 select-none">
            {cseEventBoxes.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: item.id * 0.05 }}
                  onClick={() => setActivePopupEvent(item)}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl ${item.borderColor} transition-all duration-300 shadow-xl flex flex-col justify-between group cursor-pointer active:scale-98 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]`}
                >
                  <div className="space-y-3">
                    {/* CARD TOP META: ICON & CATEGORY BADGE */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase border ${item.badgeColor}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* EVENT TITLE */}
                    <h4 className="text-sm sm:text-base font-bold font-orbitron text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>

                    {/* EVENT DATE */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold pt-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* POPUP MODAL FOR MOBILE & DESKTOP PREVIEW */}
        <AnimatePresence>
          {activePopupEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
                onClick={() => setActivePopupEvent(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,229,255,0.3)] z-10 flex flex-col gap-4 text-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
                      {React.createElement(activePopupEvent.icon, { className: 'w-6 h-6 text-cyan-400' })}
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${activePopupEvent.badgeColor}`}>
                        {activePopupEvent.category}
                      </span>
                      <h4 className="text-base sm:text-xl font-extrabold font-orbitron text-white mt-1 leading-snug">
                        {activePopupEvent.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePopupEvent(null)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 font-bold bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{activePopupEvent.date}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-300 font-normal">{activePopupEvent.academicYear}</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
                  <span className="font-bold font-mono text-cyan-300 text-[11px] uppercase block">Detailed Event Overview:</span>
                  <p>{activePopupEvent.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Objective:</strong> {activePopupEvent.objective}</span>
                </div>

                <p className="text-[10px] text-center text-slate-500 font-mono uppercase tracking-wider">
                  Click backdrop or press ✖ to close details
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
