import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventItem } from '../types';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  User,
  Zap,
  Volume2,
  VolumeX,
  Film,
} from 'lucide-react';

interface CinematicEventVideoModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegister: (eventId: string) => void;
}

export const CinematicEventVideoModal: React.FC<CinematicEventVideoModalProps> = ({
  event,
  onClose,
  onRegister,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const duration = 12; // 12 seconds cinematic reel duration

  // Video progress timer loop
  useEffect(() => {
    if (!event) return;
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0; // Loop seamlessly
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, event]);

  // Background 3D Matrix / Cyber Scanlines Particle Shader Canvas
  useEffect(() => {
    if (!event || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid scanlines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating cyber light particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [event]);

  if (!event) return null;

  const currentSceneIndex = Math.min(3, Math.floor((currentTime / duration) * 4));

  // Event cinematic scenes narrative & visual data
  const getEventReels = () => {
    switch (event.id) {
      case 'techverse':
        return [
          {
            stage: 'SCENE 1: STAGE ENTRY & SETUP',
            title: 'Student Taking Auditorium Stage',
            subtitle: 'Participant connects laptop to auditorium 4K projection display.',
            action: 'Connecting HDMI & launching presentation slide deck...',
            avatarText: 'Student Presenter (KCE)',
            codeHighlight: 'SYSTEM: PROJECTOR CONNECTED [4K HDR 60FPS]',
          },
          {
            stage: 'SCENE 2: PPT & INNOVATION VISION',
            title: 'Presenting Core Technical Concept',
            subtitle: 'Explaining AI Quantum Node Architecture & problem novelty to judges.',
            action: 'Gesturing toward live data pipeline architecture diagram on big screen...',
            avatarText: 'Presenter Explaining Novelty',
            codeHighlight: 'SLIDE 02: AI QUANTUM EDGE DATA PIPELINE',
          },
          {
            stage: 'SCENE 3: LIVE WORKING PROTOTYPE DEMO',
            title: 'Executing Live Software Demo',
            subtitle: 'Running live code demonstration with real-time telemetry output.',
            action: 'Executing benchmark script. Real-time metrics streaming on screen...',
            avatarText: 'Executing Software Demo',
            codeHighlight: 'BENCHMARK: 99.8% ACCURACY & 4ms LATENCY',
          },
          {
            stage: 'SCENE 4: JUDGES Q&A & EVALUATION',
            title: 'Answering Technical Questions',
            subtitle: 'Judges score presentation on novelty, feasibility, and response clarity.',
            action: 'Evaluation complete! Judges award high marks for innovation.',
            avatarText: 'Q&A Discussion',
            codeHighlight: 'FINAL MARKS: NOVELTY 9.8/10 | DEMO 9.6/10',
          },
        ];

      case 'tech-brainiac':
        return [
          {
            stage: 'SCENE 1: QUIZ POD ARENA ENTRY',
            title: 'Student Teams at Quiz Pods',
            subtitle: 'Participants take positions at digital buzzer stations under neon spotlights.',
            action: 'Buzzer lamps glowing blue. System ready for rapid-fire rounds...',
            avatarText: 'Quiz Participant (Pod 01)',
            codeHighlight: 'SYSTEM: BUZZER TEST COMPLETED [0ms LATENCY]',
          },
          {
            stage: 'SCENE 2: RAPID-FIRE QUESTION FLASH',
            title: 'Question Displayed on Arena Screen',
            subtitle: 'Computer Science fundamentals & emerging tech question revealed.',
            action: '"Which data structure guarantees O(1) average lookup time?"',
            avatarText: 'Analyzing Question',
            codeHighlight: 'QUESTION #03: O(1) LOOKUP TIME COMPLEXITY',
          },
          {
            stage: 'SCENE 3: SPEED BUZZER SLAM',
            title: 'Student Hits Buzzer First',
            subtitle: 'Lightning-fast reaction! Student hits buzzer in 0.4 seconds.',
            action: 'BUZZED IN! Student answers: "HASH TABLE (UNORDERED MAP)"',
            avatarText: 'Buzzer Slammed!',
            codeHighlight: 'FLASH: PLAYER 1 BUZZED IN (0.42s REACTION)',
          },
          {
            stage: 'SCENE 4: CORRECT ANSWER & LEADERBOARD',
            title: 'Score Awarded & Leaderboard Advance',
            subtitle: 'Green flash on arena wall! Team advances to final championship round.',
            action: 'Points tally: +500 PTS. Audience applause & leaderboard advance!',
            avatarText: 'Team Celebrating',
            codeHighlight: 'LEADERBOARD: RANK #1 [1,450 TOTAL PTS]',
          },
        ];

      case 'prompt-fusion':
        return [
          {
            stage: 'SCENE 1: AI WORKSTATION SETUP',
            title: 'Student Seated at AI Terminal',
            subtitle: 'Dual-monitor AI workspace loaded with LLM & Midjourney neural APIs.',
            action: 'Participant opening generative prompt studio console...',
            avatarText: 'AI Prompt Engineer',
            codeHighlight: 'TERMINAL: NEURAL API AGENTS CONNECTED',
          },
          {
            stage: 'SCENE 2: CRAFTING THE SYSTEM PROMPT',
            title: 'Synthesizing High-Precision Prompt',
            subtitle: 'Drafting structured zero-shot prompt instructions for complex web UI.',
            action: 'Typing: "/imagine dark cyber UI dashboard with glassmorphic node shaders..."',
            avatarText: 'Drafting Prompt String',
            codeHighlight: 'PROMPT: "RESPONSIVE CYBER NEON PLATFORM UI"',
          },
          {
            stage: 'SCENE 3: REAL-TIME NEURAL GENERATION',
            title: 'Neural Matrix Token Generation',
            subtitle: 'Generative AI stream rendering UI components and code live.',
            action: 'AI model generating HTML/CSS code & graphics in real time...',
            avatarText: 'Streaming Tokens',
            codeHighlight: 'GENERATION: 1,200 TOKENS/SEC RENDERED',
          },
          {
            stage: 'SCENE 4: EVALUATION & PRECISION SCORE',
            title: 'Submitting Final Generated Output',
            subtitle: 'Evaluated on prompt creativity, token efficiency, and visual match.',
            action: 'Evaluation: 99% Precision Match! Highest score awarded.',
            avatarText: 'Prompt Verified',
            codeHighlight: 'SCORE: 99/100 ACCURACY [WINNER CANDIDATE]',
          },
        ];

      case 'bug-bash':
        return [
          {
            stage: 'SCENE 1: CODE SCANNING & AST ANALYSIS',
            title: 'Student Inspecting Buggy Code',
            subtitle: 'Participant opening buggy C++/Python codebase in cloud IDE.',
            action: 'Scanning syntax, memory leaks, and logic errors...',
            avatarText: 'Code Auditor',
            codeHighlight: 'IDE: 250 LINES LOADED [CRITICAL BUGS DETECTED]',
          },
          {
            stage: 'SCENE 2: IDENTIFYING CRITICAL ERROR',
            title: 'Locating Red Error Highlight',
            subtitle: 'Red underline on Line 42: NullPointer exception & infinite loop.',
            action: 'Student tracking variable lifecycle and memory references...',
            avatarText: 'Tracing Pointer Bug',
            codeHighlight: 'ERROR L42: NullPointerDereference in authHandler()',
          },
          {
            stage: 'SCENE 3: WRITING FIX & RECOMPILING',
            title: 'Typing Corrected Logic & Compiling',
            subtitle: 'Student replacing buggy lines with optimized pointer safety checks.',
            action: 'Pressing CTRL + SHIFT + B. Compiling updated binary...',
            avatarText: 'Compiling Fix',
            codeHighlight: 'BUILD: COMPILING GCC 13.2... [0 WARNINGS]',
          },
          {
            stage: 'SCENE 4: TEST SUITE ALL GREEN',
            title: 'All Unit Test Cases Passed',
            subtitle: 'Console flashes green! 15 out of 15 automated unit test cases passed.',
            action: 'Bug Bash challenge cleared in record time of 06:15!',
            avatarText: 'Challenge Cleared',
            codeHighlight: 'TEST RESULT: 15/15 PASSED [100% SCORE]',
          },
        ];

      case 'pinpoint':
        return [
          {
            stage: 'SCENE 1: 5-CLUE DEDUCTION BOARD',
            title: 'Mystery Category Displayed',
            subtitle: 'Student looking at 5 locked clue panels on central stage display.',
            action: 'Timer starts counting down. Clue 1 revealing...',
            avatarText: 'Deduction Participant',
            codeHighlight: 'BOARD: 5 CLUES AVAILABLE [MAX BONUS: 500 PTS]',
          },
          {
            stage: 'SCENE 2: REVEALING PROGRESSIVE CLUES',
            title: 'Clue 1 ("Internet") & Clue 2 ("Ledger")',
            subtitle: 'Clues revealed one at a time. Student connecting semantic links.',
            action: 'Analyzing words: Internet... Ledger... Distributed...',
            avatarText: 'Connecting Semantic Link',
            codeHighlight: 'REVEALED: CLUE 1 (INTERNET) & CLUE 2 (LEDGER)',
          },
          {
            stage: 'SCENE 3: EARLY GUESS LOCK-IN',
            title: 'Student Hits Guess Button',
            subtitle: 'Bold move! Student locks in guess after only 2 clues for maximum bonus.',
            action: 'Typing answer: "BLOCKCHAIN TECHNOLOGY"',
            avatarText: 'Locking In Answer',
            codeHighlight: 'GUESS LOCKED: "BLOCKCHAIN TECHNOLOGY"',
          },
          {
            stage: 'SCENE 4: PERFECT MATCH & MAXIMUM POINTS',
            title: 'Correct Category Revealed!',
            subtitle: 'Green jackpot flash! Maximum bonus points awarded for fewest clues used.',
            action: 'Category confirmed: BLOCKCHAIN (+500 BONUS PTS)!',
            avatarText: 'Bonus Points Awarded',
            codeHighlight: 'RESULT: PERFECT DEDUCTION! +500 PTS AWARDED',
          },
        ];

      case 'brand-spot':
        return [
          {
            stage: 'SCENE 1: OBSCURED BRAND IMAGE',
            title: 'Blurred Tech Logo Displayed',
            subtitle: 'Cropped, pixelated, and blurred tech logo appears on stage LED wall.',
            action: 'Unblur ring focusing progressively over 5 seconds...',
            avatarText: 'Visual Spotter',
            codeHighlight: 'LOGO: 80% BLURRED & CROPPED [TIME: 05s]',
          },
          {
            stage: 'SCENE 2: RECOGNIZING VISUAL PATTERN',
            title: 'Student Spotting Distinctive Curves',
            subtitle: 'Focus ring unblurring. Student identifies brand color scheme & geometry.',
            action: 'Noticing distinctive green/black AI GPU logo geometry...',
            avatarText: 'Spotting Visual Cues',
            codeHighlight: 'UNBLUR: 40% BLUR REMAINING [REACTION READY]',
          },
          {
            stage: 'SCENE 3: SLAMMING ANSWER BUZZER',
            title: 'Locking In Brand Identification',
            subtitle: 'Student hits answer pod: "NVIDIA CORPORATION".',
            action: 'Answer locked in before full unblur!',
            avatarText: 'Locking In Brand',
            codeHighlight: 'SUBMITTED: "NVIDIA CORPORATION"',
          },
          {
            stage: 'SCENE 4: BRAND UNBLURS & VICTORY',
            title: 'Logo Unblurs Completely: NVIDIA',
            subtitle: 'Checkmark flash! Full logo revealed cleanly. Fast response bonus awarded.',
            action: 'Correct identification! Team scores +300 PTS.',
            avatarText: 'Logo Confirmed',
            codeHighlight: 'RESULT: CORRECT BRAND! +300 PTS SCORE',
          },
        ];

      case 'hammer-hit':
        return [
          {
            stage: 'SCENE 1: AUCTION ARENA & PURSE',
            title: 'Mock IPL Auction Room Loaded',
            subtitle: 'Student teams seated with bidding paddles and ₹50.0 Lakhs virtual purse.',
            action: 'Auctioneer announces star player up for bidding...',
            avatarText: 'Auction Franchise Owner',
            codeHighlight: 'PURSE: ₹50.0 LAKHS VIRTUAL BUDGET REMAINING',
          },
          {
            stage: 'SCENE 2: PLAYER STATS & BIDDING WAR',
            title: 'Star Player Card Displayed',
            subtitle: 'Player stats: All-Rounder (Strike Rate 155, Wickets 24). Base: ₹5.0 L.',
            action: 'Competing teams raising paddles! Bid climbs to ₹12.0 Lakhs...',
            avatarText: 'Bidding War Active',
            codeHighlight: 'CURRENT BID: ₹12.0 LAKHS [TEAM KCE BIDDING]',
          },
          {
            stage: 'SCENE 3: FINAL HIGHEST BID',
            title: 'Raising Paddle for Final Bid',
            subtitle: 'Student team calculates remaining squad budget and raises bid to ₹15.5 L.',
            action: 'Auctioneer: "Going once... Going twice..."',
            avatarText: 'Final Winning Bid',
            codeHighlight: 'FINAL BID: ₹15.5 LAKHS [GOING TWICE...]',
          },
          {
            stage: 'SCENE 4: GAVEL SLAM & SQUAD COMPLETE',
            title: 'Hammer Slams: SOLD TO TEAM KCE!',
            subtitle: 'Gavel strikes! Player secured. Team wins highest total squad strategy rating.',
            action: 'Gavel sound effect! Squad complete within budget.',
            avatarText: 'Secured Player',
            codeHighlight: 'RESULT: SOLD TO TEAM KCE! SQUAD RATING 98/100',
          },
        ];

      case 'connection':
        return [
          {
            stage: 'SCENE 1: 4 PUZZLE IMAGE TILES',
            title: '4 Visual Tiles Displayed on Screen',
            subtitle: 'Tile 1 (Cloud), Tile 2 (Rain), Tile 3 (Server Stack), Tile 4 (AWS Logo).',
            action: 'Timer running. Student team searching for underlying connection...',
            avatarText: 'Puzzle Solver',
            codeHighlight: 'TILES: 4 IMAGES LOADED [FIND COMMON LINK]',
          },
          {
            stage: 'SCENE 2: ANALYZING COMMON LINK',
            title: 'Connecting Visual Themes',
            subtitle: 'Students discussing relationships between weather cloud and computer servers.',
            action: 'Brainstorming: "Cloud... Data... Storage... Cloud Computing!"',
            avatarText: 'Deducing Relationship',
            codeHighlight: 'LINK: "CLOUD COMPUTING & VIRTUAL SERVERS"',
          },
          {
            stage: 'SCENE 3: ENTERING THE CONNECTED WORD',
            title: 'Typing Answer: CLOUD COMPUTING',
            subtitle: 'Student enters answer into connection input box.',
            action: 'Submitting answer string for verification...',
            avatarText: 'Submitting Connection',
            codeHighlight: 'SUBMITTED: "CLOUD COMPUTING"',
          },
          {
            stage: 'SCENE 4: NEON LASER LINK VERIFIED',
            title: 'Connection Confirmed & Score Bonus',
            subtitle: 'Neon laser lines connect all 4 images! Green confirmation flash.',
            action: 'Connection verified! Team advances to final round.',
            avatarText: 'Connection Verified',
            codeHighlight: 'RESULT: LINK CONFIRMED! +400 PTS AWARDED',
          },
        ];

      default:
        return [];
    }
  };

  const reels = getEventReels();
  const currentScene = reels[currentSceneIndex] || reels[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* CINEMATIC THEATER BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl"
        />

        {/* CINEMATIC WIDESCREEN MOVIE PLAYER CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-5xl aspect-video bg-slate-950 border-2 border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.3)] z-10 flex flex-col justify-between"
        >
          {/* BACKGROUND SCANLINES CANVAS */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

          {/* TOP MOVIE HEADER & CLOSE BAR */}
          <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                    EVENT {event.code} &bull; CINEMATIC SIMULATION
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    4K REEL LIVE
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-tight">
                  {event.name} — <span className="text-cyan-400 font-sans font-semibold text-sm sm:text-base">{event.subtitle}</span>
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CENTER MOVIE SCENE ANIMATION DISPLAY */}
          <div className="relative z-10 flex-1 px-4 sm:px-10 py-2 flex flex-col justify-between items-center text-center">
            {/* TOP SCENE STAGE PILL */}
            <motion.div
              key={currentSceneIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase shadow-lg backdrop-blur-md"
            >
              {currentScene.stage}
            </motion.div>

            {/* REALISTIC ANIMATED VISUAL DEMO SCENE */}
            <motion.div
              key={currentSceneIndex + '-visual'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="my-auto max-w-3xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              {/* ANAMORPHIC LENS FLARE DECORATION */}
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

              {/* STUDENT IN ACTION AVATAR + TITLE */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-950 border-2 border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 animate-bounce" />
                  <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-extrabold tracking-wider shadow-md">
                    ACTION LIVE
                  </div>
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold font-orbitron text-white mb-2 tracking-tight">
                  {currentScene.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl mb-4">
                  {currentScene.subtitle}
                </p>

                {/* CODE / ACTION HIGHLIGHT BOX */}
                <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 font-code text-xs sm:text-sm text-cyan-300 shadow-inner flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{currentScene.codeHighlight}</span>
                </div>
              </div>
            </motion.div>

            {/* NARRATIVE SUBTITLE BAR AT BOTTOM */}
            <div className="w-full max-w-2xl px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm font-mono text-slate-300 backdrop-blur-md">
              <span className="text-cyan-400 font-bold">CAPTION: </span>
              <span>{currentScene.action}</span>
            </div>
          </div>

          {/* BOTTOM CONTROLS & TIMELINE SCRUBBER OVERLAY */}
          <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col gap-3">
            {/* TIMELINE SCRUBBER BAR WITH 4 SCENE MARKERS */}
            <div className="w-full space-y-1">
              <div className="relative w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span className="text-cyan-400 font-bold">
                  SCENE {currentSceneIndex + 1} OF 4
                </span>
                <span>00:12</span>
              </div>
            </div>

            {/* CONTROLS BAR & CALL TO ACTION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause Movie' : 'Play Movie'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Replay Reel"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* REGISTER CALL TO ACTION BUTTON */}
              <button
                onClick={() => {
                  onClose();
                  onRegister(event.id);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold font-mono text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <span>REGISTER FOR THIS EVENT NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
