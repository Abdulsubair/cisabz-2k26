import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { EventItem } from '../types';
import {
  FileText,
  BrainCircuit,
  Sparkles,
  Bug,
  Target,
  Eye,
  Gavel,
  Network,
  Users,
  Layers,
  Info,
  CheckCircle2,
  Play,
  Zap,
  Phone,
  User,
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onViewGuidelines: (event: EventItem) => void;
  onRegister: (eventId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  BrainCircuit,
  Sparkles,
  Bug,
  Target,
  Eye,
  Gavel,
  Network,
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onViewGuidelines,
  onRegister,
}) => {
  const IconComponent = iconMap[event.iconName] || FileText;

  const [debugOutput, setDebugOutput] = useState<string | null>(null);
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [clueStep, setClueStep] = useState<number>(1);
  const [biddingVal, setBiddingVal] = useState<number>(50);

  const handleRunDebug = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDebugOutput('Analyzing AST... Bug found at Line 14: NullPointerException in authHandler() [FIXED]');
  };

  const handleRunPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptResult('Generated Prompt: "Create a cyberpunk neural network UI with glowing cyan node shaders..."');
  };

  const handleNextClue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClueStep((prev) => (prev % 5) + 1);
  };

  const handleBidUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBiddingVal((prev) => prev + 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '200px' }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -6, transition: { duration: 0.15 } }}
      className="relative flex flex-col justify-between rounded-3xl bg-slate-900/85 border border-slate-800 p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.25)] group cyber-card overflow-hidden"
    >
      <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${event.colorTheme} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-black font-orbitron text-slate-700 group-hover:text-cyan-400 transition-colors">
            {event.code}
          </span>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-code font-semibold tracking-wider text-cyan-400 uppercase">
              {event.category}
            </span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform shadow-md">
              <IconComponent className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-tight mb-1 group-hover:text-cyan-300 transition-colors">
          {event.name}
        </h3>
        <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3">
          {event.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed mb-4">
          {event.shortDescription}
        </p>

        {event.id === 'bug-bash' && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-code text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Bug className="w-3.5 h-3.5" /> Interactive Debug Simulator
              </span>
              <button
                onClick={handleRunDebug}
                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3" /> Run Test
              </button>
            </div>
            <div className="text-slate-300 truncate">
              {debugOutput || 'Click "Run Test" to simulate automated bug detection...'}
            </div>
          </div>
        )}

        {event.id === 'prompt-fusion' && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-code text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> AI Prompt Sandbox
              </span>
              <button
                onClick={handleRunPrompt}
                className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3" /> Synthesize
              </button>
            </div>
            <div className="text-slate-300 truncate">
              {promptResult || 'Click "Synthesize" to generate high-tech AI prompt...'}
            </div>
          </div>
        )}

        {event.id === 'hammer-hit' && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-code text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Gavel className="w-3.5 h-3.5" /> Live Auction Simulator
              </span>
              <button
                onClick={handleBidUp}
                className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Bid +10 L
              </button>
            </div>
            <div className="text-slate-300">
              Current Virtual Budget Bid: <strong className="text-amber-400">₹{biddingVal} Lakhs</strong>
            </div>
          </div>
        )}

        {event.id === 'pinpoint' && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-code text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Target className="w-3.5 h-3.5" /> Clue Reveal Simulator
              </span>
              <button
                onClick={handleNextClue}
                className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Next Clue
              </button>
            </div>
            <div className="text-slate-300">
              Revealed Clue #{clueStep} of 5 &bull; <span className="text-purple-300 font-bold">Fewer clues = More points</span>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{event.rounds}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{event.teamSize}</span>
          </div>

          {event.organiser && (
            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Org:</span>
                <span className="truncate text-slate-200 font-medium">{event.organiser.name}</span>
              </div>
              <a
                href={`tel:${event.organiser.phone.replace(/\s+/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold hover:text-cyan-300 transition-colors shrink-0 ml-1"
              >
                <Phone className="w-3 h-3" />
                <span>{event.organiser.phone}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3">
        <button
          onClick={() => onViewGuidelines(event)}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4 text-slate-400" />
          <span>RULES</span>
        </button>

        <button
          onClick={() => onRegister(event.id)}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-cyan-500/30 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>REGISTER</span>
        </button>
      </div>
    </motion.div>
  );
};
