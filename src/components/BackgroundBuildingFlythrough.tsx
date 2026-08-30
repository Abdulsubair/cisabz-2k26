import React from 'react';
import { motion } from 'framer-motion';
import { ASSET_IMAGES } from '../data/symposiumData';

export const BackgroundBuildingFlythrough: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
      {/* Background Motion Pan of Official CSE BLOCK & Campus Aerial */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125"
        style={{ backgroundImage: `url(${ASSET_IMAGES.cseDepartment})` }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Cyber Grid & Laser Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950" />
      <div className="absolute inset-0 bg-tech-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-glow opacity-40" />

      {/* Animated Laser Scanner Line */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00e5ff] animate-laser-scan" />
    </div>
  );
};
