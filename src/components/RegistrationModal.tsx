import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { X, ExternalLink, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedEventId?: string;
}

const GOOGLE_FORM_DIRECT_URL = 'https://forms.gle/aPGrPT4jFbLFYPhF9';
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfJ7-z-mxELtm-IMS0oKBJVJNIhG-kmhTze2LwTo39sRofRw/viewform?embedded=true';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  const handleOpenExternal = () => {
    window.open(GOOGLE_FORM_DIRECT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 sm:p-6 overflow-hidden">
          {/* BACKDROP BLUR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
          />

          {/* MAIN FORM MODAL CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden z-10"
          >
            {/* MODAL HEADER */}
            <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black font-orbitron text-white leading-tight flex items-center gap-2">
                    <span>{SYMPOSIUM_CONFIG.name} REGISTRATION</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono hidden sm:block">
                    Official Registration Form • {SYMPOSIUM_CONFIG.department}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS (OPEN IN NEW TAB & CLOSE) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenExternal}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:brightness-110 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer"
                >
                  <span>Open Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* IFRAME CONTAINER */}
            <div className="relative flex-1 bg-white overflow-hidden">
              {!iframeLoaded && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10 text-slate-300">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">Loading Google Registration Form...</p>
                </div>
              )}

              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="CISABZ-2K26 Official Registration Google Form"
                className="w-full h-full border-0"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* MODAL FOOTER */}
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Form link: <strong className="text-cyan-300 font-mono">{GOOGLE_FORM_DIRECT_URL}</strong></span>
              </div>

              <button
                onClick={handleOpenExternal}
                className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] cursor-pointer"
              >
                Having trouble displaying? Click here to open form in new window ↗
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
