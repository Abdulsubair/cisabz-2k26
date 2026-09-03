import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SYMPOSIUM_CONFIG } from '../data/symposiumData';
import { Calendar, Clock, ChevronRight, Trophy, Cpu, FileText } from 'lucide-react';
import cisabzLogo from '../assets/cisabz-logo.png';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRegisterClick, onExploreClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(SYMPOSIUM_CONFIG.eventDateISO).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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

    const matrixChars = '01010101CISABZ2K26CSEKINGSDEPTAI';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i += 2) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-radial-glow opacity-80 pointer-events-none z-0" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-glow" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* GOLD EMBLEM SYMPOSIUM LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.8 }}
          className="relative w-32 h-32 sm:w-44 sm:h-44 mb-4 flex items-center justify-center cursor-pointer group"
        >
          <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-3xl animate-pulse group-hover:bg-amber-400/40 transition-all" />
          <img
            src={cisabzLogo}
            alt="CISABZ'26 Gold Shield Emblem Logo"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(212,175,55,0.85)] group-hover:drop-shadow-[0_0_45px_rgba(255,215,0,0.95)] transition-all duration-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)]"
        >
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{SYMPOSIUM_CONFIG.department}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-lg sm:text-3xl font-black font-cinzel tracking-widest text-gradient-gold-luxury uppercase mb-2"
        >
          DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-cinzel-deco tracking-tight text-white mb-4 leading-none"
        >
          <span className="text-gradient-cyan-luxury drop-shadow-[0_0_40px_rgba(0,229,255,0.4)]">
            {SYMPOSIUM_CONFIG.name}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-2xl md:text-3xl font-black font-orbitron tracking-[0.3em] text-white uppercase mb-4"
        >
          CODE <span className="text-cyan-400">&bull;</span> CREATE <span className="text-amber-400">&bull;</span> CONQUER
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-slate-300 text-base sm:text-xl font-light italic mb-8 max-w-2xl"
        >
          &ldquo;{SYMPOSIUM_CONFIG.tagline}&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900/80 border border-cyan-500/40 text-white font-semibold text-sm backdrop-blur-md shadow-lg">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Event Date: <strong className="text-cyan-300 font-mono">{SYMPOSIUM_CONFIG.eventDate}</strong></span>
          </div>

          <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-950/70 to-slate-900/80 border border-rose-500/40 text-white font-semibold text-sm backdrop-blur-md shadow-lg">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Registration Ends: <strong className="text-rose-300 font-mono">{SYMPOSIUM_CONFIG.registrationEndDate}</strong></span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-2xl mb-12 cyber-card"
        >
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,229,255,0.2)]">
            <div className="text-xs font-code tracking-widest text-cyan-400 uppercase mb-4 text-center">
              <span>Live Countdown</span>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINUTES', value: timeLeft.minutes },
                { label: 'SECONDS', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 font-mono">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400 tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-orbitron font-bold text-sm tracking-widest uppercase shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:shadow-[0_0_50px_rgba(0,229,255,0.8)] hover:scale-105 transition-all cursor-pointer"
          >
            <span>REGISTER NOW</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-orbitron font-bold text-sm tracking-widest uppercase backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
          >
            <span>EXPLORE EVENTS</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </button>

          <a
            href="/CISABZ-2K26_Event_Guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-orbitron font-extrabold text-sm tracking-widest uppercase shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-105 transition-all cursor-pointer"
          >
            <FileText className="w-5 h-5 text-slate-950" />
            <span>GUIDELINES (PDF)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
