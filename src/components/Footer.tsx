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
              <div className="w-12 h-12 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md" />
                <img
                  src={ASSET_IMAGES.logo}
                  alt="CISABZ'26 Gold Shield Emblem Logo"
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.7)]"
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

              <a
                href={SYMPOSIUM_CONFIG.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.179-.176.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.494-.897-.8-1.502-1.787-1.678-2.088-.176-.301-.019-.464.131-.614.136-.135.301-.351.451-.526.15-.176.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.589-.493-.51-.677-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.276.3-.978.956-.978 2.33 0 1.373 1.002 2.7 1.14 2.89.138.19 1.972 3.011 4.778 4.22.667.288 1.189.46 1.595.589.671.213 1.282.183 1.764.11.537-.081 1.653-.675 1.888-1.328.235-.653.235-1.21.164-1.328-.07-.118-.27-.194-.57-.344z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.523 5.84L.05 23.475l5.803-1.52C7.545 22.87 9.7 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.644-.492-5.22-1.425l-.374-.222-3.44.902.918-3.355-.244-.388C2.695 15.892 2 13.997 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                <span>WhatsApp Group</span>
              </a>

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
