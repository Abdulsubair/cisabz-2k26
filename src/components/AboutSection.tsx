import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import {
  Building2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Calendar,
  CheckCircle2,
  BookOpen,
  Layers,
} from 'lucide-react';

interface CseDepartmentEventSlide {
  id: number;
  title: string;
  category: string;
  academicYear: string;
  date: string;
  image: string;
  description: string;
  purpose: string;
}

export const AboutSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // OFFICIAL CSE DEPARTMENT EVENTS FROM KINGS COLLEGE WEBSITE (Academic Year 2025-2026 EVEN & ODD)
  const cseEvents: CseDepartmentEventSlide[] = [
    {
      id: 1,
      title: 'Guest Lecture: Essential Network Troubleshooting & AI Rapid Prototyping',
      category: 'Department Guest Lecture Programme',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '24.02.2026 & 27.02.2026',
      image: ASSET_IMAGES.cseEventGuestLecture1,
      description:
        'Guest Lecture titled "Back to Basics: Essential Network Troubleshooting Techniques" organized on 24.02.2026 and "AI & Innovation Sprints Rapid Prototyping for Digital Transformation" organized on 27.02.2026.',
      purpose: 'Goal: Empowering students with real-world network troubleshooting skills & rapid AI prototyping.',
    },
    {
      id: 2,
      title: 'Guest Lecture: Enterprise Cyber Defense & Immersive AR / VR Technologies',
      category: 'Cyber Security & AR/VR Conclave',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '21.02.2026 & 31.03.2026',
      image: ASSET_IMAGES.cseEventGuestLecture2,
      description:
        'Guest Lecture titled "Enterprise Cybers Defense: Essentials and Best Practices" organized on 21.02.2026 and "Immersive Technologies - AR / VR" organized on 31.03.2026.',
      purpose: 'Goal: Training CSE delegates in enterprise cybersecurity defense mechanisms and AR/VR spatial computing.',
    },
    {
      id: 3,
      title: 'Orientation Programme: Industry Alignment, GATE & Microprocessors',
      category: 'Department Orientation Programme',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '05.01.2025',
      image: ASSET_IMAGES.cseEventOrientation,
      description:
        'Bridging Gap Between Industry with Education, GATE / Competitive Exam Awareness & Evolution of Microprocessor & Microcontroller, NPTEL Swayam Course.',
      purpose: 'Goal: Preparing students for GATE competitive exams, industry readiness & NPTEL Swayam certifications.',
    },
    {
      id: 4,
      title: 'Bridge Course: Cyber Security, Linux Commands, HTML, CSS & JavaScript',
      category: 'Technical Foundation Bridge Course',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '05.01.2025',
      image: ASSET_IMAGES.cseEventBridgeCourse,
      description:
        'Specialized Bridge Course Programme covering Cyber Security and Renewable Energy, Linux Commands, HTML, CSS, and JAVASCRIPT organized on 05.01.2025.',
      purpose: 'Goal: Hands-on web technology, Linux terminal commands, and fundamental cybersecurity practices.',
    },
    {
      id: 5,
      title: 'Workshop: Structured Query Language & Project Ideas into Patents',
      category: 'Hands-on Technical & Patent Workshop',
      academicYear: 'Academic Year 2025-2026 (EVEN)',
      date: '25.02.2026 & 09.04.2026',
      image: ASSET_IMAGES.cseEventWorkshop,
      description:
        '3-Day Workshop titled "Structured Query Language" (SQL) organized from 09.04.2026 to 11.04.2026 and "Converting Project Ideas into Patents" organized on 25.02.2026.',
      purpose: 'Goal: Master database query design and convert student research projects into registered patents.',
    },
  ];

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % cseEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, cseEvents.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev + 1) % cseEvents.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev - 1 + cseEvents.length) % cseEvents.length);
  };

  const departmentPillars = [
    {
      icon: Building2,
      title: 'Established in 2001',
      desc: 'Approved by AICTE New Delhi and affiliated to Anna University, Chennai. Offering B.E. CSE and M.E. CSE programmes.',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      icon: Cpu,
      title: 'State-of-the-Art Computing Labs',
      desc: 'Full-fledged computer laboratories supported by high-speed fiber internet, wireless networks, and AI computing hardware.',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      icon: BookOpen,
      title: 'IIT Bombay & Professional Societies',
      desc: 'Active student chapters of IEI and ISTE regularly conducting workshops, seminars, and IIT Bombay Spoken Tutorial certifications.',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      icon: GraduationCap,
      title: 'Global Career & Research Placements',
      desc: 'Our CSE graduates occupy top technology leadership positions in premier IT corporate companies and research institutions globally.',
      color: 'border-emerald-500/40 text-emerald-400',
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

        {/* INTERACTIVE CAROUSEL: CSE DEPARTMENT OFFICIAL EVENTS (ACADEMIC YEAR 2025-2026) */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>CSE DEPARTMENT OFFICIAL EVENTS & ACTIVITIES</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Explore official events conducted by the Dept. of CSE (Academic Year 2025-2026 EVEN & ODD)
              </p>
            </div>

            {/* NAVIGATION ARROW BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
                title="Previous Event Photo"
              >
                <ChevronLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
                title="Next Event Photo"
              >
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* SLIDER CONTAINER */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]"
              >
                {/* LEFT PHOTO DISPLAY */}
                <div className="lg:col-span-7 relative overflow-hidden min-h-[260px] lg:min-h-full">
                  <img
                    src={cseEvents[activeSlide].image}
                    alt={cseEvents[activeSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />
                  
                  {/* CATEGORY & ACADEMIC YEAR OVERLAY */}
                  <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                      {cseEvents[activeSlide].category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                      {cseEvents[activeSlide].academicYear}
                    </span>
                  </div>
                </div>

                {/* RIGHT TEXT DETAILS */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {cseEvents[activeSlide].date}</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black font-orbitron text-white leading-snug">
                      {cseEvents[activeSlide].title}
                    </h4>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                      {cseEvents[activeSlide].description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
                    <div className="inline-flex items-start gap-2 text-xs font-sans text-cyan-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{cseEvents[activeSlide].purpose}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                      <span>Organized by Dept. of CSE</span>
                      <span>Event {activeSlide + 1} of {cseEvents.length}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* BOTTOM INDICATOR DOTS */}
            <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
              {cseEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#00e5ff]' : 'w-2 bg-slate-700'
                  }`}
                  title={`Go to event ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4 CORE DEPARTMENT PILLARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl bg-slate-900/80 border ${pillar.color} backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400 transition-all shadow-xl group`}
              >
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold font-orbitron text-white mb-2 leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {pillar.desc}
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
