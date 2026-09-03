import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import { ArrowRight, ShieldCheck, Zap, Landmark, Sparkles } from 'lucide-react';
import cisabzLogo from '../assets/cisabz-logo.png';

interface CinematicIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, forcePlay = false }) => {
  // Phase 1: Campus Reel (steps 1..4), Phase 2: Cyber Matrix Loading (step 5)
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [skipped, setSkipped] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const campusReels = [
    {
      url: ASSET_IMAGES.drive,
      tag: 'CAMPUS ENTRANCE DRIVE',
      title: SYMPOSIUM_CONFIG.name,
      sub: SYMPOSIUM_CONFIG.department,
      icon: ShieldCheck,
    },
    {
      url: ASSET_IMAGES.walkway,
      tag: 'HEXAGONAL PALM WALKWAY',
      title: 'STATE-OF-THE-ART GROUNDS',
      sub: 'Approaching the Computer Science Arena...',
      icon: Zap,
    },
    {
      url: ASSET_IMAGES.aerial,
      tag: 'ACADEMIC COMPLEX AERIAL',
      title: 'KINGS COLLEGE INFRASTRUCTURE',
      sub: 'Punalkulam, Pudukkottai District, Tamil Nadu',
      icon: Landmark,
    },
    {
      url: ASSET_IMAGES.cseDepartment,
      tag: 'AUTHENTIC CSE BLOCK FACADE',
      title: 'DEPARTMENT OF COMPUTER SCIENCE',
      sub: `Your Gateway to ${SYMPOSIUM_CONFIG.name}`,
      icon: Sparkles,
    },
  ];

  // Sequence controller: Steps 1-4 campus photos -> Step 5 computer matrix -> complete
  useEffect(() => {
    const introSeen = localStorage.getItem('cisabz_intro_seen');
    if (introSeen && !forcePlay) {
      onComplete();
      return;
    }

    const reelTimers: ReturnType<typeof setTimeout>[] = [];

    // Step 1 to 2
    reelTimers.push(setTimeout(() => setStep(2), 2600));

    // Step 2 to 3
    reelTimers.push(setTimeout(() => setStep(3), 5200));

    // Step 3 to 4
    reelTimers.push(setTimeout(() => setStep(4), 7800));

    // Step 4 to 5 (Trigger Cyber Computer Matrix Loading)
    reelTimers.push(setTimeout(() => setStep(5), 10400));

    return () => reelTimers.forEach(clearTimeout);
  }, [forcePlay, onComplete]);

