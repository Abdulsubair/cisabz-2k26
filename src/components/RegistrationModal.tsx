import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMPOSIUM_CONFIG, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/symposiumData';
import {
  X,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  Lock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Flame,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedEventId?: string;
}

const DEPARTMENTS = [
  'B.E CSE',
  'B.TECH IT',
  'B.E AI & DS',
  'B.E ECE',
  'B.E EEE',
  'B.E MECH',
  'B.E CIVIL',
  'OTHER',
];

const YEARS = [
  '1st Year (Freshman)',
  '2nd Year',
  '3rd Year',
  '4th Year (Final)',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialSelectedEventId,
}) => {
  // Step State: 1 = Details, 2 = Tech Events, 3 = Non-Tech Events, 4 = Summary, 5 = Payment Overlay
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('B.E CSE');
  const [customDepartment, setCustomDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1st Year (Freshman)');

  // Selected Events
  // Tech Brainiac ('tech-brainiac') is mandatory/compulsory per audio instructions
  const [selectedTechEvents, setSelectedTechEvents] = useState<string[]>(() => {
    const defaultTech = ['tech-brainiac'];
    if (
      initialSelectedEventId &&
      TECHNICAL_EVENTS.some((e) => e.id === initialSelectedEventId) &&
      initialSelectedEventId !== 'tech-brainiac'
    ) {
      defaultTech.push(initialSelectedEventId);
    }
    return defaultTech;
  });

  const [selectedNonTechEvents, setSelectedNonTechEvents] = useState<string[]>(() => {
    if (
      initialSelectedEventId &&
      NON_TECHNICAL_EVENTS.some((e) => e.id === initialSelectedEventId)
    ) {
      return [initialSelectedEventId];
    }
    return ['hammer-hit']; // default preset non-tech event as in design screenshot
  });

  // UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Reset modal state every time it opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitted(false);
      setValidationError('');

      const defaultTech = ['tech-brainiac'];
      if (
        initialSelectedEventId &&
        TECHNICAL_EVENTS.some((e) => e.id === initialSelectedEventId) &&
        initialSelectedEventId !== 'tech-brainiac'
      ) {
        defaultTech.push(initialSelectedEventId);
      }
      setSelectedTechEvents(defaultTech);

      if (
        initialSelectedEventId &&
        NON_TECHNICAL_EVENTS.some((e) => e.id === initialSelectedEventId)
      ) {
        setSelectedNonTechEvents([initialSelectedEventId]);
      } else {
        setSelectedNonTechEvents(['hammer-hit']);
      }
    }
  }, [isOpen, initialSelectedEventId]);

  // Toggle Technical Event (Tech Brainiac is compulsory)
  const toggleTechEvent = (id: string) => {
    if (id === 'tech-brainiac') {
      // Mandatory event cannot be unchecked
      setValidationError('Tech Brainiac (Technical Quiz) is mandatory for all delegates.');
      setTimeout(() => setValidationError(''), 3000);
      return;
    }

    if (selectedTechEvents.includes(id)) {
      setSelectedTechEvents(selectedTechEvents.filter((e) => e !== id));
    } else {
      if (selectedTechEvents.length >= 2) {
        setValidationError('You can select a maximum of 2 technical events.');
        setTimeout(() => setValidationError(''), 3000);
        return;
      }
      setSelectedTechEvents([...selectedTechEvents, id]);
    }
  };

  // Toggle Non-Technical Event (1 allowed)
  const toggleNonTechEvent = (id: string) => {
    if (selectedNonTechEvents.includes(id)) {
      setSelectedNonTechEvents([]);
    } else {
      setSelectedNonTechEvents([id]);
    }
  };

  const [registrationId] = useState<string>(() => `CISABZ-2K26-REG-${Math.floor(1000 + Math.random() * 9000)}`);

  // Price calculation formula per user audio:
  // Base combo (2 Tech + 1 Non-Tech) = ₹200
  // Extra events = +₹50 per event
  const extraTechCount = Math.max(0, selectedTechEvents.length - 2);
  const extraNonTechCount = Math.max(0, selectedNonTechEvents.length - 1);
  const extraEventsCount = extraTechCount + extraNonTechCount;
  const totalFee = SYMPOSIUM_CONFIG.registrationFee + extraEventsCount * SYMPOSIUM_CONFIG.additionalEventFee;

  // Save registration to database (unpaid or paid)
  const saveRegistrationToDatabase = (status: 'REGISTERED (NOT PAID)' | 'PAID (CONFIRMED)') => {
    if (!fullName.trim() || !email.trim()) return;

    const displayDept = department === 'OTHER' ? customDepartment || 'OTHER' : department;
    const record = {
      id: registrationId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      college: college.trim(),
      department: displayDept,
      yearOfStudy,
      techEvents: selectedTechEvents,
      nonTechEvents: selectedNonTechEvents,
      totalAmount: totalFee,
      paymentStatus: status,
      timestamp: new Date().toLocaleString(),
      emailSentStatus: status === 'PAID (CONFIRMED)',
    };

    try {
      const existing = localStorage.getItem('cisabz_registrations');
      const records: any[] = existing ? JSON.parse(existing) : [];
      const filtered = records.filter((r: any) => r.id !== registrationId);
      localStorage.setItem('cisabz_registrations', JSON.stringify([record, ...filtered]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      setValidationError('Please fill in all required fields.');
      return;
    }
    setValidationError('');
    // Log registration immediately into database as REGISTERED (NOT PAID)
    saveRegistrationToDatabase('REGISTERED (NOT PAID)');
    setStep(2);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SYMPOSIUM_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SYMPOSIUM_CONFIG.upiPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCompletePayment = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    saveRegistrationToDatabase('PAID (CONFIRMED)');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  // Helper getters
  const displayDepartment = department === 'OTHER' ? customDepartment || 'OTHER' : department;
  const totalSelectedEvents = selectedTechEvents.length + selectedNonTechEvents.length;

  const selectedTechEventObjects = TECHNICAL_EVENTS.filter((e) =>
    selectedTechEvents.includes(e.id)
  );
  const selectedNonTechEventObjects = NON_TECHNICAL_EVENTS.filter((e) =>
    selectedNonTechEvents.includes(e.id)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl font-sans text-slate-100">
          {/* MODAL BACKDROP CLICK */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60"
          />

          {/* MAIN DIALOG CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#091122] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] z-10 my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              step < 5 ? (
                /* REGISTRATION WIZARD (STEPS 1 - 4) */
                <div>
                  {/* STEP INDICATOR HEADER */}
                  <div className="mb-8 pt-2">
                    <div className="flex items-center justify-between max-w-md mx-auto relative">
                      {/* CONNECTING LINE */}
                      <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-slate-800 z-0">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                          style={{ width: `${((step - 1) / 3) * 100}%` }}
                        />
                      </div>

                      {[1, 2, 3, 4].map((s) => {
                        const isCompleted = step > s;
                        const isActive = step === s;

                        return (
                          <div key={s} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted
                                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                                : isActive
                                  ? 'bg-[#091122] border-2 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                                  : 'bg-[#0e1935] border border-slate-700 text-slate-500'
                                }`}
                            >
                              {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : s}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* VALIDATION ERROR BANNER */}
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center"
                    >
                      {validationError}
                    </motion.div>
                  )}

                  {/* STEP 1: PARTICIPANT DETAILS */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <form onSubmit={handleNextFromStep1} className="space-y-4">
                        {/* FULL NAME */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="e.g., ALEX JOHNSON"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value.toUpperCase())}
                              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              required
                              placeholder="name@gmail.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* PHONE NUMBER */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            WhatsApp / Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* COLLEGE NAME */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            College / Institution Name *
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="e.g., KINGS COLLEGE OF ENGINEERING"
                              value={college}
                              onChange={(e) => setCollege(e.target.value.toUpperCase())}
                              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* DEPARTMENT SELECT */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Department / Stream *
                          </label>
                          <div className="relative">
                            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <select
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white focus:outline-none focus:border-amber-400/80 transition-all appearance-none font-mono cursor-pointer"
                            >
                              {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} className="bg-slate-900 text-white">
                                  {dept === 'OTHER' ? 'OTHER (TYPE CUSTOM)' : `e.g., ${dept}`}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                              &#9660;
                            </div>
                          </div>

                          {department === 'OTHER' && (
                            <div className="mt-2.5">
                              <input
                                type="text"
                                required
                                placeholder="ENTER YOUR DEPARTMENT NAME"
                                value={customDepartment}
                                onChange={(e) => setCustomDepartment(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2.5 rounded-xl bg-[#0a1226] border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none font-mono uppercase"
                              />
                            </div>
                          )}
                        </div>

                        {/* YEAR OF STUDY SELECT */}
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Year of Study
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <select
                              value={yearOfStudy}
                              onChange={(e) => setYearOfStudy(e.target.value)}
                              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0e1832] border border-[#1e2f56] text-sm text-white focus:outline-none focus:border-amber-400/80 transition-all appearance-none font-mono cursor-pointer"
                            >
                              {YEARS.map((y) => (
                                <option key={y} value={y} className="bg-slate-900 text-white">
                                  {y}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                              &#9660;
                            </div>
                          </div>
                        </div>

                        {/* STEP 1 NEXT BUTTON */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>NEXT: TECHNICAL EVENTS</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* STEP 2: TECHNICAL EVENTS SELECTION */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                            <h3 className="text-xl font-black font-orbitron text-white">
                              Step 2: Technical Events Selection
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Choose up to <strong>2 technical showdowns</strong>.
                          </p>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-full bg-[#0d1835] border border-[#1e305c] text-xs font-mono text-cyan-300 font-bold shrink-0">
                          {selectedTechEvents.length} / 2 Selected
                        </div>
                      </div>

                      {/* TECHNICAL EVENTS LIST */}
                      <div className="space-y-3 mb-6">
                        {TECHNICAL_EVENTS.map((event) => {
                          const isSelected = selectedTechEvents.includes(event.id);
                          const isCompulsory = event.id === 'tech-brainiac';

                          return (
                            <div
                              key={event.id}
                              onClick={() => toggleTechEvent(event.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected
                                ? 'bg-[#0d1c3a] border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                : 'bg-[#0a1226] border-[#18284c] hover:border-slate-700'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="pr-6">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base font-extrabold text-white">
                                      {event.name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                                      Tech
                                    </span>
                                    {isCompulsory && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 uppercase font-bold">
                                        Mandatory
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-semibold text-cyan-300 mb-1.5">
                                    {event.subtitle}
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                                    {event.shortDescription}
                                  </p>
                                </div>

                                {/* CHECKBOX */}
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isSelected
                                    ? 'bg-cyan-500 border-cyan-400 text-black shadow-md'
                                    : 'border-slate-600 bg-slate-900/50'
                                    }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* NAVIGATION BUTTONS */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="py-3 px-5 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Prev</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setValidationError('');
                            setStep(3);
                          }}
                          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>NEXT: NON-TECHNICAL EVENTS</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: NON-TECHNICAL EVENTS SELECTION */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                            <h3 className="text-xl font-black font-orbitron text-white">
                              Step 3: Non-Technical Selection
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Choose <strong>1 non-technical event</strong>.
                          </p>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-full bg-[#0d1835] border border-[#1e305c] text-xs font-mono text-amber-300 font-bold shrink-0">
                          {selectedNonTechEvents.length} / 1 Selected
                        </div>
                      </div>

                      {/* NON-TECHNICAL EVENTS LIST */}
                      <div className="space-y-3 mb-6">
                        {NON_TECHNICAL_EVENTS.map((event) => {
                          const isSelected = selectedNonTechEvents.includes(event.id);

                          return (
                            <div
                              key={event.id}
                              onClick={() => toggleNonTechEvent(event.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected
                                ? 'bg-[#1e172e] border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                                : 'bg-[#0a1226] border-[#18284c] hover:border-slate-700'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="pr-6">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base font-extrabold text-white">
                                      {event.name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase font-semibold">
                                      Non-Tech
                                    </span>
                                  </div>
                                  <div className="text-xs font-semibold text-purple-300 mb-1.5">
                                    {event.subtitle}
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                                    {event.shortDescription}
                                  </p>
                                </div>

                                {/* CHECKBOX */}
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${isSelected
                                    ? 'bg-purple-500 border-purple-400 text-black shadow-md'
                                    : 'border-slate-600 bg-slate-900/50'
                                    }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* NAVIGATION BUTTONS */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="py-3 px-5 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Prev</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setValidationError('');
                            setStep(4);
                          }}
                          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>REVIEW & FEE →</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: SUMMARY & FEE */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="mb-5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                          <h3 className="text-xl font-black font-orbitron text-white">
                            Step 4: Summary & Fee (₹{SYMPOSIUM_CONFIG.registrationFee})
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Review your credentials and transfer ₹{SYMPOSIUM_CONFIG.registrationFee} to confirm your pass.
                        </p>
                      </div>

                      <div className="space-y-3.5 mb-6">
                        {/* DELEGATE SUMMARY CARD */}
                        <div className="p-4 rounded-2xl bg-[#0a1226] border border-[#18284c]">
                          <div className="text-[10px] font-mono font-extrabold tracking-widest text-amber-400 uppercase mb-2">
                            DELEGATE SUMMARY
                          </div>
                          <div className="text-base font-extrabold text-white mb-0.5">
                            {fullName || 'PARTICIPANT NAME'}
                          </div>
                          <div className="text-xs text-slate-300 font-mono mb-0.5">
                            {email || 'email@domain.com'}
                          </div>
                          <div className="text-xs text-slate-300 font-mono mb-1.5">
                            {phone || '0000000000'}
                          </div>
                          <div className="text-xs font-semibold text-cyan-300 uppercase">
                            {displayDepartment} &bull; {college || 'COLLEGE NAME'}
                          </div>
                        </div>

                        {/* SELECTED CONTESTS CARD */}
                        <div className="p-4 rounded-2xl bg-[#0a1226] border border-[#18284c]">
                          <div className="text-[10px] font-mono font-extrabold tracking-widest text-amber-400 uppercase mb-2.5">
                            SELECTED CONTESTS ({totalSelectedEvents} / 3)
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {selectedTechEventObjects.map((e) => (
                              <span
                                key={e.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d2242] border border-cyan-500/40 text-xs font-mono text-cyan-300 font-semibold"
                              >
                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{e.name}</span>
                              </span>
                            ))}

                            {selectedNonTechEventObjects.map((e) => (
                              <span
                                key={e.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d1b15] border border-amber-500/40 text-xs font-mono text-amber-300 font-semibold"
                              >
                                <Flame className="w-3.5 h-3.5 text-amber-400" />
                                <span>{e.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* ENTRY FEE CARD */}
                        <div className="p-4 rounded-2xl bg-[#0a1226] border border-[#18284c] flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-bold text-white mb-0.5">
                              <CreditCard className="w-4 h-4 text-amber-400" />
                              <span>Delegate Entry Fee</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Includes kit, events, buffet lunch & physical certificate
                            </p>
                          </div>

                          <div className="text-2xl font-black font-cinzel text-amber-400 shrink-0">
                            ₹{SYMPOSIUM_CONFIG.registrationFee}
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => setStep(5)}
                          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:opacity-95 text-black font-extrabold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4 stroke-[2.5]" />
                          <span>PROCEED TO PAY ₹{SYMPOSIUM_CONFIG.registrationFee}</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="w-full py-3 rounded-2xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Prev</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* STEP 5: COMPLETE DELEGATE PAYMENT OVERLAY (UPI CHECKOUT MODAL) */
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  {/* HEADER LOGO & CHECKOUT BADGE */}
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>256-bit Secure UPI Checkout</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-orbitron text-white tracking-tight">
                      Complete Delegate Payment
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Finalize your delegate pass for {SYMPOSIUM_CONFIG.name} on {SYMPOSIUM_CONFIG.eventDate}.
                    </p>
                  </div>

                  {/* TOTAL PAYABLE AMOUNT BANNER */}
                  <div className="p-4 rounded-2xl bg-[#0e1a38] border border-[#1e3260] mb-5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-extrabold mb-0.5">
                        TOTAL AMOUNT PAYABLE
                      </div>
                      <p className="text-[11px] text-slate-300 max-w-xs">
                        Covers all events, delegate badge, buffet lunch & physical certificate
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black font-cinzel text-amber-400">
                        ₹{SYMPOSIUM_CONFIG.registrationFee}
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                        INC. OF ALL TAXES
                      </div>
                    </div>
                  </div>

                  {/* QR CODE & UPI DETAILS BOX */}
                  <div className="p-5 rounded-2xl bg-[#091122] border border-[#1b2b4f] mb-6 text-center">
                    {/* WHITE QR CODE CONTAINER */}
                    <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-between mb-4 border-2 border-amber-400/40">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(
                          SYMPOSIUM_CONFIG.upiId
                        )}%26pn%3DCISABZ%252026%26am%3D${SYMPOSIUM_CONFIG.registrationFee}.00%26cu%3DINR`}
                        alt="UPI Payment QR Code"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                      <div className="text-black font-mono font-bold text-[11px] border-t border-slate-200 pt-1.5 w-full">
                        ₹{SYMPOSIUM_CONFIG.registrationFee}.00 &bull; {SYMPOSIUM_CONFIG.name}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 font-mono">
                      Scan with <strong className="text-white font-bold">Google Pay, PhonePe, Paytm</strong>, or any UPI App to pay ₹{SYMPOSIUM_CONFIG.registrationFee}.
                    </p>

                    {/* UPI ID INPUT ROW */}
                    <div className="space-y-2 text-left">
                      <div className="p-2.5 rounded-xl bg-[#0e1832] border border-[#1c2c54] flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                            UPI ID
                          </div>
                          <div className="text-xs font-mono font-bold text-white truncate">
                            {SYMPOSIUM_CONFIG.upiId}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* MOBILE NUMBER INPUT ROW */}
                      <div className="p-2.5 rounded-xl bg-[#0e1832] border border-[#1c2c54] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                            MOBILE NUMBER
                          </div>
                          <div className="text-xs font-mono font-bold text-white">
                            {SYMPOSIUM_CONFIG.upiPhone}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyPhone}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          {copiedPhone ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FINAL SUBMIT BUTTON */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleCompletePayment}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>I HAVE COMPLETED PAYMENT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold uppercase transition-colors cursor-pointer"
                    >
                      ← Back to summary
                    </button>
                  </div>
                </motion.div>
              )
            ) : (
              /* SUBMITTED SUCCESS CONFIRMATION RECEIPT */
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mb-6">
                  Thank you <strong className="text-white">{fullName}</strong>. Your delegate pass application for {SYMPOSIUM_CONFIG.name} has been received.
                </p>

                {/* EMAIL DISPATCH ALERT BADGE */}
                <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 shadow-lg">
                  <Mail className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>✓ Confirmation Email Dispatched to: <strong>{email}</strong></span>
                </div>

                {/* RECEIPT SUMMARY BOX */}
                <div className="p-4 rounded-2xl bg-[#0b1328] border border-[#1c2c54] text-left text-xs font-mono space-y-2 mb-6">
                  <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>PASS TYPE:</span>
                    <span className="text-amber-400 font-bold">DELEGATE PASS (2 TECH + 1 NON-TECH)</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>COLLEGE:</span>
                    <span className="text-white font-bold truncate max-w-[200px]">{college}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>CONTESTS:</span>
                    <span className="text-cyan-300 font-bold">{totalSelectedEvents} Events ({selectedTechEvents.length} Tech + {selectedNonTechEvents.length} Non-Tech)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AMOUNT PAID:</span>
                    <span className="text-emerald-400 font-bold">₹{totalFee}</span>
                  </div>
                </div>

                <button
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close & Return to Website
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
