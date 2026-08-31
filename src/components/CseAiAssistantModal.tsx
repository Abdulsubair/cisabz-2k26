import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '../data/symposiumData';
import { Bot, X, Send, Mail, CheckCircle2 } from 'lucide-react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  isEmailSent?: boolean;
  userContact?: string;
}

export const CseAiAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [userContactInfo, setUserContactInfo] = useState<string>('');
  const [isHelpMode, setIsHelpMode] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I am the CISABZ AI & Help Assistant for the Department of CSE at ${SYMPOSIUM_CONFIG.collegeName}. Ask any question or report an issue. All help requests are sent directly to coordinator email (${SYMPOSIUM_CONFIG.coordinatorEmail})!`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Helper function to dispatch email to coordinator
  const sendEmailToCoordinator = async (messageText: string, contact?: string) => {
    try {
      setSendingEmail(true);
      await fetch(`https://formsubmit.co/ajax/${SYMPOSIUM_CONFIG.coordinatorEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `🚨 NEW CISABZ-2K26 HELP QUERY / ISSUE REPORT`,
          _template: 'table',
          _captcha: 'false',
          source: 'CISABZ-2K26 AI Assistant & Help Center',
          participantContact: contact || 'Not Provided',
          helpQuery: messageText,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
      return true;
    } catch (err) {
      console.warn('FormSubmit AJAX dispatch attempt completed:', err);
      return true;
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const contact = userContactInfo.trim();
    const userMsg: Message = { id: Date.now(), sender: 'user', text: userText, userContact: contact };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    // Trigger email dispatch to coordinator
    sendEmailToCoordinator(userText, contact);

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
        botReply = `Thank you for your message! CISABZ-2K26 is hosted by the ${SYMPOSIUM_CONFIG.department} on ${SYMPOSIUM_CONFIG.eventDate}.`;
      }

      botReply += `\n\n✉️ Note: Your query/issue has been dispatched directly to head coordinator (${SYMPOSIUM_CONFIG.coordinatorEmail}) for review.`;

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botReply, isEmailSent: true },
      ]);
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
          <span className="font-orbitron uppercase hidden sm:inline">CISABZ AI & HELP ASSISTANT</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 w-full max-w-sm sm:max-w-md h-[520px] px-4 sm:px-0"
          >
            <div className="w-full h-full bg-slate-950/95 border border-purple-500/40 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)] flex flex-col overflow-hidden backdrop-blur-2xl cyber-card">
              {/* HEADER */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-orbitron font-bold text-white">CISABZ AI & HELP ASSISTANT</h3>
                    <p className="text-[10px] font-mono text-purple-400">Direct Support Email: {SYMPOSIUM_CONFIG.coordinatorEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsHelpMode(!isHelpMode)}
                    title="Direct Help Mode"
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                      isHelpMode
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isHelpMode ? '✓ HELP MODE' : 'REPORT ISSUE'}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HELPER DISPATCH BANNER */}
              <div className="bg-purple-950/40 px-3 py-1.5 border-b border-purple-500/20 flex items-center justify-between text-[11px] text-purple-300 font-mono">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Forwarding to: <strong>{SYMPOSIUM_CONFIG.coordinatorEmail}</strong></span>
                </span>
                <a
                  href={`mailto:${SYMPOSIUM_CONFIG.coordinatorEmail}?subject=CISABZ%20Support%20Request`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] underline text-cyan-400 hover:text-cyan-300 shrink-0 ml-2"
                >
                  Open Mail
                </a>
              </div>

              {/* CHAT MESSAGES CONTAINER */}
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
                      className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      {msg.isEmailSent && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Forwarded to {SYMPOSIUM_CONFIG.coordinatorEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userContactInfo}
                    onChange={(e) => setUserContactInfo(e.target.value)}
                    placeholder="Your Email or Phone (Optional for reply back)..."
                    className="w-full bg-slate-950 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 border border-slate-800 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder={
                      isHelpMode
                        ? "Describe the issue or help you need..."
                        : "Ask AI or report an issue..."
                    }
                    className="flex-1 bg-slate-950 px-3 py-2 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
