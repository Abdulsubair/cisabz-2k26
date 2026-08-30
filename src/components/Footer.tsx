import React from 'react';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import { Calendar, Clock } from 'lucide-react';

interface FooterProps {
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Technical Events', href: '#technical-events' },
    { name: 'Non-Technical Events', href: '#non-technical-events' },
    { name: 'Guidelines', href: '#guidelines' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-amber-500/50 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                <img
                  src={ASSET_IMAGES.logo}
                  alt="CISABZ'26 Gold Shield Emblem Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                {SYMPOSIUM_CONFIG.name}
              </span>
            </div>

            <p className="text-sm text-cyan-400 font-semibold uppercase tracking-wider mb-2">
              TECHNICAL & NON-TECHNICAL EVENTS
            </p>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
              Organized by the {SYMPOSIUM_CONFIG.department}. Dedicated to inspiring technology innovation and collaborative competition.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{SYMPOSIUM_CONFIG.eventDate}</span>
              </div>

              <button
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-400 transition-colors cursor-pointer"
              >
                <span>Replay Intro</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-4">
              QUICK NAVIGATION
            </h4>
            <ul className="grid grid-cols-2 gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-cyan-500/50">&rsaquo;</span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest mb-4">
              REGISTRATION NOTICE
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                <Clock className="w-4 h-4" />
                <span>Deadline Info</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Registration Ends: <strong className="text-white">{SYMPOSIUM_CONFIG.registrationEndDate}</strong>
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Mandatory: ID Card & Bonafide Certificate.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; 2026 {SYMPOSIUM_CONFIG.name}. All Rights Reserved.
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Organized by {SYMPOSIUM_CONFIG.department}
          </div>
        </div>
      </div>
    </footer>
  );
};
