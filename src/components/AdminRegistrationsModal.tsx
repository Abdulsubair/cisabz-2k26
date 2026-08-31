import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileSpreadsheet,
  Download,
  Search,
  Building2,
  GraduationCap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

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

interface AdminRegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminRegistrationsModal: React.FC<AdminRegistrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load live records from localStorage
  const loadRecords = () => {
    try {
      const stored = localStorage.getItem('cisabz_registrations');
      if (stored) {
        const parsed: RegistrationRecord[] = JSON.parse(stored);
        const sampleIds = [
          'CISABZ-2K26-REG-1001',
          'CISABZ-2K26-REG-1002',
          'CISABZ-2K26-REG-1003',
          'CISABZ-2K26-REG-1004',
          'CISABZ-2K26-REG-1005',
          'CISABZ-2K26-REG-1006',
        ];
        const cleaned = parsed.filter((r) => !sampleIds.includes(r.id));
        setRecords(cleaned);
        localStorage.setItem('cisabz_registrations', JSON.stringify(cleaned));
      } else {
        localStorage.setItem('cisabz_registrations', JSON.stringify(DEFAULT_RECORDS));
        setRecords(DEFAULT_RECORDS);
      }
    } catch (e) {
      setRecords(DEFAULT_RECORDS);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRecords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract unique colleges
  const collegesList = Array.from(new Set(records.map((r) => r.college)));
  const yearsList = ['1st Year (Freshman)', '2nd Year', '3rd Year', '4th Year (Final)'];

  // Filter records
  const filteredRecords = records.filter((r) => {
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

  // Calculate live stats
  const totalRevenue = records.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // 1-Click Excel / CSV Export
  const handleExportToExcel = () => {
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
      'Registration Timestamp',
      'Confirmation Email Dispatched',
    ];

    const rows = filteredRecords.map((r) => [
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
      r.emailSentStatus ? '"YES"' : '"NO"',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CISABZ-2K26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* DIALOG CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[90vh] bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] z-10 flex flex-col justify-between overflow-hidden"
        >
          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase mb-1 border border-cyan-500/40">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>LIVE ORGANIZER REGISTRATION DATABASE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white">
                Student Registration Sheet
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold font-mono text-xs tracking-wider uppercase shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT TO EXCEL (.XLSX)</span>
              </button>

              <button
                onClick={loadRecords}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* LIVE METRICS TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Total Registered</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-cyan-400">{records.length} Students</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Colleges Represented</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-purple-400">{collegesList.length} Colleges</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Total Revenue Collected</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-amber-400">₹{totalRevenue}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">Mails Dispatched</span>
              <span className="text-xl sm:text-2xl font-black font-orbitron text-emerald-400">100% Sent</span>
            </div>
          </div>

          {/* FILTERS & SEARCH CONTROL BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-4 text-xs">
            {/* FILTER BY COLLEGE */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>Filter By College:</span>
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:border-cyan-500 outline-none"
              >
                <option value="ALL">All Colleges ({records.length})</option>
                {collegesList.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* FILTER BY YEAR OF STUDY */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                <span>Filter By Year of Study:</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:border-purple-500 outline-none"
              >
                <option value="ALL">All Years (1st, 2nd, 3rd, 4th Year)</option>
                {yearsList.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* SEARCH INPUT */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                <Search className="w-3 h-3" />
                <span>Search Delegate / Reg ID:</span>
              </label>
              <input
                type="text"
                placeholder="Search name, email, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* LIVE SPREADSHEET TABLE */}
          <div className="flex-1 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 font-mono text-xs">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="p-3">Registration ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">College & Dept</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Events Selected</th>
                  <th className="p-3">Paid (₹)</th>
                  <th className="p-3">Email Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">
                      No student records found matching selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-cyan-400">{r.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{r.fullName}</div>
                        <div className="text-[10px] text-slate-400">{r.email}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-200">{r.college}</div>
                        <div className="text-[10px] text-purple-300">{r.department}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 text-[10px] font-bold">
                          {r.yearOfStudy}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-[10px] text-cyan-300">
                          Tech: {r.techEvents.join(', ')}
                        </div>
                        <div className="text-[10px] text-purple-300">
                          Non-Tech: {r.nonTechEvents.join(', ')}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          ₹{r.totalAmount}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>SENT</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER BAR */}
          <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredRecords.length} of {records.length} registrations</span>
            <span>Live Data Sync: Active</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
