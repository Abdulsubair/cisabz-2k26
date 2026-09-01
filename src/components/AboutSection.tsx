import React from 'react';
import { motion } from 'framer-motion';
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

        {/* OFFICIAL CSE DEPARTMENT EVENTS - BOX TYPE (NO IMAGES) */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-xl sm:text-3xl font-black font-orbitron text-white flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span>DEPARTMENT OF CSE OFFICIAL EVENTS</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Academic Year 2025-2026 (EVEN & ODD) &bull; Guest Lectures, Orientation Programmes, Bridge Courses & Workshops
            </p>
          </div>

          {/* BOX CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cseEventBoxes.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.id * 0.08 }}
                  className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl ${item.borderColor} transition-all duration-300 shadow-xl flex flex-col justify-between group`}
                >
                  <div className="space-y-4">
                    {/* CARD TOP META */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* EVENT TITLE */}
                    <h4 className="text-lg font-bold font-orbitron text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>

                    {/* EVENT DATE & ACADEMIC YEAR */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400 font-bold pt-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.date}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-slate-400 text-[11px] font-normal">{item.academicYear}</span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* OBJECTIVE FOOTER */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2 text-xs font-sans text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.objective}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
