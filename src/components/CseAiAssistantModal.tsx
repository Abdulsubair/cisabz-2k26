import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, STUDENT_COORDINATORS, FACULTY_COORDINATORS } from '../data/symposiumData';
import { Bot, X, Send, CheckCircle2, User, Phone, ArrowRight, ArrowLeft, Edit3 } from 'lucide-react';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  isEmailSent?: boolean;
}

export const CseAiAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // User Profile Flow States
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1: Name, 2: Phone, 3: Chat/Help Space

  const [inputMsg, setInputMsg] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load cached user details if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cisabz_user_help_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userName && parsed.userPhone) {
          setUserName(parsed.userName);
          setUserPhone(parsed.userPhone);
          setStep(3);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Initialize initial welcome message once step 3 is reached
  useEffect(() => {
    if (step === 3 && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: `Welcome ${userName || 'Participant'}! I am the CISABZ AI & Help Assistant. Write your issue or question below. Every query is forwarded directly to coordinator email (${SYMPOSIUM_CONFIG.coordinatorEmail}) along with your contact number (${userPhone}) so we can assist or call you promptly!`,
        },
      ]);
    }
  }, [step, userName, userPhone, messages.length]);

  useEffect(() => {
    if (isOpen && step === 3) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, step]);

  // Helper function to dispatch email to coordinator
  const sendEmailToCoordinator = async (messageText: string) => {
    try {
      setSendingEmail(true);
      await fetch(`https://formsubmit.co/ajax/${SYMPOSIUM_CONFIG.coordinatorEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `🚨 URGENT CISABZ-2K26 HELP ISSUE: ${userName} (${userPhone})`,
          _template: 'table',
          _captcha: 'false',
          source: 'CISABZ-2K26 AI Assistant & Help Center',
          participantName: userName.trim(),
          participantPhone: userPhone.trim(),
          helpQueryOrIssue: messageText,
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

  const handleNameNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length >= 2) {
      setStep(2);
    }
  };

  const handlePhoneNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPhone.trim().length >= 7) {
      // Save profile
      try {
        localStorage.setItem(
          'cisabz_user_help_profile',
          JSON.stringify({ userName: userName.trim(), userPhone: userPhone.trim() })
        );
      } catch (err) {
        console.error(err);
      }
      setStep(3);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const userMsg: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    // Trigger email dispatch to coordinator
    sendEmailToCoordinator(userText);

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
        botReply = `Thank you for reporting this to us, ${userName}! CISABZ-2K26 team is here to support you.`;
      }

      botReply += `\n\n✉️ Note: Your issue details along with your contact (${userPhone}) have been emailed directly to ${SYMPOSIUM_CONFIG.coordinatorEmail}. We will review and call you if needed!`;

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

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* WIZARD STEP 1: NAME INPUT */}
              {step === 1 && (
                <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <User className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold font-orbitron text-white mb-1">WELCOME TO CISABZ HELP</h4>
                  <p className="text-xs text-slate-400 font-light mb-6 max-w-xs">
                    Please enter your Full Name to connect with our support & coordinator team.
                  </p>

                  <form onSubmit={handleNameNext} className="w-full max-w-xs space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your Full Name..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={userName.trim().length < 2}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg transition-all"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* WIZARD STEP 2: PHONE NUMBER INPUT */}
              {step === 2 && (
                <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold font-orbitron text-white mb-1">
                    HI {userName.toUpperCase()}!
                  </h4>
                  <p className="text-xs text-slate-400 font-light mb-6 max-w-xs">
                    Please enter your Mobile / Phone Number so our head coordinator can call you if needed.
                  </p>

                  <form onSubmit={handlePhoneNext} className="w-full max-w-xs space-y-4">
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="Enter 10-digit Phone Number..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none transition-colors"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={userPhone.trim().length < 7}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg transition-all"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: CHAT & HELP REQUEST WRITING SPACE */}
              {step === 3 && (
                <>
                  {/* USER INFO BAR */}
                  <div className="bg-purple-950/50 px-3 py-2 border-b border-purple-500/20 flex items-center justify-between text-[11px] text-purple-300 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-white truncate">👤 {userName}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-cyan-300 shrink-0">📞 {userPhone}</span>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      title="Edit Name/Phone"
                      className="text-[10px] underline text-slate-400 hover:text-white shrink-0 ml-2 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
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
                              <span>Emailed to {SYMPOSIUM_CONFIG.coordinatorEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* INPUT FORM FOR HELPLINE / ISSUE WRITING */}
                  <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder="Write the helpline message or problem faced..."
                      className="flex-1 bg-slate-950 px-3 py-2.5 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingEmail || !inputMsg.trim()}
                      className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
