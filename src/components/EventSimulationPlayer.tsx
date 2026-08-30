import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Zap,
  BrainCircuit,
  FileText,
  Bug,
  Target,
  Eye,
  Gavel,
  Network,
  Award,
  ChevronRight,
} from 'lucide-react';
import type { EventItem } from '../types';

interface EventSimulationPlayerProps {
  event: EventItem;
}

export const EventSimulationPlayer: React.FC<EventSimulationPlayerProps> = ({ event }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10);
  const [score, setScore] = useState<number>(0);

  // Auto animation step sequence controller
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 4);
        setTimer((prev) => (prev <= 1 ? 10 : prev - 1));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Score simulator increment
  useEffect(() => {
    if (step === 2 || step === 3) {
      setScore((prev) => Math.min(980, prev + 150));
    }
  }, [step]);

  const handleReset = () => {
    setStep(0);
    setTimer(10);
    setScore(0);
    setIsPlaying(true);
  };

  // Render specific animated demo for each event type
  const renderEventSpecificDemo = () => {
    switch (event.id) {
      case 'techverse':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-blue-500/30 overflow-hidden font-mono">
            {/* PRESENTATION STAGE SIMULATOR */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>STAGE 01 // PPT & LIVE DEMO PRESENTATION</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-code text-[11px]">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>TIMER: 04:42 / 05:00</span>
              </div>
            </div>

            {/* STAGE SCREEN ANIMATION */}
            <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* STUDENT PRESENTER */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="relative w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <User className="w-8 h-8 text-cyan-300" />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-black text-[9px] font-bold rounded-full">
                    SPEAKING
                  </span>
                </div>
                <span className="text-xs font-bold text-white">Student Presenter</span>
                <span className="text-[10px] text-cyan-400">Team KCE Innovators</span>
              </div>

              {/* LIVE SLIDE DECK SCREEN */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-900 border border-cyan-500/40 relative overflow-hidden flex flex-col justify-between">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>PROJECT SLIDE #{step + 1}</span>
                  <span className="text-emerald-400 animate-pulse">&bull; DEMO LIVE</span>
                </div>
                <div className="my-2">
                  <div className="text-sm font-bold font-orbitron text-cyan-300">
                    {step === 0 && 'AI Quantum Architecture & Cloud Edge Node'}
                    {step === 1 && 'System Workflow & High Performance Data Pipeline'}
                    {step === 2 && 'Live Prototype Code & Real-Time Performance'}
                    {step === 3 && 'Q&A Discussion & Future Scalability'}
                  </div>
                  <div className="text-xs text-slate-300 mt-1 font-sans">
                    {step === 0 && 'Demonstrating core novelty and problem statement to the judges.'}
                    {step === 1 && 'Explaining architecture diagrams and algorithms.'}
                    {step === 2 && 'Executing working model demo with live telemetry output.'}
                    {step === 3 && 'Answering technical questions from university evaluation panel.'}
                  </div>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full"
                    animate={{ width: `${(step + 1) * 25}%` }}
                  />
                </div>
              </div>
            </div>

            {/* JUDGES EVALUATION SCORES */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Judges Live Score:</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">Novelty: <strong className="text-white">9.5/10</strong></span>
                <span className="text-purple-400">Demo: <strong className="text-white">9.8/10</strong></span>
                <span className="text-amber-400">Q&A: <strong className="text-white">9.2/10</strong></span>
              </div>
            </div>
          </div>
        );

      case 'tech-brainiac':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-purple-500/30 overflow-hidden font-mono">
            {/* QUIZ ARENA HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>RAPID-FIRE QUIZ ARENA // ROUND 02</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>SCORE: {score} PTS</span>
              </div>
            </div>

            {/* LIVE QUESTION DISPLAY */}
            <div className="my-3 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 relative">
              <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-1">
                QUESTION #{step + 1} (TIME REMAINING: {timer}s)
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mb-2">
                Which data structure guarantees O(1) average lookup time complexity?
              </div>

              {/* BUZZER ANIMATION */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className={`p-2 rounded-lg border text-xs font-bold transition-all ${step >= 2 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  A. Hash Table {step >= 2 && '✓ (CORRECT & FASTEST)'}
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-xs">
                  B. Binary Search Tree
                </div>
              </div>
            </div>

            {/* BUZZER PLAYER STATS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Team A</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-bold">
                  BUZZED IN!
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs opacity-60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Student Team B</span>
                </span>
                <span className="text-[10px] text-slate-500">READY</span>
              </div>
            </div>
          </div>
        );

      case 'prompt-fusion':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/30 overflow-hidden font-mono">
            {/* AI PROMPT STUDIO HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI PROMPT CHALLENGE // GENERATIVE LAB</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                MODEL: GPT-4o / MIDJOURNEY AI
              </div>
            </div>

            {/* PROMPT EDITOR SIMULATOR */}
            <div className="my-3 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-cyan-400 font-bold">$ prompt: </span>
                <span className="text-slate-200">
                  {step === 0 && 'Drafting initial prompt for futuristic cyber website architecture...'}
                  {step === 1 && '"Create a responsive dark UI dashboard with neon glassmorphism & particle FX"'}
                  {step === 2 && 'Optimizing tokens with zero-shot chain-of-thought system instructions...'}
                  {step === 3 && '"Refine palette: HSL cyan 190, dark slate-950 background, sub-second latency"'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 relative overflow-hidden">
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>AI MODEL OUTPUT PREVIEW</span>
                  <span className="text-emerald-400">PRECISION SCORE: 98%</span>
                </div>
                <div className="text-xs text-slate-200 bg-slate-950/80 p-2 rounded-lg border border-slate-800 font-code">
                  {step < 2 ? (
                    <span className="text-slate-400 animate-pulse">&gt; Rendering neural token stream...</span>
                  ) : (
                    <span className="text-emerald-300">✓ AI UI Code & Graphic Rendered Successfully in 0.8s!</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Evaluation Criteria:</span>
              <span className="text-cyan-300 font-bold">Prompt Clarity (40%) &bull; Output Accuracy (60%)</span>
            </div>
          </div>
        );

      case 'bug-bash':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-emerald-500/30 overflow-hidden font-mono">
            {/* DEBUGGING IDE HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Bug className="w-4 h-4 text-emerald-400" />
                <span>BUG BASH // CODE DEBUGGING IDE</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                LANG: C++ / PYTHON 3.12
              </div>
            </div>

            {/* CODE WINDOW WITH BUGS AND FIXES */}
            <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-code text-xs space-y-1">
              <div className="text-slate-500">1 | int main() &#123;</div>
              <div className="text-slate-300 pl-4">
                2 | vector&lt;int&gt; arr = &#123;5, 2, 9, 1, 7.5&#125;;
              </div>
              <div className={`pl-4 py-0.5 rounded ${step < 2 ? 'bg-rose-500/20 text-rose-300 border-l-2 border-rose-500' : 'bg-emerald-500/20 text-emerald-300 border-l-2 border-emerald-500'}`}>
                3 | {step < 2 ? 'for(int i=0; i<=arr.size(); i++)  // BUG: IndexOutOfBounds' : 'for(int i=0; i<arr.size(); i++)   // FIXED!'}
              </div>
              <div className="text-slate-300 pl-4">4 | cout &lt;&lt; arr[i] &lt;&lt; endl;</div>
              <div className="text-slate-500">5 | return 0; &#125;</div>
            </div>

            {/* TEST CASE EXECUTION STATUS */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Test Execution:</span>
              {step < 2 ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <span>❌ 2/5 Test Cases Failed (Runtime Error)</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>✓ 5/5 Test Cases Passed! (+200 PTS)</span>
                </span>
              )}
            </div>
          </div>
        );

      case 'pinpoint':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-amber-500/30 overflow-hidden font-mono">
            {/* PINPOINT DEDUCTION HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Target className="w-4 h-4 text-amber-400" />
                <span>PINPOINT // 5-CLUE WORD DEDUCTION</span>
              </div>
              <div className="text-amber-300 font-bold">ROUND 01</div>
            </div>

            {/* 5 PROGRESSIVE CLUES GRID */}
            <div className="my-3 space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Revealed Clues:</div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  Clue 1: Internet
                </div>
                <div className={`p-2 rounded-lg border font-bold ${step >= 1 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                  Clue 2: {step >= 1 ? 'Decentralized' : '🔒 [Locked]'}
                </div>
                <div className={`p-2 rounded-lg border font-bold ${step >= 2 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                  Clue 3: {step >= 2 ? 'Ledger Blocks' : '🔒 [Locked]'}
                </div>
                <div className={`p-2 rounded-lg border font-bold ${step >= 3 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                  Clue 4: {step >= 3 ? 'Cryptography' : '🔒 [Locked]'}
                </div>
              </div>

              {/* STUDENT GUESS INPUT */}
              <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-between text-xs">
                <span className="text-slate-400">Student Guess:</span>
                <span className="text-amber-300 font-bold uppercase tracking-widest">
                  {step >= 2 ? 'BLOCKCHAIN (CORRECT!)' : 'Thinking...'}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Scoring Rule: Fewer clues used = Higher points awarded!
            </div>
          </div>
        );

      case 'brand-spot':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-pink-500/30 overflow-hidden font-mono">
            {/* BRAND SPOT HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <Eye className="w-4 h-4 text-pink-400" />
                <span>BRAND SPOT // OBSCURED LOGO RECOGNITION</span>
              </div>
              <div className="text-pink-300 font-bold">TIME: {timer}s</div>
            </div>

            {/* OBSCURED LOGO SIMULATOR */}
            <div className="my-3 p-4 rounded-xl bg-slate-900 border border-pink-500/40 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl transition-all duration-700 ${step < 2 ? 'blur-md scale-95 opacity-70' : 'blur-none scale-100 opacity-100'}`}>
                NVIDIA
              </div>
              <div className="mt-2 text-xs font-bold text-slate-300">
                {step < 2 ? '🔍 Obscured Image (Unblurring...)' : '✓ Logo Revealed: NVIDIA'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Student Answer:</span>
              <span className="text-pink-400 font-bold">
                {step >= 2 ? 'NVIDIA (+300 PTS)' : 'Identifying...'}
              </span>
            </div>
          </div>
        );

      case 'hammer-hit':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-yellow-500/30 overflow-hidden font-mono">
            {/* IPL AUCTION HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Gavel className="w-4 h-4 text-yellow-400" />
                <span>HAMMER HIT // IPL MOCK AUCTION ARENA</span>
              </div>
              <div className="text-yellow-300 font-bold">PURSE: ₹45,50,000</div>
            </div>

            {/* AUCTION STAGE SIMULATOR */}
            <div className="my-3 p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/40 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <div className="text-[10px] text-yellow-400 font-bold uppercase">CURRENT PLAYER ON BID:</div>
                <div className="text-sm font-bold text-white">V. KOHLI (All-Rounder)</div>
                <div className="text-xs text-slate-400 mt-1">Base Price: ₹2,00,000</div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-yellow-500/40 text-center">
                <div className="text-[10px] text-slate-400 uppercase">CURRENT HIGHEST BID:</div>
                <div className="text-sm font-bold text-amber-300">
                  ₹{200000 + step * 50000}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                  {step === 3 ? '🔨 SOLD TO TEAM KCE!' : '⚡ BIDDING IN PROGRESS'}
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Strategy:</span>
              <span className="text-yellow-400 font-bold">Maximize Squad Value within Virtual Budget</span>
            </div>
          </div>
        );

      case 'connection':
        return (
          <div className="relative h-full flex flex-col justify-between p-4 bg-slate-950/90 rounded-2xl border border-violet-500/30 overflow-hidden font-mono">
            {/* CONNECTION PUZZLE HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <Network className="w-4 h-4 text-violet-400" />
                <span>CONNECTION // VISUAL LOGIC & PUZZLE LINKS</span>
              </div>
              <div className="text-violet-300 font-bold">GRID 4x4</div>
            </div>

            {/* 4 PUZZLE TILES SIMULATOR */}
            <div className="my-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-violet-500/40 text-xs">
                <span className="block text-[10px] text-slate-500">TILE 1</span>
                <span className="font-bold text-cyan-300">☁️ Cloud</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-violet-500/40 text-xs">
                <span className="block text-[10px] text-slate-500">TILE 2</span>
                <span className="font-bold text-blue-300">🌧️ Rainfall</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-violet-500/40 text-xs">
                <span className="block text-[10px] text-slate-500">TILE 3</span>
                <span className="font-bold text-purple-300">🖥️ Servers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-violet-500/40 text-xs">
                <span className="block text-[10px] text-slate-500">TILE 4</span>
                <span className="font-bold text-amber-300">📦 Storage</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/40 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">COMMON LINK:</span>
              <span className="text-violet-300 font-bold uppercase tracking-wider">
                {step >= 2 ? '✓ CLOUD COMPUTING & STORAGE (+400 PTS)' : 'Finding Connection...'}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl my-4">
      {/* SIMULATION TOP BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold uppercase mb-1">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>INTERACTIVE EVENT SIMULATION & DEMO</span>
          </div>
          <h4 className="text-sm sm:text-base font-extrabold font-orbitron text-white">
            How {event.name} Works (Participant Flow)
          </h4>
        </div>

        {/* SIMULATION CONTROLS */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Play Demo</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DYNAMIC EVENT SPECIFIC DEMO CONTAINER */}
      <div className="h-64 sm:h-72 w-full my-2">
        {renderEventSpecificDemo()}
      </div>

      {/* STEP PROGRESS FOOTER */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px]">Step {step + 1} of 4:</span>
          <span className="text-slate-200 font-medium">
            {step === 0 && 'Entry & Initial Setup'}
            {step === 1 && 'Task Execution & Competition Round'}
            {step === 2 && 'Live Scoring & System Verification'}
            {step === 3 && 'Final Evaluation & Certificate Award'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
          <span>Real-time Interactive Preview</span>
          <ChevronRight className="w-3 h-3 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
