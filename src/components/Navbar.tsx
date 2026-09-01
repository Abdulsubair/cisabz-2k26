import React, { useState, useEffect } from 'react';
import { SYMPOSIUM_CONFIG, ASSET_IMAGES } from '../data/symposiumData';
import { Menu, X, Play } from 'lucide-react';

interface NavbarProps {
  onRegisterClick: () => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRegisterClick, onReplayIntro }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = [
        'home',
        'about',
        'technical-events',
        'non-technical-events',
        'schedule',
        'patrons',
        'contact',
      ];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Technical', href: '#technical-events', id: 'technical-events' },
    { name: 'Non-Technical', href: '#non-technical-events', id: 'non-technical-events' },
    { name: 'Schedule', href: '#schedule', id: 'schedule' },
    { name: 'Patrons', href: '#patrons', id: 'patrons' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-slate-950/90 backdrop-blur-2xl border-b border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-5 bg-gradient-to-b from-slate-950/95 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-11 h-11 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md group-hover:bg-amber-400/50 transition-all" />
            <img
              src={ASSET_IMAGES.logo}
              alt="CISABZ'26 Gold Shield Emblem Logo"
              className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            />
          </div>
          <div className="whitespace-nowrap shrink-0">
            <span className="text-lg sm:text-xl font-black font-orbitron tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap block">
              {SYMPOSIUM_CONFIG.name}
            </span>
            <span className="hidden sm:block text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase whitespace-nowrap">
              CSE DEPT SYMPOSIUM
            </span>
          </div>
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onReplayIntro}
            title="Replay College Entrance Journey"
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onRegisterClick}
            className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-orbitron font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all cursor-pointer"
          >
            <span className="relative z-10">REGISTER NOW</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onReplayIntro}
            title="Replay Intro"
            className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 cursor-pointer"
          >
            <Play className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-slate-950/98 backdrop-blur-2xl border-b border-cyan-500/30 p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeSection === link.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-orbitron font-bold text-center text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              REGISTER NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
