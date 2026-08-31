import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '../data/symposiumData';
import { Bot, X, Send } from 'lucide-react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

export const CseAiAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am the CISABZ AI Assistant for the Department of Computer Science and Engineering at ${SYMPOSIUM_CONFIG.collegeName}. How can I assist you today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const userMsg: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    setTimeout(() => {
      let botReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('event') || lower.includes('technical') || lower.includes('non')) {
        botReply = `CISABZ-2K26 features 4 Technical Events (TechVerse, Tech Brainiac, Prompt Fusion, Bug Bash) and 4 Non-Technical Events (Pinpoint, Brand Spot, Hammer Hit, Connection). Each participant can register for up to 2 events included in base registration!`;
      } else if (lower.includes('date') || lower.includes('when') || lower.includes('deadline')) {
        botReply = `The symposium takes place on ${SYMPOSIUM_CONFIG.eventDate}. Online registration ends on ${SYMPOSIUM_CONFIG.registrationEndDate}.`;
      } else if (lower.includes('fee') || lower.includes('price') || lower.includes('cost') || lower.includes('money')) {
        botReply = `Base registration allows participation in 2 events (1 Technical + 1 Non-Technical). Any additional event costs ₹${SYMPOSIUM_CONFIG.additionalEventFee} per extra event!`;
      } else if (lower.includes('food') || lower.includes('lunch') || lower.includes('certificate')) {
        botReply = `Complimentary lunch and refreshments are provided for all registered participants. Certificates will be awarded to all attendees!`;
      } else if (lower.includes('patron') || lower.includes('dignitary') || lower.includes('principal') || lower.includes('secretary') || lower.includes('sivakumar') || lower.includes('rajendran') || lower.includes('selvi') || lower.includes('uma')) {
        botReply = `Our Distinguished Leadership & Dignitaries:\n1. Dr. R. Rajendran (Secretary, Raj Educational Trust)\n2. Dr. J. Arputha Vijaya Selvi (Principal, Kings College of Engineering)\n3. Dr. S. Sivakumar (Vice Principal, Kings College of Engineering)\n4. Dr. S. M. Uma (HOD & Assoc. Prof, CSE Dept)`;
      } else if (lower.includes('coordinator') || lower.includes('phone') || lower.includes('contact') || lower.includes('vignesh') || lower.includes('mubashir')) {
        botReply = `Faculty Coordinators:\n• Ms. B. BAVITHRA: ${FACULTY_COORDINATORS[0].phone}\n• Ms. S. ABIKAYIL AARTHI: ${FACULTY_COORDINATORS[1].phone}\n\nStudent Coordinators:\n• C VIGNESH: ${STUDENT_COORDINATORS[0].phone}\n• M MUBASHIR: ${STUDENT_COORDINATORS[1].phone}`;
      } else if (lower.includes('bonafide') || lower.includes('id') || lower.includes('card') || lower.includes('rule')) {
        botReply = `Mandatory requirements: College ID card and Bonafide Certificate are required for on-campus entry. Formal dress code is mandatory.`;
      } else {
        botReply = `Thank you for reaching out! CISABZ-2K26 is hosted by the ${SYMPOSIUM_CONFIG.department} on ${SYMPOSIUM_CONFIG.eventDate}. Feel free to ask about events, registration fees, coordinators, or rules!`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/90 border border-purple-500/50 text-purple-300 font-mono text-xs font-bold tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] backdrop-blur-xl group cursor-pointer"
        >
          <Bot className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
          <span className="font-orbitron uppercase hidden sm:inline">CISABZ AI ASSISTANT</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 w-full max-w-sm sm:max-w-md h-[460px] px-4 sm:px-0"
          >
            <div className="w-full h-full bg-slate-950/95 border border-purple-500/40 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col overflow-hidden backdrop-blur-2xl cyber-card">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-orbitron font-bold text-white">CISABZ AI ASSISTANT</h3>
                    <p className="text-[10px] font-mono text-purple-400">CSE Department Neural Bot</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask AI about events, fees, rules..."
                  className="flex-1 bg-slate-950 px-3 py-2 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
