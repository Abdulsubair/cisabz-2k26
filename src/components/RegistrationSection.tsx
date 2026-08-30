import React from 'react';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { Clock, CheckCircle2, ArrowRight, Sparkles, CreditCard } from 'lucide-react';

interface RegistrationSectionProps {
  onRegisterClick: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ onRegisterClick }) => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-glow opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 backdrop-blur-2xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>REGISTRATION CLOSES 23 SEPTEMBER 2026</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                SECURE YOUR SEAT AT <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">{SYMPOSIUM_CONFIG.name}</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl">
                Base registration permits participation in up to <strong className="text-white">2 events</strong> (1 Technical + 1 Non-Technical). Need more challenges? Add any additional event for just <strong className="text-cyan-400">₹50 per event</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Base Entry</div>
                    <div className="text-[11px] text-slate-400">Max 2 Events (1 Tech + 1 Non-Tech)</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Extra Event</div>
                    <div className="text-[11px] text-slate-400">₹50 per additional event</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Perks Included</div>
                    <div className="text-[11px] text-slate-400">Lunch, Certificates & Kit</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="w-full p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
                  OFFICIAL LINK PLACEHOLDER
                </div>
                <div className="text-xs font-mono text-cyan-400/80 truncate mb-4 bg-slate-900 p-2 rounded-xl">
                  {SYMPOSIUM_CONFIG.registrationLink}
                </div>

                <button
                  onClick={onRegisterClick}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
