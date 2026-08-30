import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES } from '../data/symposiumData';
import type { GalleryItem } from '../types';
import { Image as ImageIcon, X, Maximize2 } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>VISUAL HIGHLIGHTS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4"
          >
            MOMENTS OF <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">CISABZ</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            A glance at campus life, innovation labs, and past symposium triumphs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setActiveImage(img)}
              className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl cursor-pointer h-72 sm:h-80"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-end">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-500/30 mb-2 inline-block">
                    {img.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {img.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-lg"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden z-10 shadow-2xl"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-[60vh] sm:h-[70vh] bg-black">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    {activeImage.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">{activeImage.title}</h3>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
