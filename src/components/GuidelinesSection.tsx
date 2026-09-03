import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
  BookOpen,
  Cpu,
  Gamepad2,
  Phone,
  Shirt,
  Utensils,
  AlertCircle,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface GuidelinesSectionProps {
  onRegisterClick?: () => void;
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({ onRegisterClick }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'technical' | 'non-technical' | 'coordinators'>('general');

  const generalInstructions = [
    {
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      title: 'Eligibility & Team Entry',
      description: 'Open for single or team entries. Maximum team size is up to 2 members per event.',
      highlight: 'Up to 2 Members per Team',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      title: 'Permitted Event Limit',
      description: 'Each participant can register for a maximum of 2 events (1 Technical + 1 Non-Technical).',
      highlight: '1 Tech + 1 Non-Tech Event',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: 'Spot Extra Events',
      description: 'An additional event (beyond the permitted 2) can be added for ₹50 per event on the spot.',
      highlight: '₹50 On The Spot Entry',
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: 'Rounds & Evaluation',
      description: 'Every event will be conducted in 2 or 3 level rounds. The decision of the judges will be final.',
      highlight: '2–3 Level Elimination Rounds',
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      title: 'Mandatory Documents',
      description: 'Official College ID Card and Bonafide Certificates are strictly mandatory for verification.',
      highlight: 'ID Card & Bonafide Mandatory',
    },
    {
      icon: <Shirt className="w-5 h-5 text-purple-400" />,
      title: 'Dress Code & Discipline',
      description: 'Participants must strictly adhere to formal dress code and maintain decorum throughout the event.',
      highlight: 'Strict Formal Dress Code',
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-400" />,
      title: 'Certificates & Rewards',
      description: 'Participation certificates will be awarded to all registered attendees, along with winner prizes.',
      highlight: 'Certificates for All Participants',
    },
    {
      icon: <Utensils className="w-5 h-5 text-teal-400" />,
      title: 'Food & Hospitality',
      description: 'Complimentary lunch and refreshments will be provided for all registered participants.',
      highlight: 'Complimentary Lunch & Refreshments',
    },
  ];

  const technicalGuidelines = [
    {
      name: 'TechVerse',
      subtitle: 'Paper Presentation',
      tag: 'Single Round',
      team: 'Individual or up to 3 members',
      rules: [
        'Present an innovative technical idea or research concept using PPT slides.',
        'Time allotted: strictly up to 5 minutes per team for presentation + Q&A.',
        'Topics must be relevant to current technology and innovation trends.',
        'Working models or live project demos are highly appreciated (not mandatory).',
        'Evaluation: Originality (25%), Technical Depth & Feasibility (25%), Presentation Clarity (25%), Q&A Response (25%).',
      ],
    },
    {
      name: 'Tech Brainiac',
      subtitle: 'Technical Quiz',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 3 members',
      rules: [
        'Conducted in 2 to 3 elimination rounds (Prelims → Rapid Fire → Final Round).',
        'Questions cover emerging technologies, CS fundamentals, IT trends, and programming logic.',
        'Rapid-fire format for later rounds where fastest correct answer scores highest.',
        'Teams/individuals are shortlisted between rounds based on progressive scores.',
      ],
    },
    {
      name: 'Prompt Fusion',
      subtitle: 'AI Prompt Challenge',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 2 members',
      rules: [
        'Conducted in 2 to 3 level rounds evaluating AI prompt engineering skills.',
        'Participants generate specific code outputs, structured data, or images using LLM prompts under time limits.',
        'Evaluated on prompt efficiency, precision, creativity, and speed.',
      ],
    },
    {
      name: 'Bug Bash',
      subtitle: 'Debugging Challenge',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 2 members',
      rules: [
        'Conducted in 2 to 3 level rounds (Prelims → Rapid Fire Debug → Final Bug Fix).',
        'Spot and fix syntax errors, logical flaws, and edge-case bugs in C++, Java, and Python code.',
        'Shortlisted based on speed, accuracy, and minimum syntax errors introduced during fixes.',
      ],
    },
  ];

  const nonTechnicalGuidelines = [
    {
      name: 'Pinpoint',
      subtitle: 'Category / Word Guessing',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 2 members',
      rules: [
        'Conducted in 2 to 3 progressive difficulty rounds.',
        'A hidden category or word must be guessed from 5 clue words revealed one at a time.',
        'Fewer clues used before guessing correctly yields higher scores.',
        'Rounds get progressively harder with tighter time limits.',
      ],
    },
    {
      name: 'Brand Spot',
      subtitle: 'Logo Finding Challenge',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 2 members',
      rules: [
        'Conducted in 2 to 3 rounds of visual logo recognition.',
        'Participants are shown partially obscured, blurred, or cropped brand logo images.',
        'Each round increases in difficulty (shorter time per slide or higher obscuration).',
        'Scored on the total number of correct brand identifications and response speed.',
      ],
    },
    {
      name: 'Hammer Hit',
      subtitle: 'IPL Mock Auction',
      tag: 'Single Round Event',
      team: 'Team participation (up to 4 members)',
      rules: [
        'Single round strategy event modeled after real IPL auctions.',
        'Each team is assigned a fixed virtual bidding budget to build their player squad.',
        'Teams take turns live bidding; highest bid secures the player.',
        'Winning team decided by overall squad balance, rating points, and financial management.',
      ],
    },
    {
      name: 'Connection',
      subtitle: 'Link & Think Visual Puzzle',
      tag: '2–3 Level Rounds',
      team: 'Individual or up to 2 members',
      rules: [
        'Conducted in 2 to 3 rounds featuring visual puzzles.',
        'Participants view a set of images and must identify the hidden word or concept linking them.',
        'Difficulty and number of images per clue set increase across rounds.',
        'Evaluated on accuracy and speed of identifying the common connection.',
      ],
    },
  ];

  return (
    <section id="guidelines" className="py-24 relative bg-slate-950 border-t border-slate-900 overflow-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFICIAL SYMPOSIUM GUIDELINES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 font-orbitron"
          >
            RULES & <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-300 to-indigo-400">GUIDELINES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-400 font-light font-rajdhani"
          >
            Official rules, eligibility criteria, and round guidelines for CISABZ-2K26.
          </motion.p>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-4xl mx-auto">
          {[
            { id: 'general', label: 'General Instructions', icon: <FileText className="w-4 h-4" /> },
            { id: 'technical', label: 'Technical Guidelines', icon: <Cpu className="w-4 h-4" /> },
            { id: 'non-technical', label: 'Non-Technical Guidelines', icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'coordinators', label: 'Coordinators & Helpdesk', icon: <Phone className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: GENERAL INSTRUCTIONS */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {generalInstructions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        {item.highlight}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-orbitron text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-rajdhani">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK HIGHLIGHT BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/30 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  IMPORTANT SUMMARY
                </div>
                <h4 className="text-xl font-bold font-orbitron text-white">
                  Event Date: {SYMPOSIUM_CONFIG.eventDate} | Registration Closes: {SYMPOSIUM_CONFIG.registrationEndDate}
                </h4>
                <p className="text-xs text-slate-400 max-w-2xl font-rajdhani">
                  Standard registration covers 1 Technical + 1 Non-Technical event for ₹{SYMPOSIUM_CONFIG.registrationFee}. Spot registration for additional events available on symposium day for ₹50 per extra event.
                </p>
              </div>

              {onRegisterClick && (
                <button
                  onClick={onRegisterClick}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white font-orbitron font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all shrink-0 cursor-pointer"
                >
                  REGISTER NOW
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: TECHNICAL GUIDELINES */}
        {activeTab === 'technical' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {technicalGuidelines.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                        TECHNICAL EVENT #{idx + 1}
                      </span>
                      <h3 className="text-xl font-bold font-orbitron text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{item.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-blue-950 text-cyan-300 text-xs font-mono border border-blue-500/40 block mb-1">
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        👥 {item.team}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {item.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-rajdhani">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 3: NON-TECHNICAL GUIDELINES */}
        {activeTab === 'non-technical' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {nonTechnicalGuidelines.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">
                        NON-TECHNICAL EVENT #{idx + 1}
                      </span>
                      <h3 className="text-xl font-bold font-orbitron text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{item.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-mono border border-purple-500/40 block mb-1">
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        👥 {item.team}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {item.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-rajdhani">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 4: COORDINATORS & HELPDESK */}
        {activeTab === 'coordinators' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* STUDENT COORDINATORS */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-orbitron text-white">Student Coordinators</h3>
                  <p className="text-xs text-slate-400 font-mono">Direct contacts for participant assistance</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'M MUBASHIR', phone: '95143 59887', role: 'Student Organizer' },
                  { name: 'C VIGNESH', phone: '7871630097', role: 'Student Organizer' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold font-orbitron text-white">{c.name}</h4>
                      <span className="text-[11px] font-mono text-emerald-400">{c.role}</span>
                    </div>
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, '')}`}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{c.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* STAFF COORDINATORS */}
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-orbitron text-white">Staff Coordinators</h3>
                  <p className="text-xs text-slate-400 font-mono">CSE Department Faculty Advisors</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Ms. B. BAVITHRA', role: 'Asst. Prof., CSE DEPT', phone: '78452 86608' },
                  { name: 'Ms. S. ABIKAYIL AARTHI', role: 'Asst. Prof., CSE DEPT', phone: '80128 15838' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold font-orbitron text-white">{c.name}</h4>
                      <span className="text-[11px] font-mono text-cyan-400">{c.role}</span>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{c.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
