import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cpu, Code2, Terminal, Sparkles } from 'lucide-react';

export const ComputerWorkstationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'algo' | 'debug'>('ai');
  const [typedText, setTypedText] = useState<string>('');

  const codeSnippets = {
    ai: `// CISABZ-2K26 AI Neural Model
import { GenerativeAI } from '@cisabz/neural';

const model = new GenerativeAI({
  department: "Computer Science & Engineering",
  symposium: "CISABZ-2K26",
  eventDate: "2026-09-25",
});

await model.train("Prompt Fusion & TechVerse Ideas");
console.log("Ready for Competition!");`,
    algo: `// Tech Brainiac & Logic League Algorithm
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "Welcome to CISABZ-2K26 CSE Symposium!" << endl;
    vector<string> events = {"TechVerse", "Bug Bash", "Prompt Fusion"};
    for (auto &event : events) {
        cout << "Compete in: " << event << endl;
    }
    return 0;
}`,
    debug: `// Bug Bash Debugging Challenge
function fixMemoryLeak(stateArray) {
  if (!stateArray || stateArray.length === 0) return [];
  // Optimizing garbage collection
  return stateArray.filter(item => item.isValid);
}
// Status: 0 Errors & 100% Execution Speed`,
  };

  useEffect(() => {
    const fullText = codeSnippets[activeTab];
    let i = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <section className="py-24 relative bg-slate-950/90 border-t border-slate-900 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-glow opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4"
          >
            <Monitor className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>CSE DIGITAL LAB & WORKSTATION MATRIX</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black font-orbitron text-white tracking-tight mb-4"
          >
            HIGH-PERFORMANCE <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">COMPUTING</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-400 font-light"
          >
            Interactive live code IDE & computing lab simulation built for Computer Science competitors.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 cyber-card"
          >
            <div className="rounded-3xl bg-slate-900 border border-cyan-500/40 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                    CISABZ_IDE.config &bull; CSE Workstation v2026
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[
                    { id: 'ai', label: 'AI Neural' },
                    { id: 'algo', label: 'C++ Algo' },
                    { id: 'debug', label: 'Debugger' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-950 font-code text-xs sm:text-sm text-cyan-300 min-h-[260px] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{typedText}</code>
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />
                </pre>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" /> LIVE CODE COMPILER: READY
                  </span>
                  <span>UTF-8 | LF | TypeScript & C++</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-start gap-4 hover:border-cyan-500/40 transition-all cyber-card"
            >
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-orbitron font-bold text-white mb-1">
                  High-Performance CSE Labs
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Equipped with dedicated workstation PCs, high-speed fiber connectivity, GPU clusters, and modern IDE development suites.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-start gap-4 hover:border-purple-500/40 transition-all cyber-card"
            >
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-orbitron font-bold text-white mb-1">
                  Real-time Coding Arenas
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automated judge evaluators for Bug Bash and Rapid-Fire Quiz rounds to score accuracy and execution speed down to the millisecond.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-start gap-4 hover:border-emerald-500/40 transition-all cyber-card"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-orbitron font-bold text-white mb-1">
                  Generative AI Integration
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explore LLM prompt engineering challenges in Prompt Fusion and present novel algorithm architectures in TechVerse.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
