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
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface DepartmentEventSlide {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  stats: string;
}

export const AboutSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const eventSlides: DepartmentEventSlide[] = [
    {
      id: 1,
      title: 'CISABZ-2K26 National Technical & Non-Technical Symposium',
      category: 'Flagship Department Event',
      date: '25 SEPTEMBER 2026',
      image: ASSET_IMAGES.cseDepartment,
      description:
        'The Department of Computer Science & Engineering presents CISABZ-2K26—a premier technical arena bringing together delegates from across top engineering institutions to compete in Paper Presentations, AI Prompt Engineering, Code Debugging, Technical Quiz, and High-Energy Bidding.',
      stats: '500+ Expected Delegates • 8 Elite Events',
    },
    {
      id: 2,
      title: 'National Workshop on AI, Machine Learning & Cloud Architectures',
      category: 'Hands-on Technology Conclave',
      date: 'CSE Department Special Event',
      image: ASSET_IMAGES.drive,
      description:
        'Hands-on technical workshop series organized by CSE Department faculty and industry experts, training students in modern Neural Networks, LLMs, and Cloud Deployment in our high-end computing laboratories.',
      stats: '200+ Student Technocrats Trained',
    },
    {
      id: 3,
      title: 'Competitive Algorithmic Coding & Bug Debugging League',
      category: 'Department Technical Challenge',
      date: 'Annual CSE Hackathon',
      image: ASSET_IMAGES.walkway,
      description:
        'Intensive speed-coding competition fostering algorithmic thinking, syntax optimization, and real-time debugging skills under simulated industrial constraints.',
      stats: 'CSE Computing Lab 1 & 2',
    },
    {
      id: 4,
      title: 'Industry-Institute Interface & Guest Lecture Series',
      category: 'Career & Tech Seminar',
      date: 'Regular Department Conclave',
      image: ASSET_IMAGES.aerial,
      description:
        'Interactive conclave with chief software architects, IT industry leaders, and distinguished alumni guiding students on full-stack software development and career opportunities.',
      stats: '100% Student Placement Guidance',
    },
  ];

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % eventSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, eventSlides.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev + 1) % eventSlides.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);
  };

  const departmentPillars = [
    {
      icon: Building2,
      title: 'Autonomous & NAAC Accredited',
      desc: 'Kings College of Engineering operates with Autonomous status, offering industry-aligned computer science curriculum.',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      icon: Cpu,
      title: 'Advanced Computing Labs',
      desc: 'State-of-the-art computer laboratories equipped with high-speed fiber internet and high-performance AI development rigs.',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      icon: GraduationCap,
      title: 'High Placement Track Record',
      desc: 'Dedicated career guidance ensuring our CSE graduates land lucrative roles across leading IT product and service companies.',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      icon: Users,
      title: 'Dynamic CISABZ Association',
      desc: 'Vibrant student-led association fostering continuous technical innovation, coding clubs, and national-level symposiums.',
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
              <span>ABOUT KINGS COLLEGE & CSE DEPARTMENT</span>
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
              <strong className="text-white font-semibold">Kings College of Engineering (Autonomous)</strong>, Punalkulam, is a premier NAAC-accredited institution approved by AICTE New Delhi and affiliated to Anna University, Chennai. The <strong className="text-cyan-300 font-semibold">Department of Computer Science and Engineering</strong> strives for technical excellence, research innovation, and holistic student development—empowering future software leaders through industry-aligned education, hands-on workshops, and our flagship National Level Technical Symposium, <strong className="text-amber-400 font-semibold font-orbitron">{SYMPOSIUM_CONFIG.name}</strong>.
            </p>
          </motion.div>
        </div>

        {/* INTERACTIVE CAROUSEL: CSE DEPARTMENT EVENTS & ACTIVITIES */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>CSE DEPARTMENT EVENT MILESTONES & ACTIVITIES</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Explore key symposiums, technical workshops, and conclaves organized by the CSE Department
              </p>
            </div>

            {/* NAVIGATION ARROW BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
                title="Previous Photo Event"
              >
                <ChevronLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
                title="Next Photo Event"
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
                    src={eventSlides[activeSlide].image}
                    alt={eventSlides[activeSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />
                  
                  {/* CATEGORY TAG OVERLAY */}
                  <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/50 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                    {eventSlides[activeSlide].category}
                  </div>
                </div>

                {/* RIGHT TEXT DETAILS */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                      <Calendar className="w-4 h-4" />
                      <span>{eventSlides[activeSlide].date}</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black font-orbitron text-white leading-snug">
                      {eventSlides[activeSlide].title}
                    </h4>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                      {eventSlides[activeSlide].description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{eventSlides[activeSlide].stats}</span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {activeSlide + 1} / {eventSlides.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* BOTTOM INDICATOR DOTS */}
            <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
              {eventSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#00e5ff]' : 'w-2 bg-slate-700'
                  }`}
                  title={`Go to slide ${idx + 1}`}
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
