import React, { useState, useEffect, useRef } from 'react';
import { SYMPOSIUM_CONFIG } from '../../data/symposiumData';
import {
  submitRegistration,
  subscribeEventStatuses,
} from '../../lib/firebase';
import type { RegistrationData } from '../../lib/firebase';
import {
  User,
  Utensils,
  Terminal,
  Trophy,
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileCheck,
  Copy,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';

interface ParticipantRegistrationPageProps {
  onBackToHome: () => void;
}

export const ParticipantRegistrationPage: React.FC<ParticipantRegistrationPageProps> = ({
  onBackToHome,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState<'I Year' | 'II Year' | 'III Year' | 'IV Year' | ''>('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [ambassadorReferralId, setAmbassadorReferralId] = useState('');
  const [foodPreference, setFoodPreference] = useState<'Veg' | 'Non-Veg'>('Veg');

  const [technicalEvent, setTechnicalEvent] = useState('');
  const [nonTechnicalEvent, setNonTechnicalEvent] = useState('');

  const [transactionId, setTransactionId] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  // Realtime Event Registration Statuses (Open / Closed by Admin)
  const [eventStatuses, setEventStatuses] = useState<Record<string, boolean>>({
    TECHVERSE: true,
    'TECH BRAINIAC': true,
    'PROMPT FUSION': true,
    'BUG BASH': true,
    PINPOINT: true,
    'BRAND SPOT': true,
    'HAMMER HIT': true,
    CONNECTION: true,
  });

  // UI / Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    // Listen for live event open/close toggles
    const unsub = subscribeEventStatuses((statuses) => {
      setEventStatuses(statuses);
    });
    return () => unsub();
  }, []);

  const technicalEventsList = [
    { id: 'TECHVERSE', name: 'TECHVERSE', desc: 'Paper Presentation & Innovation' },
    { id: 'TECH BRAINIAC', name: 'TECH BRAINIAC', desc: 'Technical Quiz & Speed Round' },
    { id: 'PROMPT FUSION', name: 'PROMPT FUSION', desc: 'AI Prompt Challenge' },
    { id: 'BUG BASH', name: 'BUG BASH', desc: 'Code Debugging Competition' },
  ];

  const nonTechnicalEventsList = [
    { id: 'PINPOINT', name: 'PINPOINT', desc: 'Category / Word Guessing' },
    { id: 'BRAND SPOT', name: 'BRAND SPOT', desc: 'Logo Finding Challenge' },
    { id: 'HAMMER HIT', name: 'HAMMER HIT', desc: 'Mock IPL Auction' },
    { id: 'CONNECTION', name: 'CONNECTION', desc: 'Link & Think Visual Logic' },
  ];

  // Handle Payment Proof File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        paymentProof: 'File size must be less than 10 MB.',
      }));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        paymentProof: 'Supported file formats: JPG, JPEG, PNG, WEBP, or PDF.',
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.paymentProof;
      return copy;
    });

    setPaymentProofFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPaymentProofPreview(null);
    }
  };

  // Form Validation UX
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!collegeName.trim()) {
      newErrors.collegeName = 'Please enter your college / institution name.';
    }

    if (!department.trim()) {
      newErrors.department = 'Please enter your department name.';
    }

    if (!year) {
      newErrors.year = 'Please select your year of study.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Please enter your 10-digit mobile number.';
    } else {
      const cleanMobile = mobile.trim().replace(/\D/g, '');
      const indianMobileRegex = /^[6-9]\d{9}$/;
      if (cleanMobile.length !== 10 || !indianMobileRegex.test(cleanMobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
      }
    }

    if (!technicalEvent) {
      newErrors.technicalEvent = 'Please select one technical event.';
    } else if (eventStatuses[technicalEvent] === false) {
      newErrors.technicalEvent = `${technicalEvent} registration is closed. Please select another event.`;
    }

    if (!nonTechnicalEvent) {
      newErrors.nonTechnicalEvent = 'Please select one non-technical event.';
    } else if (eventStatuses[nonTechnicalEvent] === false) {
      newErrors.nonTechnicalEvent = `${nonTechnicalEvent} registration is closed. Please select another event.`;
    }

    if (!transactionId.trim()) {
      newErrors.transactionId = 'Please enter your payment transaction ID / UTR number.';
    } else if (transactionId.trim().length < 4) {
      newErrors.transactionId = 'Please enter a valid transaction ID.';
    }

    if (!paymentName.trim()) {
      newErrors.paymentName = 'Please enter the name used during payment.';
    }

    if (!paymentProofFile) {
      newErrors.paymentProof = 'Please upload your payment proof screenshot or receipt.';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isSubmittingRef.current) return;

    const validationErrors = validateForm();
    const errorKeys = Object.keys(validationErrors);

    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const errorEl = document.getElementById(`field-${firstErrorKey}`);
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputEl = errorEl.querySelector('input, select') as HTMLElement | null;
        if (inputEl) {
          setTimeout(() => inputEl.focus(), 300);
        }
      }
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrors({});

    try {
      // Execute registration submission directly to Cloud Firestore
      const result = await submitRegistration(
        {
          fullName,
          collegeName,
          department,
          year: year as 'I Year' | 'II Year' | 'III Year' | 'IV Year',
          email,
          mobile,
          ambassadorReferralId,
          foodPreference,
          technicalEvent,
          nonTechnicalEvent,
          transactionId,
          paymentName,
        },
        paymentProofFile!
      );

      // Successfully saved and verified in Firestore: clear inputs and display success popup
      setSubmittedData(result);
      setFullName('');
      setCollegeName('');
      setDepartment('');
      setEmail('');
      setMobile('');
      setAmbassadorReferralId('');
      setTransactionId('');
      setPaymentName('');
      setPaymentProofFile(null);
      setPaymentProofPreview(null);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Registration Submission Error:', err);
      setErrors({
        submit: err.message || 'Failed to save registration in Firestore database. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 3000);
  };

  // SUCCESS POPUP MODAL SCREEN
  if (submittedData) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-950/95 text-slate-100 backdrop-blur-2xl">
        <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center relative overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          {/* Success Icon Badge */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-3 inline-block">
            FIRESTORE DOCUMENT CREATED SUCCESSFULLY
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white tracking-wide mb-2">
            Successfully Registered!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Your participant registration details have been successfully written to Firebase Firestore. Payment is currently set to <strong className="text-amber-400 font-semibold">PENDING VERIFICATION</strong>.
          </p>

          {/* Registration ID Display Card */}
          <div className="bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-5 mb-6 text-left relative group">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              Official Registration ID
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400 tracking-wider">
                {submittedData.id}
              </span>
              <button
                onClick={() => handleCopyId(submittedData.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-slate-700 transition-colors"
              >
                {copiedId ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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

          {/* Summary Breakdown */}
          <div className="bg-slate-950/60 rounded-2xl p-4 text-left border border-slate-800 mb-6 space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Participant Name:</span>
              <span className="font-bold text-white">{submittedData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">College:</span>
              <span className="font-bold text-white truncate max-w-[200px]">{submittedData.collegeName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Technical Event:</span>
              <span className="font-bold text-cyan-400">{submittedData.technicalEvent}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Non-Technical Event:</span>
              <span className="font-bold text-amber-400">{submittedData.nonTechnicalEvent}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Transaction ID:</span>
              <span className="font-bold text-slate-200">{submittedData.transactionId}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Database Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                SAVED IN FIRESTORE
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedData(null);
              onBackToHome();
            }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:brightness-110 text-white font-orbitron font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            Done / Back to Home
          </button>
        </div>
      </div>
    );
  }

  // MAIN REGISTRATION FORM
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative">
      {/* PROCESSING STATE MODAL OVERLAY (3 SECONDS) */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/50 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.35)] relative overflow-hidden animate-in fade-in duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse" />

            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>

            <h3 className="text-2xl font-black font-orbitron text-white mb-2 tracking-wide">
              Registering...
            </h3>

            <p className="text-xs text-slate-300 font-mono mb-6 leading-relaxed">
              Please wait while your participant registration details and payment proof are being processed and stored into Firebase Firestore...
            </p>

            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
              <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>

            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mt-3">
              Firebase Firestore &bull; Creating Document (3s)
            </span>
          </div>
        </div>
      )}
      {/* Top Header Controls */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Website</span>
        </button>

        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
          Official Event Portal
        </span>
      </div>

      {/* Main Page Title Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{SYMPOSIUM_CONFIG.name} REGISTRATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-orbitron tracking-tight text-white mb-3">
          Event Registration
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-rajdhani">
          Register for ONE Technical Event and ONE Non-Technical Event. Complete your payment details to reserve your spot.
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
        {/* Global Submit Error Message */}
        {errors.submit && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* SECTION 1 — PARTICIPANT DETAILS */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Participant Details
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Provide accurate details for certificates and event records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div id="field-fullName">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Akash Kumar"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                    errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-rajdhani`}
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* College Name */}
            <div id="field-collegeName">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                College / Institution Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Kings College of Engineering"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                    errors.collegeName ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-rajdhani`}
                />
              </div>
              {errors.collegeName && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.collegeName}</span>
                </p>
              )}
            </div>

            {/* Department */}
            <div id="field-department">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Department <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science and Engineering"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                    errors.department ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                  } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-rajdhani`}
                />
              </div>
              {errors.department && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.department}</span>
                </p>
              )}
            </div>

            {/* Year of Study */}
            <div id="field-year">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Year of Study <span className="text-rose-400">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as any)}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.year ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                } ${!year ? 'text-slate-500' : 'text-white'} focus:outline-none transition-colors text-sm font-mono cursor-pointer`}
              >
                <option value="" disabled className="text-slate-500 bg-slate-950">Select Year of Study</option>
                <option value="I Year" className="text-white bg-slate-950">I Year</option>
                <option value="II Year" className="text-white bg-slate-950">II Year</option>
                <option value="III Year" className="text-white bg-slate-950">III Year</option>
                <option value="IV Year" className="text-white bg-slate-950">IV Year</option>
              </select>
              {errors.year && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.year}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div id="field-email">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@gmail.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-rajdhani`}
              />
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div id="field-mobile">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Mobile Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter a valid 10-digit number"
                maxLength={10}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.mobile ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'
                } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-mono`}
              />
              {errors.mobile && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.mobile}</span>
                </p>
              )}
            </div>

            {/* Ambassador Referral ID */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Ambassador Referral ID <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={ambassadorReferralId}
                onChange={(e) => setAmbassadorReferralId(e.target.value)}
                placeholder="e.g. AMB-102"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-mono"
              />
            </div>

            {/* Food Preference */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Food Preference <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFoodPreference('Veg')}
                  className={`py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    foodPreference === 'Veg'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>VEG</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFoodPreference('Non-Veg')}
                  className={`py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    foodPreference === 'Non-Veg'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>NON-VEG</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — TECHNICAL EVENT */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Technical Event
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Choose ONE technical event.
              </p>
            </div>
          </div>

          <div id="field-technicalEvent">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
              Technical Event <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                value={technicalEvent}
                onChange={(e) => setTechnicalEvent(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border ${
                  errors.technicalEvent ? 'border-rose-500' : 'border-slate-800 focus:border-blue-400'
                } ${!technicalEvent ? 'text-slate-500' : 'text-white'} focus:outline-none transition-colors text-sm font-mono cursor-pointer`}
              >
                <option value="" disabled className="text-slate-500 bg-slate-950">Select Technical Event</option>
                {technicalEventsList.map((evt) => {
                  const isOpen = eventStatuses[evt.id] !== false;
                  return (
                    <option key={evt.id} value={evt.id} disabled={!isOpen} className="text-white bg-slate-950">
                      {evt.name} {isOpen ? '' : '— [ Registration Closed ]'}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Technical Event Details Card */}
            {technicalEvent && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400 block">
                    Selected Technical Event:
                  </span>
                  <span className="text-sm font-orbitron font-bold text-white">
                    {technicalEvent}
                  </span>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {technicalEventsList.find((e) => e.id === technicalEvent)?.desc}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                  1 Allowed
                </span>
              </div>
            )}

            {errors.technicalEvent && (
              <p className="text-rose-400 text-xs mt-2 font-mono flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.technicalEvent}</span>
              </p>
            )}
          </div>
        </div>

        {/* SECTION 3 — NON-TECHNICAL EVENT */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Non-Technical Event
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Choose ONE non-technical event.
              </p>
            </div>
          </div>

          <div id="field-nonTechnicalEvent">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
              Non-Technical Event <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                value={nonTechnicalEvent}
                onChange={(e) => setNonTechnicalEvent(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border ${
                  errors.nonTechnicalEvent ? 'border-rose-500' : 'border-slate-800 focus:border-amber-400'
                } ${!nonTechnicalEvent ? 'text-slate-500' : 'text-white'} focus:outline-none transition-colors text-sm font-mono cursor-pointer`}
              >
                <option value="" disabled className="text-slate-500 bg-slate-950">Select Non-Technical Event</option>
                {nonTechnicalEventsList.map((evt) => {
                  const isOpen = eventStatuses[evt.id] !== false;
                  return (
                    <option key={evt.id} value={evt.id} disabled={!isOpen} className="text-white bg-slate-950">
                      {evt.name} {isOpen ? '' : '— [ Registration Closed ]'}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Non-Technical Event Details Card */}
            {nonTechnicalEvent && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    Selected Non-Technical Event:
                  </span>
                  <span className="text-sm font-orbitron font-bold text-white">
                    {nonTechnicalEvent}
                  </span>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {nonTechnicalEventsList.find((e) => e.id === nonTechnicalEvent)?.desc}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  1 Allowed
                </span>
              </div>
            )}

            {errors.nonTechnicalEvent && (
              <p className="text-rose-400 text-xs mt-2 font-mono flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.nonTechnicalEvent}</span>
              </p>
            )}
          </div>
        </div>

        {/* SECTION 4 — PAYMENT DETAILS */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Payment Details
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Complete the payment and provide your transaction details.
              </p>
            </div>
          </div>

          {/* QR CODE DISPLAY AREA */}
          <div className="mb-8 p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Registration Fee: ₹{SYMPOSIUM_CONFIG.registrationFee}
              </span>
              <h3 className="text-lg font-bold font-orbitron text-white">
                Payment QR Code
              </h3>
              <p className="text-xs text-slate-400 font-rajdhani">
                Scan the QR code using Google Pay, PhonePe, Paytm, or any UPI app to pay ₹{SYMPOSIUM_CONFIG.registrationFee}.
              </p>

              <div className="pt-2 text-xs font-mono space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800 inline-block text-left">
                <div><span className="text-slate-400">UPI ID:</span> <strong className="text-cyan-300">{SYMPOSIUM_CONFIG.upiId}</strong></div>
                <div><span className="text-slate-400">Name:</span> <strong className="text-white">{SYMPOSIUM_CONFIG.upiName}</strong></div>
                <div><span className="text-slate-400">Phone:</span> <strong className="text-amber-300">{SYMPOSIUM_CONFIG.upiPhone}</strong></div>
              </div>
            </div>

            {/* Clean Premium QR Code Display Box */}
            <div className="w-56 shrink-0 bg-slate-900/90 rounded-2xl p-3 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center gap-2 relative">
              <div className="w-full aspect-square bg-white rounded-xl p-3 flex items-center justify-center shadow-inner">
                <img
                  src="/assets/payment-qr.png"
                  alt="CISABZ-2K26 Official Payment QR Code (Mubashir M)"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase text-center">
                Scan to complete payment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction ID / UTR Number */}
            <div id="field-transactionId">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Transaction ID / UTR Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 429104829104"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.transactionId ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-400'
                } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-mono`}
              />
              {errors.transactionId && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.transactionId}</span>
                </p>
              )}
            </div>

            {/* Name Used for Payment */}
            <div id="field-paymentName">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Name Used for Payment <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={paymentName}
                onChange={(e) => setPaymentName(e.target.value)}
                placeholder="Name associated with UPI account"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.paymentName ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-400'
                } text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-rajdhani`}
              />
              {errors.paymentName && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.paymentName}</span>
                </p>
              )}
            </div>

            {/* Payment Proof Upload Container */}
            <div id="field-paymentProof" className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Payment Proof <span className="text-rose-400">*</span>
              </label>
              <p className="text-xs text-slate-400 font-mono mb-3">
                Please upload your payment screenshot. Supported formats: JPG, PNG, WEBP or PDF • Max 10 MB.
              </p>

              <div className="relative">
                <input
                  type="file"
                  id="payment-proof-input"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="payment-proof-input"
                  className={`w-full p-6 rounded-2xl border-2 stroke-dasharray border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
                    errors.paymentProof
                      ? 'border-rose-500/80 bg-rose-950/20'
                      : paymentProofFile
                      ? 'border-emerald-500/80 bg-emerald-950/20'
                      : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/80'
                  }`}
                >
                  {paymentProofFile ? (
                    <div className="flex items-center gap-4 text-left w-full">
                      {paymentProofPreview ? (
                        <img
                          src={paymentProofPreview}
                          alt="Payment Proof Preview"
                          className="w-16 h-16 object-cover rounded-xl border border-emerald-500/50"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center border border-emerald-500/50 text-emerald-400">
                          <FileCheck className="w-8 h-8" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono text-emerald-400 font-bold block truncate">
                          ✓ File Attached
                        </span>
                        <p className="text-sm font-bold text-white truncate">
                          {paymentProofFile.name}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {(paymentProofFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPaymentProofFile(null);
                          setPaymentProofPreview(null);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 py-2">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-mono font-bold text-white block">
                        Upload Payment Proof
                      </span>
                      <span className="text-xs text-cyan-400 font-mono">
                        Click to select a file (JPG, PNG or PDF • Max 10 MB)
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {errors.paymentProof && (
                <p className="text-rose-400 text-xs mt-2 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.paymentProof}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SUBMISSION BUTTON */}
        <div className="pt-4 space-y-3">
          {Object.keys(errors).length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono space-y-1.5 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <div className="flex items-center gap-2 font-bold uppercase text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please fill in all required fields before submitting:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-rose-200/90 pl-1">
                {errors.fullName && <li>Full Name: {errors.fullName}</li>}
                {errors.collegeName && <li>College Name: {errors.collegeName}</li>}
                {errors.department && <li>Department: {errors.department}</li>}
                {errors.year && <li>Year of Study: {errors.year}</li>}
                {errors.email && <li>Email Address: {errors.email}</li>}
                {errors.mobile && <li>Mobile Number: {errors.mobile}</li>}
                {errors.technicalEvent && <li>Technical Event: {errors.technicalEvent}</li>}
                {errors.nonTechnicalEvent && <li>Non-Technical Event: {errors.nonTechnicalEvent}</li>}
                {errors.transactionId && <li>Transaction ID: {errors.transactionId}</li>}
                {errors.paymentName && <li>Payment Name: {errors.paymentName}</li>}
                {errors.paymentProof && <li>Payment Proof: {errors.paymentProof}</li>}
                {errors.submit && <li>{errors.submit}</li>}
              </ul>
              <p className="text-[11px] text-amber-300 font-bold pt-1 border-t border-rose-900/50">
                Note: Ambassador Referral ID is OPTIONAL and can be left empty.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-orbitron font-bold text-base tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer ${
              isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_35px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Register Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
