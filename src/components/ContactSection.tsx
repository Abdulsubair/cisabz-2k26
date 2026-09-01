import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG, STUDENT_COORDINATORS } from '../data/symposiumData';
import { Phone, Mail, MessageSquare, Send, MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';
import igQrCode from '../assets/cisabz26-ig-qr.png';

interface ContactSectionProps {
  onRegisterClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onRegisterClick }) => {
  const primaryPhone = STUDENT_COORDINATORS[0].phone;

  return (
    <section id="contact" className="py-24 relative bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT WITH ORGANIZERS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            GET IN <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">TOUCH</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Have questions about registration, event rules, or transportation? Contact our team.
          </motion.p>
        </div>

        {/* QUICK CONTACT ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex flex-col items-center text-center group transition-all"
          >
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">CALL COORDINATOR</h3>
            <p className="text-xs text-slate-400 font-mono">{primaryPhone}</p>
          </a>

          <button
            onClick={onRegisterClick}
            className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 flex flex-col items-center text-center group transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <div className="p-3.5 rounded-2xl bg-cyan-500 text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">REGISTER NOW</h3>
            <p className="text-xs text-cyan-300 font-mono">Ends 23 Sept 2026</p>
          </button>

          <a
            href="https://www.instagram.com/cisabz26"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-3xl bg-gradient-to-br from-pink-950/60 via-slate-900 to-purple-950/50 border border-pink-500/30 hover:border-pink-400/70 flex flex-col items-center text-center group transition-all shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]"
          >
            {/* QR CODE — scan to open IG */}
            <div className="relative w-full mb-3">
              <div className="rounded-2xl overflow-hidden border-2 border-pink-500/30 group-hover:border-pink-400/60 transition-all shadow-lg bg-white p-1.5">
                <img
                  src={igQrCode}
                  alt="Scan to follow CISABZ26 on Instagram"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
              {/* Tap-to-open hint badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                TAP TO OPEN
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <h3 className="text-sm font-bold text-white uppercase">CISABZ26</h3>
            </div>
            <p className="text-[10px] text-pink-300 font-mono">Scan QR or tap to follow</p>
          </a>

          <a
            href={`mailto:${SYMPOSIUM_CONFIG.emailPlaceholder}`}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center text-center group transition-all"
          >
            <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">EMAIL</h3>
            <p className="text-xs text-slate-400 font-mono truncate w-full">
              {SYMPOSIUM_CONFIG.emailPlaceholder}
            </p>
          </a>
        </div>

        {/* INTERACTIVE CAMPUS LOCATION MAP VIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl overflow-hidden p-6 sm:p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>INTERACTIVE CAMPUS NAVIGATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Find Your Way to Kings College
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                {SYMPOSIUM_CONFIG.collegeAddress}
              </p>
            </div>

            <a
              href={SYMPOSIUM_CONFIG.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all cursor-pointer group shrink-0"
            >
              <Navigation className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>GET DIRECTIONS ON GOOGLE MAPS</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* GOOGLE MAP IFRAME CONTAINER */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner group">
            <iframe
              title="Kings College of Engineering Google Map Location"
              src={SYMPOSIUM_CONFIG.googleMapsEmbedUrl}
              className="w-full h-full border-0 filter saturate-120 contrast-105"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* OVERLAY BADGE WITH DIRECT LINK */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={SYMPOSIUM_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-xl backdrop-blur-md hover:bg-cyan-950 transition-colors"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Open Directions in Google Maps</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