  // Handle Step 5 Cyber Computer Matrix Progress (0% to 100% over 5 Full Seconds)
  useEffect(() => {
    if (step !== 5) return;

    let current = 0;
    // 50ms interval x 100 increments = 5000ms (5 full seconds)
    const interval = setInterval(() => {
      current += 1;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          localStorage.setItem('cisabz_intro_seen', 'true');
          window.scrollTo(0, 0);
          onComplete();
        }, 1000); // 1s final pause before entering event page
      } else {
        setProgress(current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [step, onComplete]);

  // Interactive 3D Cyber Polygon Canvas for Step 5
  useEffect(() => {
    if (step !== 5) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    for (let i = 0; i < 45; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotating Central Cyber Hexagon
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angle);
      angle += 0.004;

      const sides = 6;
      const radius = Math.min(width, height) * 0.22;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = (i * 2 * Math.PI) / sides;
        const px = radius * Math.cos(a);
        const py = radius * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';
      ctx.stroke();
      ctx.restore();

      // Constellation Nodes
      ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [step]);

  const handleSkip = () => {
    setSkipped(true);
    localStorage.setItem('cisabz_intro_seen', 'true');
    window.scrollTo(0, 0);
    onComplete();
  };

  if (skipped) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-50 bg-black overflow-hidden select-none font-sans flex flex-col justify-between"
    >
      {/* BOTTOM-CENTER CONTAINER FOR ENTER WEBSITE BUTTON & PROGRESS STEPPER */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        {/* CENTERED ENTER WEBSITE / SKIP INTRO BUTTON */}
        <button
          onClick={handleSkip}
          className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-950/95 hover:bg-cyan-950 text-white border-2 border-cyan-500/60 hover:border-cyan-400 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] backdrop-blur-2xl group cursor-pointer"
        >
          <span>ENTER WEBSITE</span>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* PROGRESS STEPPER (5 STEPS) */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === s ? 'w-8 bg-cyan-400 shadow-[0_0_12px_#00e5ff]' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STAGE 1: KINGS CAMPUS REEL (STEPS 1 TO 4) */}
      <AnimatePresence mode="wait">
        {step >= 1 && step <= 4 && (
          <motion.div
            key={`campus-step-${step}`}
            className="absolute inset-0 bg-slate-950 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
          >
            {/* CAMPUS PHOTO BACKGROUND */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${campusReels[step - 1].url})` }}
              animate={{ scale: [1, 1.15] }}
              transition={{ duration: 3, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/20 to-slate-950/60" />
            </motion.div>

            {/* PURE FLOATING TOP-CENTER TYPOGRAPHY */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] backdrop-blur-xl">
                  {React.createElement(campusReels[step - 1].icon, { className: 'w-3 h-3 text-cyan-400' })}
                  <span>{campusReels[step - 1].tag}</span>
                </div>

                <h2 className="text-[10px] sm:text-xs font-bold font-orbitron text-slate-300 tracking-[0.25em] uppercase mb-1 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                  WELCOME TO
                </h2>

                <h1 className="text-2xl sm:text-4xl font-black font-cinzel-deco tracking-tight text-white mb-1.5 text-gradient-cyan-luxury drop-shadow-[0_0_30px_rgba(0,229,255,0.7)]">
                  {campusReels[step - 1].title}
                </h1>

                <p className="text-[11px] sm:text-xs text-cyan-300 font-mono font-bold tracking-widest uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                  {campusReels[step - 1].sub}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: NIC-SRM CYBER COMPUTER MATRIX PRELOADER (STEP 5) - 5 FULL SECONDS */}
        {step === 5 && (
          <motion.div
            key="computer-matrix-stage"
            className="absolute inset-0 bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.6 } }}
          >
            {/* FULL-SCREEN ELEGANT BLURRED CISABZ LOGO WATERMARK BACKDROP */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-md scale-110 pointer-events-none z-0"
              style={{ backgroundImage: `url(${cisabzLogo})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/90" />
            </div>

            {/* 3D CANVAS BACKGROUND */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 opacity-75" />

            {/* AMBIENT RADIAL LIGHT GLOW */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70 z-10 bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-amber-500/20" />

            <div className="relative z-30 flex flex-col items-center gap-6 max-w-xl">
              {/* NIC-SRM CYBER POLYGON SVG */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <svg viewBox="0 0 112 128" className="w-full h-full drop-shadow-[0_0_35px_rgba(0,229,255,0.7)]">
                  <polygon points="56.00,4.00 4.04,34.00 4.04,94.00 56.00,124.00 107.96,94.00 107.96,34.00" fill="#020617" />
                  <polygon
                    points="56.00,9.00 8.37,36.50 8.37,91.50 56.00,119.00 103.63,91.50 103.63,36.50"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="2.5"
                    strokeDasharray="400"
                    strokeDashoffset={400 - (400 * progress) / 100}
                    className="transition-all duration-100"
                  />
                  <polygon points="56.00,16.00 14.43,40.00 14.43,88.00 56.00,112.00 97.57,88.00 97.57,40.00" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <img
                    src={cisabzLogo}
                    alt="CISABZ'26 Gold Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-pulse"
                  />
                </div>
              </div>

              {/* COMPUTER MATRIX TICKER & PROGRESS BAR */}
              <div className="w-full flex flex-col items-center gap-3">
                <div className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-400 font-bold">
                  <span>INITIALISING MATRIX</span>
                  <span className="tabular-nums text-white">{String(progress).padStart(3, '0')}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-400 shadow-[0_0_20px_#00e5ff] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-300 font-semibold">
                  {progress < 100 ? `ENTERING ${SYMPOSIUM_CONFIG.name} ARENA...` : 'ACCESS GRANTED • LAUNCHING SITE'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
