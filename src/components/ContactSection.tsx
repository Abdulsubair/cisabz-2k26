import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { Phone, Mail, MessageSquare, Send, MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';
import igQrCode from '../assets/cisabz26-ig-qr.png';

interface ContactSectionProps {
  onRegisterClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onRegisterClick }) => {

  return (
    <section id="contact" className="py-24 relative bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT WITH ORGANIZERS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            GET IN <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">TOUCH</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ duration: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Have questions about registration, event rules, or transportation? Contact our team.
          </motion.p>
        </div>

        {/* QUICK CONTACT ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto mb-16">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex flex-col items-start text-left group transition-all">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Coordinators</h3>
            </div>

            {/* Chairperson */}
            <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Chair</p>
            <div className="w-full space-y-1 mb-2">
              {[{ name: 'M. Mubashir', phone: '9514359887' }, { name: 'C. Vignesh', phone: '7871630097' }].map((c) => (
                <a key={c.name} href={`tel:${c.phone}`}
                  className="flex items-center justify-between w-full px-2 py-1 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all">
                  <span className="text-[10px] font-semibold text-white">{c.name}</span>
                  <span className="text-[9px] font-mono text-cyan-300">{c.phone}</span>
                </a>
              ))}
            </div>

            {/* Vice Chair */}
            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-1">Vice Chair</p>
            <div className="w-full space-y-1 mb-2">
              {['M. Abhirami', 'B.S. Subasri'].map((name) => (
                <div key={name} className="flex items-center justify-between w-full px-2 py-1 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-semibold text-white">{name}</span>
                </div>
              ))}
            </div>

            {/* Finance */}
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1">Finance</p>
            <div className="w-full space-y-1">
              {[{ name: 'K. Karan', phone: '9025970697' }, { name: 'N. Subair', phone: '6385228553' }].map((c) => (
                <a key={c.name} href={`tel:${c.phone}`}
                  className="flex items-center justify-between w-full px-2 py-1 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/20 transition-all">
                  <span className="text-[10px] font-semibold text-white">{c.name}</span>
                  <span className="text-[9px] font-mono text-amber-300">{c.phone}</span>
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={onRegisterClick}
            className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 flex flex-col items-center justify-center text-center group transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <div className="p-3.5 rounded-2xl bg-cyan-500 text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">REGISTER NOW</h3>
            <p className="text-xs text-cyan-300 font-mono">Ends 23 Sept 2026</p>
          </button>

          <a
            href={SYMPOSIUM_CONFIG.whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center text-center group transition-all relative overflow-hidden"
          >
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20 shadow-md">
              <svg className="w-6 h-6 fill-current text-emerald-400" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.179-.176.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.494-.897-.8-1.502-1.787-1.678-2.088-.176-.301-.019-.464.131-.614.136-.135.301-.351.451-.526.15-.176.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.589-.493-.51-.677-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.276.3-.978.956-.978 2.33 0 1.373 1.002 2.7 1.14 2.89.138.19 1.972 3.011 4.778 4.22.667.288 1.189.46 1.595.589.671.213 1.282.183 1.764.11.537-.081 1.653-.675 1.888-1.328.235-.653.235-1.21.164-1.328-.07-.118-.27-.194-.57-.344z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.523 5.84L.05 23.475l5.803-1.52C7.545 22.87 9.7 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.644-.492-5.22-1.425l-.374-.222-3.44.902.918-3.355-.244-.388C2.695 15.892 2 13.997 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">WHATSAPP GROUP</h3>
            <p className="text-xs text-emerald-400 font-mono">Tap to Join Group</p>
          </a>

          <a
            href="https://www.instagram.com/cisabz26"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 flex flex-col items-center justify-center text-center group transition-all"
          >
            {/* QR fixed at 80×80 — same icon-area height as other cards */}
            <div className="relative mb-4 group-hover:scale-110 transition-transform">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 shadow-lg border-2 border-pink-500/30 group-hover:border-pink-400/60 transition-all">
                <img
                  src={igQrCode}
                  alt="Scan to follow CISABZ26 on Instagram"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse leading-tight">
                SCAN
              </div>
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">INSTAGRAM</h3>
            <p className="text-xs text-pink-300 font-mono">@cisabz26</p>
          </a>

          <a
            href={`mailto:${SYMPOSIUM_CONFIG.emailPlaceholder}`}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center justify-center text-center group transition-all"
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

