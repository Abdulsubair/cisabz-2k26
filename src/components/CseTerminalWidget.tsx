import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_EVENTS } from '../data/symposiumData';
import { Terminal, X, Maximize2, Minimize2, CornerDownLeft, Cpu } from 'lucide-react';

interface CseTerminalWidgetProps {
  onOpenRegister: (eventId?: string) => void;
  onOpenGuideline: (eventId: string) => void;
}

interface TerminalLog {
  id: number;
  type: 'input' | 'output' | 'system' | 'success' | 'error';
  text: string;
  isHtml?: boolean;
}

export const CseTerminalWidget: React.FC<CseTerminalWidgetProps> = ({
  onOpenRegister,
  onOpenGuideline,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 1,
      type: 'system',
      text: 'SYSTEM INITIALIZED: CISABZ-2K26 CSE TERMINAL CONSOLE v2.6.0',
    },
    {
      id: 2,
      type: 'system',
      text: 'Department of Computer Science and Engineering | Kings College of Engineering',
    },
    {
      id: 3,
      type: 'output',
      text: 'Type "help" to see available commands or "events" to list all symposium events.',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newLogs: TerminalLog[] = [
      ...logs,
      { id: Date.now(), type: 'input', text: `user@cisabz2k26:~$ ${inputVal}` },
    ];

    if (cmd === 'help') {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `AVAILABLE COMMANDS:
  help         - Show this help menu
  events       - List all 4 Technical & 4 Non-Technical events
  techverse    - View TechVerse (Paper Presentation) details
  brainiac     - View Tech Brainiac (Tech Quiz) details
  promptfusion - View Prompt Fusion (AI Prompt Challenge) details
  bugbash      - View Bug Bash (Debugging) details
  pinpoint     - View Pinpoint details
  brandspot    - View Brand Spot details
  hammerhit    - View Hammer Hit (IPL Auction) details
  connection   - View Connection details
  register     - Open official registration portal
  coordinators - List student & faculty coordinator contacts
  clear        - Clear terminal history`,
      });
    } else if (cmd === 'events') {
      newLogs.push({
        id: Date.now() + 1,
        type: 'success',
        text: `TECHNICAL EVENTS:
  01. TECHVERSE      - Paper Presentation
  02. TECH BRAINIAC  - Technical Quiz
  03. PROMPT FUSION  - AI Prompt Challenge
  04. BUG BASH       - Debugging

NON-TECHNICAL EVENTS:
  01. PINPOINT       - Guess the hidden category / word
  02. BRAND SPOT     - Logo Finding
  03. HAMMER HIT     - IPL Auction
  04. CONNECTION     - Link & Think`,
      });
    } else if (cmd === 'register') {
      newLogs.push({
        id: Date.now() + 1,
        type: 'success',
        text: 'Launching official registration portal...',
      });
      onOpenRegister();
    } else if (cmd === 'coordinators') {
      newLogs.push({
        id: Date.now() + 1,
        type: 'output',
        text: `STUDENT COORDINATORS:
  - C VIGNESH   : 7871630097
  - M MUBASHIR  : 95143 59887

STAFF COORDINATORS:
  - Ms. B. BAVITHRA          (Asst. Prof., CSE Dept) : 78452 86608
  - Ms. S. ABIKAYIL AARTHI   (Asst. Prof., CSE Dept) : 80128 15838`,
      });
    } else if (['techverse', 'tech-brainiac', 'prompt-fusion', 'bug-bash', 'pinpoint', 'brand-spot', 'hammer-hit', 'connection'].includes(cmd)) {
      const match = ALL_EVENTS.find(e => e.id === cmd || e.name.toLowerCase().replace(/\s+/g, '') === cmd.replace(/-/g, ''));
      if (match) {
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `Launching event modal for: ${match.name} (${match.subtitle})...`,
        });
        onOpenGuideline(match.id);
      }
    } else if (cmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else {
      newLogs.push({
        id: Date.now() + 1,
        type: 'error',
        text: `Command not recognized: "${cmd}". Type "help" for a list of valid commands.`,
      });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-400 font-mono text-xs font-bold tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] backdrop-blur-xl group cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="font-orbitron tracking-widest uppercase">CSE CLI TERMINAL</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed z-50 transition-all ${isMinimized
              ? 'bottom-6 right-6 w-80 h-14'
              : 'bottom-6 right-6 w-full max-w-xl h-[480px] px-4 sm:px-0'
              }`}
          >
            <div className="w-full h-full bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden backdrop-blur-2xl cyber-card">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CISABZ-2K26 // CSE CLI</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <div className="flex-1 p-4 overflow-y-auto font-code text-xs space-y-2 leading-relaxed selection:bg-cyan-500 selection:text-black">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`${log.type === 'input'
                        ? 'text-cyan-300 font-semibold'
                        : log.type === 'system'
                          ? 'text-purple-400'
                          : log.type === 'success'
                            ? 'text-emerald-400'
                            : log.type === 'error'
                              ? 'text-rose-400'
                              : 'text-slate-300'
                        }`}
                    >
                      <pre className="whitespace-pre-wrap font-code">{log.text}</pre>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {!isMinimized && (
                <form
                  onSubmit={handleCommandSubmit}
                  className="p-3 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2"
                >
                  <span className="text-cyan-400 font-code text-xs font-bold">$</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="type 'help', 'events', 'register'..."
                    className="flex-1 bg-transparent text-xs font-code text-white focus:outline-none placeholder-slate-600"
                  />
                  <button type="submit" className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 cursor-pointer">
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
