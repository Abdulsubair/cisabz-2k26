import React from 'react';
import {
  Lock,
  ArrowLeft,
  ShieldCheck,
  AlertOctagon,
  Users,
  Building2,
  Calendar,
} from 'lucide-react';
import cisabzLogo from '../../assets/cisabz-logo.png';

interface ParticipantRegistrationPageProps {
  onBackToHome: () => void;
}

export const ParticipantRegistrationPage: React.FC<ParticipantRegistrationPageProps> = ({
  onBackToHome,
}) => {
  const handleGoToAdmin = () => {
    window.location.hash = 'admin';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER / NAVIGATION BAR */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-mono font-bold tracking-wider uppercase cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <img src={cisabzLogo} alt="CISABZ 2K26" className="w-9 h-9 object-contain" />
          <span className="font-orbitron font-extrabold text-base tracking-widest text-slate-100 hidden sm:inline">
            CISABZ <span className="text-cyan-400">2K26</span>
          </span>
        </div>

        <button
          onClick={handleGoToAdmin}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all text-xs font-mono font-bold tracking-wider uppercase cursor-pointer shadow-md"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Panel</span>
        </button>
      </div>

      {/* MAIN REGISTRATION CLOSED CARD */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6 z-10">
        <div className="bg-slate-900/95 border border-rose-500/40 rounded-3xl p-6 sm:p-12 shadow-[0_0_90px_rgba(244,63,94,0.18)] backdrop-blur-2xl text-center relative overflow-hidden">
          {/* Top Decorative Neon Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 animate-pulse" />

          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Registration Status: Closed</span>
          </div>

          {/* Glowing Lock Icon Container */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-amber-500/15 border border-rose-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-transform hover:scale-105">
            <Lock className="w-12 h-12 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
          </div>

          {/* Main Title */}
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-4xl text-white tracking-wide uppercase mb-3 leading-tight">
            Registration Has Been Closed
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-sans max-w-xl mx-auto mb-8 leading-relaxed">
            Online registrations for <span className="text-cyan-400 font-semibold">CISABZ-2K26 National Level Technical Symposium</span> are officially closed.
          </p>

          {/* Notice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-5 flex items-start gap-3.5 shadow-inner">
              <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-orbitron font-bold text-xs text-slate-100 uppercase tracking-wider mb-1">
                  Students Notice
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Students are no longer able to register for any technical or non-technical events. All online registration forms are closed.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3.5 shadow-inner">
              <Users className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-orbitron font-bold text-xs text-slate-100 uppercase tracking-wider mb-1">
                  Admin Panel Only
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Only administrators can access and view the master list of registered students through the dedicated Admin Panel.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-orbitron font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              Back to Website
            </button>

            <button
              onClick={handleGoToAdmin}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all cursor-pointer hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Admin Panel</span>
            </button>
          </div>

          {/* Venue & Information footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Department of Computer Science & Engineering
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              Symposium Date: Sept 25, 2026
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-6xl w-full mx-auto text-center z-10 py-2">
        <p className="text-xs text-slate-500 font-mono">
          © 2026 CISABZ 2K26 - Kings College of Engineering.
        </p>
      </div>
    </div>
  );
};
