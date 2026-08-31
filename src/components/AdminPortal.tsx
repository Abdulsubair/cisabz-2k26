import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Key,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Building2,
  GraduationCap,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  Layers,
  Trash2,
} from 'lucide-react';
import { SYMPOSIUM_CONFIG, ALL_EVENTS, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/symposiumData';
import cisabzLogo from '../assets/cisabz-logo.jpg';
import kingsLogo from '../assets/kings-logo.jpg';

export interface RegistrationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  yearOfStudy: string;
  techEvents: string[];
  nonTechEvents: string[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING';
  timestamp: string;
  emailSentStatus: boolean;
}

const DEFAULT_RECORDS: RegistrationRecord[] = [];

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cisabz_admin_authed') === 'true';
  });

  // Login form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard view tabs: 'master' or 'event'
  const [activeTab, setActiveTab] = useState<'master' | 'event'>('master');

  // Master records
  const [records, setRecords] = useState<RegistrationRecord[]>([]);

  // Master Filters
  const [selectedCollege, setSelectedCollege] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Event specific filter
  const [selectedEventId, setSelectedEventId] = useState<string>('techverse');

  const loadRecords = () => {
    try {
      // Purge past test records for fresh page opening
      const purged = localStorage.getItem('cisabz_purged_test_v3');
      if (!purged) {
        localStorage.setItem('cisabz_registrations', JSON.stringify([]));
        localStorage.setItem('cisabz_purged_test_v3', 'true');
        setRecords([]);
        return;
      }

      const stored = localStorage.getItem('cisabz_registrations');
      if (stored) {
        const parsed: RegistrationRecord[] = JSON.parse(stored);
        setRecords(parsed);
      } else {
        localStorage.setItem('cisabz_registrations', JSON.stringify(DEFAULT_RECORDS));
        setRecords(DEFAULT_RECORDS);
      }
    } catch (e) {
      setRecords(DEFAULT_RECORDS);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDeleteSingleRecord = (idToDelete: string, name: string) => {
    if (window.confirm(`Delete registration for "${name}" (${idToDelete})?`)) {
      const updated = records.filter((r) => r.id !== idToDelete);
      setRecords(updated);
      localStorage.setItem('cisabz_registrations', JSON.stringify(updated));
    }
  };

  // Handle Login: Username: Cisabz2k26, Password: Admin@cisabz26
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'Cisabz2k26' && password.trim() === 'Admin@cisabz26') {
      setIsAuthenticated(true);
      localStorage.setItem('cisabz_admin_authed', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Username or Password. Please check credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cisabz_admin_authed');
    setUsername('');
    setPassword('');
  };

  const handleResetDatabase = () => {
    if (window.confirm('Are you sure you want to clear all registration data and start with a fresh blank page?')) {
      localStorage.setItem('cisabz_registrations', JSON.stringify([]));
      setRecords([]);
    }
  };

  // Filter master records
  const collegesList = Array.from(new Set(records.map((r) => r.college)));
  const yearsList = ['1st Year (Freshman)', '2nd Year', '3rd Year', '4th Year (Final)'];

  const filteredMasterRecords = records.filter((r) => {
    const matchesCollege = selectedCollege === 'ALL' || r.college === selectedCollege;
    const matchesYear = selectedYear === 'ALL' || r.yearOfStudy === selectedYear;
    const matchesSearch =
      searchQuery === '' ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.college.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCollege && matchesYear && matchesSearch;
  });

  // Filter event-specific records
  const currentSelectedEventObj = ALL_EVENTS.find((e) => e.id === selectedEventId) || ALL_EVENTS[0];
  const eventParticipants = records.filter((r) =>
    r.techEvents.includes(selectedEventId) || r.nonTechEvents.includes(selectedEventId)
  );

  // 1-Click Master PDF & CSV Export per user request
  const handleExportMasterPdf = () => {
    window.print();
  };

  const handleExportMasterCsv = () => {
    const headers = [
      'Registration ID',
      'Full Name',
      'Email',
      'Phone',
      'College',
      'Department',
      'Year of Study',
      'Technical Events',
      'Non-Technical Events',
      'Total Amount Paid (INR)',
      'Payment Status',
      'Timestamp',
    ];

    const rows = filteredMasterRecords.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.college}"`,
      `"${r.department}"`,
      `"${r.yearOfStudy}"`,
      `"${r.techEvents.join(', ')}"`,
      `"${r.nonTechEvents.join(', ')}"`,
      r.totalAmount,
      `"${r.paymentStatus}"`,
      `"${r.timestamp}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CISABZ-2K26_Master_Registrations_2026-09-25.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable PDF / Xerox Attendance Sheet Trigger
  const handlePrintEventPdf = () => {
    window.print();
  };

  // IF NOT AUTHENTICATED -> SHOW CYBER SECURITY ADMIN LOGIN PORTAL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden select-none">
        {/* BACK TO WEBSITE TOP BAR */}
        <div className="flex items-center justify-between z-20 max-w-5xl mx-auto w-full">
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>RETURN TO PUBLIC WEBSITE</span>
          </button>
          <span className="text-xs font-mono text-cyan-400">ORGANIZER AUTH PORTAL // v2026</span>
        </div>

        {/* LOGIN CARD */}
        <div className="my-auto relative z-20 max-w-md w-full mx-auto p-7 sm:p-9 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(212,175,55,0.25)]">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-black border-2 border-amber-400 p-1 mb-3 shadow-[0_0_25px_rgba(212,175,55,0.6)]">
              <img src={cisabzLogo} alt="CISABZ Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-2xl font-extrabold font-orbitron text-white">
              Organizer Admin Login
            </h2>
            <p className="text-xs text-amber-300 font-mono mt-1">
              Protected Portal • Authorized Personnel Only
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Username</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-amber-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-amber-400 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black font-extrabold font-orbitron text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>AUTHENTICATE & LOG IN</span>
            </button>
          </form>
        </div>

        <div className="text-center font-mono text-[11px] text-slate-500 z-20">
          &copy; 2026 {SYMPOSIUM_CONFIG.name} &bull; {SYMPOSIUM_CONFIG.department}
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED -> SHOW ORGANIZER ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      {/* NO-PRINT TOP NAVIGATION HEADER */}
      <header className="print:hidden max-w-7xl mx-auto mb-8 pb-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black border-2 border-amber-400 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            <img src={cisabzLogo} alt="CISABZ Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                ORGANIZER ADMIN PORTAL
              </span>
              <span className="text-[10px] font-mono text-emerald-400">&bull; AUTHENTICATED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-orbitron text-white">
              {SYMPOSIUM_CONFIG.name} Registrations Management
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-mono font-bold transition-all cursor-pointer"
            title="Clear all saved data and start fresh"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>CLEAR ALL DATA</span>
          </button>

          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>WEBSITE VIEW</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* NO-PRINT TAB NAVIGATION BUTTONS */}
        <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-2 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('master')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'master'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>1. MASTER REGISTRATIONS SHEET</span>
            </button>

            <button
              onClick={() => setActiveTab('event')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'event'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>2. EVENT PARTICIPANTS & PRINTABLE PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {activeTab === 'master' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMasterPdf}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white font-bold font-mono text-xs tracking-wider uppercase shadow-md hover:scale-102 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>📄 EXPORT AS PDF FORMAT</span>
                </button>
                <button
                  onClick={handleExportMasterCsv}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold font-mono text-xs tracking-wider uppercase border border-slate-700 transition-all cursor-pointer"
                  title="Download CSV for Mac clearance"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handlePrintEventPdf}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold font-mono text-xs tracking-wider uppercase shadow-md hover:scale-102 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / SAVE EVENT PDF XEROX</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: MASTER EXCEL SHEET */}
        {activeTab === 'master' && (
          <div className="print:hidden space-y-6">
            {/* MASTER FILTERS BAR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Filter By College:</span>
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:border-cyan-500 outline-none"
                >
                  <option value="ALL">All Colleges ({records.length})</option>
                  {collegesList.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-purple-400 uppercase font-bold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Filter By Year of Study:</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:border-purple-500 outline-none"
                >
                  <option value="ALL">All Years (1st, 2nd, 3rd, 4th Year)</option>
                  {yearsList.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Delegate Name / Email:</span>
                </label>
                <input
                  type="text"
                  placeholder="Search name, email, reg id..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* MASTER SPREADSHEET TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 font-mono text-xs">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5">Registration ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">College & Dept</th>
                    <th className="p-3.5">Year</th>
                    <th className="p-3.5">Events Selected</th>
                    <th className="p-3.5">Fee</th>
                    <th className="p-3.5">Registration Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {filteredMasterRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                        No registrations matching selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMasterRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold text-cyan-400">{r.id}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{r.fullName}</div>
                          <div className="text-[10px] text-slate-400">{r.email} | {r.phone}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-200">{r.college}</div>
                          <div className="text-[10px] text-purple-300">{r.department}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 text-[10px] font-bold">
                            {r.yearOfStudy}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="text-[10px] text-cyan-300">
                            Tech: {r.techEvents.join(', ')}
                          </div>
                          <div className="text-[10px] text-purple-300">
                            Non-Tech: {r.nonTechEvents.join(', ')}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-200 font-bold border border-slate-700">
                            ₹{r.totalAmount}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {r.paymentStatus.includes('NOT PAID') || r.paymentStatus === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                              <span>REGISTERED (NOT PAID)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>PAID (CONFIRMED)</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteSingleRecord(r.id, r.fullName)}
                            title="Delete this registration"
                            className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EVENT-SPECIFIC PARTICIPANTS & PRINTABLE PDF / XEROX ATTENDANCE SHEET */}
        {activeTab === 'event' && (
          <div className="space-y-6">
            {/* EVENT SELECTOR BAR (NO-PRINT) */}
            <div className="print:hidden p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 w-full sm:w-1/2">
                <label className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Select Event to Generate Participant List:</span>
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white font-bold rounded-xl px-3 py-2.5 focus:border-amber-400 outline-none"
                >
                  <optgroup label="TECHNICAL EVENTS">
                    {TECHNICAL_EVENTS.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.subtitle})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="NON-TECHNICAL EVENTS">
                    {NON_TECHNICAL_EVENTS.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.subtitle})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="text-right text-xs text-slate-300">
                <span>Participants Registered for <strong>{currentSelectedEventObj.name}</strong>: </span>
                <strong className="text-amber-400 font-orbitron text-base">{eventParticipants.length} Delegates</strong>
              </div>
            </div>

            {/* OFFICIAL PRINTABLE PDF REPORT CONTAINER MATCHING COLLEGE ASSESSMENT REPORT STRUCTURE */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 print:bg-white text-slate-100 print:text-black border border-slate-800 print:border-none shadow-2xl print:shadow-none font-sans">
              {/* OFFICIAL KINGS & CISABZ DUAL LOGO HEADER BLOCK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-slate-700 print:border-black">
                {/* LEFT: KINGS LOGO & TITLE */}
                <div className="flex items-center gap-3">
                  <img
                    src={kingsLogo}
                    alt="KINGS College Shield Logo"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
                  />
                  <div>
                    <h1 className="text-base sm:text-xl font-black tracking-tight text-white print:text-black uppercase">
                      KINGS
                    </h1>
                    <h2 className="text-[10px] sm:text-xs font-bold text-cyan-400 print:text-black uppercase">
                      COLLEGE OF ENGINEERING
                    </h2>
                    <p className="text-[9px] text-slate-400 print:text-black font-semibold">
                      (AUTONOMOUS)
                    </p>
                  </div>
                </div>

                {/* CENTER: CISABZ-2K26 SYMPOSIUM LOGO */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black border-2 border-amber-400 print:border-black p-1 shadow-[0_0_15px_rgba(212,175,55,0.4)] print:shadow-none overflow-hidden flex items-center justify-center">
                    <img
                      src={cisabzLogo}
                      alt="CISABZ-2K26 Official Logo"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <span className="text-[9px] font-orbitron font-bold text-amber-400 print:text-black uppercase mt-1 tracking-wider">
                    {SYMPOSIUM_CONFIG.name}
                  </span>
                </div>

                {/* RIGHT: ACCREDITATION DETAILS */}
                <div className="text-right text-[9px] sm:text-[10px] text-slate-400 print:text-gray-700 font-semibold space-y-0.5">
                  <div>Approved by AICTE, New Delhi</div>
                  <div>Affiliated to Anna University, Chennai</div>
                  <div>Recognized under 2(f) & 12B, UGC</div>
                  <div>NAAC Accredited Institution</div>
                </div>
              </div>

              {/* CENTERED SYMPOSIUM REPORT TITLE HEADER */}
              <div className="text-center mb-6 space-y-1">
                <h2 className="text-base sm:text-lg font-black text-white print:text-black uppercase tracking-wide">
                  Department of Computer Science and Engineering
                </h2>
                <p className="text-xs font-bold text-amber-400 print:text-black uppercase font-mono">
                  Academic Year 2025-2026 / Even Semester &bull; {SYMPOSIUM_CONFIG.name}
                </p>
                <p className="text-sm font-black text-cyan-300 print:text-black uppercase font-orbitron">
                  Event Participation & Delegate Verification Report — {currentSelectedEventObj.name.toUpperCase()}
                </p>
              </div>

              {/* SUB-HEADER META BAR */}
              <div className="mb-4 p-3 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-black flex flex-wrap items-center justify-between text-xs font-mono print:text-black font-bold gap-2">
                <div>
                  <span>Event Category: </span>
                  <span className="text-cyan-400 print:text-black uppercase">
                    {currentSelectedEventObj.category.toLowerCase().includes('non') ? 'NON-TECHNICAL EVENT' : 'TECHNICAL EVENT'}
                  </span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span>Rounds: {currentSelectedEventObj.rounds}</span>
                </div>
                <div>
                  <span>Venue: {SYMPOSIUM_CONFIG.venueName}</span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span>Total Strength: <strong className="text-amber-400 print:text-black">{eventParticipants.length} Participants</strong></span>
                </div>
              </div>

              {/* OFFICIAL GRID TABLE MATCHING REFERENCE IMAGE */}
              <table className="w-full text-left border-collapse text-xs print:text-black border border-slate-700 print:border-black font-mono">
                <thead>
                  <tr className="bg-slate-900 print:bg-gray-200 text-slate-200 print:text-black font-bold uppercase text-[10px] border-b border-slate-700 print:border-black">
                    <th className="p-2 border border-slate-700 print:border-black text-center w-12">S.No</th>
                    <th className="p-2 border border-slate-700 print:border-black">Reg. ID</th>
                    <th className="p-2 border border-slate-700 print:border-black">Student Name</th>
                    <th className="p-2 border border-slate-700 print:border-black">College Name</th>
                    <th className="p-2 border border-slate-700 print:border-black">Dept & Year</th>
                    <th className="p-2 border border-slate-700 print:border-black">Email ID</th>
                    <th className="p-2 border border-slate-700 print:border-black">Mobile No.</th>
                    <th className="p-2 border border-slate-700 print:border-black text-center">Attendance Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 print:text-black font-sans">
                        No participants registered for {currentSelectedEventObj.name} yet.
                      </td>
                    </tr>
                  ) : (
                    eventParticipants.map((p, idx) => (
                      <tr key={p.id} className="border-b border-slate-800 print:border-black hover:bg-slate-900/50">
                        <td className="p-2 border border-slate-700 print:border-black text-center font-bold">{idx + 1}</td>
                        <td className="p-2 border border-slate-700 print:border-black font-bold text-cyan-400 print:text-black">{p.id}</td>
                        <td className="p-2 border border-slate-700 print:border-black font-bold text-white print:text-black">{p.fullName}</td>
                        <td className="p-2 border border-slate-700 print:border-black text-slate-300 print:text-black">{p.college}</td>
                        <td className="p-2 border border-slate-700 print:border-black text-purple-300 print:text-black">{p.department} ({p.yearOfStudy})</td>
                        <td className="p-2 border border-slate-700 print:border-black text-[10px] text-slate-300 print:text-black">{p.email}</td>
                        <td className="p-2 border border-slate-700 print:border-black font-bold">{p.phone}</td>
                        <td className="p-2 border border-slate-700 print:border-black text-center text-slate-500 print:text-gray-400 italic text-[10px]">
                          [ Sign Here ]
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* EVENT FACULTY COORDINATOR SIGNATURE FOOTER */}
              <div className="mt-12 pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 text-xs print:text-black font-mono">
                <div>
                  <div className="text-slate-400 print:text-black mb-8">Faculty Coordinator Signature:</div>
                  <div className="font-bold border-b-2 border-slate-600 print:border-black w-56" />
                </div>
                <div className="text-right">
                  <div className="text-slate-400 print:text-black mb-8">Head of the Department Signature:</div>
                  <div className="font-bold border-b-2 border-slate-600 print:border-black w-56 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
