import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG, STUDENT_COORDINATORS } from '../data/symposiumData';
import { Phone, Mail, MessageSquare, Send } from 'lucide-react';

interface ContactSectionProps {
  onRegisterClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onRegisterClick }) => {
  const primaryPhone = STUDENT_COORDINATORS[0].phone;

  return (
    <section id="contact" className="py-24 relative bg-slate-950">
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
            href={SYMPOSIUM_CONFIG.instagramPlaceholder}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 flex flex-col items-center text-center group transition-all"
          >
            <div className="p-3.5 rounded-2xl bg-pink-500/10 text-pink-400 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">INSTAGRAM</h3>
            <p className="text-xs text-slate-400 font-mono">Official Updates</p>
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
      </div>
    </section>
  );
};
