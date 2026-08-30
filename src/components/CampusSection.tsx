import React from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import { MapPin, ExternalLink, Building2, Landmark, Compass } from 'lucide-react';

export const CampusSection: React.FC = () => {
  return (
    <section className="py-24 relative bg-slate-950/90 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>AUTHENTIC CAMPUS & VENUE HIGHLIGHTS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-cinzel text-white tracking-tight mb-4"
          >
            WELCOME TO <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">KINGS CAMPUS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Explore our magnificent academic infrastructure, CSE block, and lush campus grounds.
          </motion.p>
        </div>

        {/* 4 REAL PHOTOS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch mb-12">
          {/* PHOTO 1: MAIN ACADEMIC COMPLEX AERIAL SUNSET */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-slate-800 group shadow-2xl min-h-[360px] flex flex-col justify-end cyber-card"
          >
            <img
              src={ASSET_IMAGES.aerial}
              alt="Kings Academic Complex Aerial View"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase mb-3 backdrop-blur-md border border-cyan-500/30">
                <Landmark className="w-3.5 h-3.5" />
                <span>GRAND ACADEMIC COMPLEX & GROUNDS</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-cinzel text-white mb-2">
                {SYMPOSIUM_CONFIG.collegeName}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-normal">
                {SYMPOSIUM_CONFIG.collegeAddress}
              </p>
            </div>
          </motion.div>

          {/* PHOTO 1: AUTHENTIC MAIN BLOCK */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 relative rounded-3xl overflow-hidden border border-cyan-500/40 group shadow-xl min-h-[360px] flex flex-col justify-end cyber-card"
          >
            <img
              src={ASSET_IMAGES.cseDepartment}
              alt="Kings College Main Block Building Facade"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-6">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300 uppercase block w-fit mb-2">
                AUTHENTIC MAIN BLOCK
              </span>
              <h4 className="text-xl font-extrabold font-orbitron text-white mb-1">
                Main Block
              </h4>
              <p className="text-xs text-slate-300 font-light">
                Home of Kings College of Engineering
              </p>
            </div>
          </motion.div>

          {/* PHOTO 2: HEXAGONAL WALKWAY & PALMS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-slate-800 group shadow-xl h-64 cyber-card"
          >
            <img
              src={ASSET_IMAGES.walkway}
              alt="Campus Paved Walkway"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-sm font-bold font-orbitron text-white uppercase tracking-wider block">
                Hexagonal Paved Campus Walkway
              </span>
              <span className="text-xs text-slate-300 font-mono">Sunlit Palm Groves</span>
            </div>
          </motion.div>

          {/* PHOTO 3: MAIN CSE BUILDING & ENTRANCE DRIVE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-slate-800 group shadow-xl h-64 cyber-card flex flex-col justify-between p-6"
          >
            <img
              src={ASSET_IMAGES.drive}
              alt="Main Building of Computer Science and Engineering"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                MAIN CSE BLOCK
              </span>
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold font-orbitron text-white mb-1">
                  Main Building of Computer Science and Engineering
                </h4>
                <p className="text-xs text-slate-300">Kings College Campus</p>
              </div>

              <a
                href={SYMPOSIUM_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
