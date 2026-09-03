import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Key,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  LogOut,
  ArrowLeft,
  Layers,
  Filter,
  Eye,
  X,
  Sparkles,
  ToggleRight,
  ShieldCheck,
  ChevronRight,
  Menu,
  ExternalLink,
  FileText,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/symposiumData';
import {
  subscribeRegistrations,
  subscribeEventStatuses,
  updateEventStatus,
  verifyRegistration,
  rejectRegistration,
} from '../lib/firebase';
import type { RegistrationData } from '../lib/firebase';
import cisabzLogo from '../assets/cisabz-logo.png';

interface AdminPortalProps {
  onBackToWebsite: () => void;
  initialSubPath?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cisabz_admin_authed') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sidebar Mobile Toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active View Tab: 'dashboard' | 'participants' | 'pending' | 'event-specific' | 'settings'
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string>('TECHVERSE');

  // Realtime Data from Firebase
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [eventStatuses, setEventStatuses] = useState<Record<string, boolean>>({});

  // Search & Combinable Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollege, setFilterCollege] = useState('ALL');
  const [filterTechEvent, setFilterTechEvent] = useState('ALL');
  const [filterNonTechEvent, setFilterNonTechEvent] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterFood, setFilterFood] = useState('ALL');

  // Verification Detail Modal State
  const [selectedParticipant, setSelectedParticipant] = useState<RegistrationData | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => setActionToast(null), 5000);
  };

  // Subscribe to Realtime Firebase Updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubRegs = subscribeRegistrations((data) => {
      setRegistrations(data);
    });

    const unsubEvents = subscribeEventStatuses((statuses) => {
      setEventStatuses(statuses);
    });

    return () => {
      unsubRegs();
      unsubEvents();
    };
  }, [isAuthenticated]);

  // Handle browser back button when viewing participant details modal
  useEffect(() => {
    if (selectedParticipant) {
      window.history.pushState({ adminModalOpen: true }, '', window.location.href);

      const handlePopState = () => {
        setSelectedParticipant(null);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [selectedParticipant]);

  // Admin Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Secure Admin credentials check (admin / cisabz2026 or environment credentials)
    const adminUser = import.meta.env.VITE_ADMIN_USER || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASS || 'cisabz2026';

    if (username.trim() === adminUser && password.trim() === adminPass) {
      setIsAuthenticated(true);
      localStorage.setItem('cisabz_admin_authed', 'true');
    } else {
      setAuthError('Invalid admin credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cisabz_admin_authed');
  };

  // Extract unique colleges for filter dropdown
  const uniqueColleges = Array.from(
    new Set(registrations.map((r) => r.collegeName).filter(Boolean))
  );

  // Filter Logic
  const getFilteredRegistrations = () => {
    return registrations.filter((r) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobile.toLowerCase().includes(q) ||
        r.collegeName.toLowerCase().includes(q) ||
        r.transactionId.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);

      // 2. Filters
      const matchesCollege = filterCollege === 'ALL' || r.collegeName === filterCollege;
      const matchesTech = filterTechEvent === 'ALL' || r.technicalEvent === filterTechEvent;
      const matchesNonTech = filterNonTechEvent === 'ALL' || r.nonTechnicalEvent === filterNonTechEvent;
      const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
      const matchesYear = filterYear === 'ALL' || r.year === filterYear;
      const matchesFood = filterFood === 'ALL' || r.foodPreference === filterFood;

      // 3. View-specific constraints
      let matchesView = true;
      if (activeView === 'participants') {
        // "All Participants" tab shows ONLY Active (VERIFIED & PENDING), EXCLUDING REJECTED!
        matchesView = r.status !== 'REJECTED';
      } else if (activeView === 'pending') {
        matchesView = r.status === 'PENDING';
      } else if (activeView === 'rejected') {
        // "Rejected Participants" tab shows ONLY REJECTED!
        matchesView = r.status === 'REJECTED';
      } else if (activeView === 'event-specific') {
        // Event-specific view shows ONLY active participants for that event (excluding REJECTED!)
        const target = selectedEventId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const tech = (r.technicalEvent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const nonTech = (r.nonTechnicalEvent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        matchesView = r.status !== 'REJECTED' && (tech === target || nonTech === target);
      }

      return (
        matchesSearch &&
        matchesCollege &&
        matchesTech &&
        matchesNonTech &&
        matchesStatus &&
        matchesYear &&
        matchesFood &&
        matchesView
      );
    });
  };

  const filteredData = getFilteredRegistrations();

  // Excel Export Handler (.xlsx)
  const exportToExcel = (exportFilteredOnly = false) => {
    const listToExport = exportFilteredOnly ? filteredData : registrations;

    const exportRows = listToExport.map((r) => ({
      'Registration ID': r.id,
      'Full Name': r.fullName,
      'College / Institution': r.collegeName,
      Department: r.department,
      Year: r.year,
      Email: r.email,
      'Mobile Number': r.mobile,
      'Ambassador Referral ID': r.ambassadorReferralId || 'N/A',
      'Food Preference': r.foodPreference,
      'Technical Event': r.technicalEvent,
      'Non-Technical Event': r.nonTechnicalEvent,
      'Transaction ID / UTR': r.transactionId,
      'Payment Name': r.paymentName,
      Status: r.status,
      'Registration Date': new Date(r.createdAt).toLocaleString(),
      'Verification Date': r.verifiedAt ? new Date(r.verifiedAt).toLocaleString() : 'N/A',
      'Rejection Reason': r.rejectionReason || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const fileName = exportFilteredOnly
      ? `CISABZ_Registrations_Filtered_${Date.now()}.xlsx`
      : `CISABZ_Registrations_All_${Date.now()}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // PDF Export Handler (.pdf) with Official Header, Logos, Event Venue & Attendance Signature Column
  const exportToPDF = (exportFilteredOnly = false) => {
    const listToExport = exportFilteredOnly ? filteredData : registrations.filter((r) => r.status !== 'REJECTED');

    let documentTitle = 'ALL ACTIVE PARTICIPANTS LIST';
    let eventVenue = 'Main Auditorium & CSE Labs';

    if (activeView === 'pending') {
      documentTitle = 'PENDING VERIFICATION REGISTRATIONS';
    } else if (activeView === 'rejected') {
      documentTitle = 'REJECTED PARTICIPANTS LIST';
    } else if (activeView === 'event-specific') {
      documentTitle = `EVENT PARTICIPANT SHEET — ${selectedEventId}`;
      const allEvts = [...TECHNICAL_EVENTS, ...NON_TECHNICAL_EVENTS];
      const match = allEvts.find(
        (e) => e.name.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedEventId.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      if (match) {
        eventVenue = match.venue || 'CSE Department Labs';
      }
    }

    const printWin = window.open('', '_blank');
    if (!printWin) {
      showToast('Pop-up blocked. Please allow pop-ups to export PDF.', 'error');
      return;
    }

    const tableRowsHtml = listToExport
      .map(
        (r, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong>${r.id}</strong></td>
          <td><strong>${r.fullName}</strong></td>
          <td>${r.collegeName}<br><small style="color: #64748b;">${r.department}</small></td>
          <td style="text-align: center;">${r.year}</td>
          <td>${r.mobile}</td>
          <td><small>${r.email}</small></td>
          <td><span style="color: #0284c7; font-weight: bold;">${r.technicalEvent}</span></td>
          <td><span style="color: #d97706; font-weight: bold;">${r.nonTechnicalEvent}</span></td>
          <td style="width: 90px; border-bottom: 1px solid #94a3b8;"></td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle} - CISABZ 2K26</title>
          <style>
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 15px;
              color: #0f172a;
              background: #fff;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              border-bottom: 2px solid #0284c7;
              padding-bottom: 8px;
            }
            .header-title {
              text-align: center;
            }
            .header-title h2 {
              margin: 0;
              font-size: 18px;
              color: #1e3a8a;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .header-title h3 {
              margin: 3px 0;
              font-size: 13px;
              color: #0284c7;
            }
            .header-title p {
              margin: 0;
              font-size: 10px;
              color: #64748b;
            }
            .doc-info-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f1f5f9;
              padding: 8px 12px;
              border-radius: 6px;
              margin-bottom: 12px;
              border: 1px solid #cbd5e1;
              font-size: 11px;
            }
            .doc-info-bar strong {
              color: #0f172a;
            }
            table.data-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            table.data-table th {
              background-color: #0f172a;
              color: #ffffff;
              padding: 6px 8px;
              border: 1px solid #334155;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 0.5px;
            }
            table.data-table td {
              padding: 6px 8px;
              border: 1px solid #cbd5e1;
              vertical-align: middle;
            }
            table.data-table tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .footer-sig {
              margin-top: 35px;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              font-weight: bold;
              color: #334155;
            }
            .sig-box {
              text-align: center;
              width: 200px;
              border-top: 1px solid #64748b;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td style="width: 10%;">
                <img src="/assets/cisabz-logo.png" alt="Logo" style="height: 55px; object-fit: contain;" onError="this.style.display='none'" />
              </td>
              <td class="header-title">
                <h2>KINGS COLLEGE OF ENGINEERING</h2>
                <h3>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</h3>
                <p>CISABZ-2K26 — National Level Technical Symposium | Date: 25-09-2026</p>
              </td>
              <td style="width: 10%; text-align: right;">
                <img src="/assets/cisabz-logo.png" alt="CISABZ" style="height: 55px; object-fit: contain;" onError="this.style.display='none'" />
              </td>
            </tr>
          </table>

          <div class="doc-info-bar">
            <div><strong>CATEGORY / SHEET:</strong> ${documentTitle}</div>
            <div><strong>VENUE:</strong> ${eventVenue}</div>
            <div><strong>TOTAL PARTICIPANTS:</strong> ${listToExport.length}</div>
            <div><strong>PRINTED AT:</strong> ${new Date().toLocaleString()}</div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Reg ID</th>
                <th>Participant Name</th>
                <th>College & Department</th>
                <th>Year</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Tech Event</th>
                <th>Non-Tech Event</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml || '<tr><td colspan="10" style="text-align:center;">No participant records found</td></tr>'}
            </tbody>
          </table>

          <div class="footer-sig">
            <div class="sig-box">Staff Coordinator Signature</div>
            <div class="sig-box">Student Coordinator Signature</div>
            <div class="sig-box">HOD / Convener Signature</div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  // Payment Verification Handler — Slot Confirmation
  const handleVerifyPayment = async (regId: string) => {
    setIsProcessingAction(true);
    try {
      await verifyRegistration(regId, 'Admin');
      if (selectedParticipant && selectedParticipant.id === regId) {
        setSelectedParticipant((prev) => (prev ? { ...prev, status: 'VERIFIED' } : null));
        showToast(`✓ Registration ${regId} VERIFIED!`, 'success');
      }
    } catch (e) {
      console.error('Failed to verify:', e);
      showToast('Failed to verify payment. Firestore update failed.', 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Payment Rejection Handler — Slot Rejection
  const handleRejectPayment = async (regId: string) => {
    setIsProcessingAction(true);
    try {
      const reason = rejectionReasonInput.trim() || "We didn't get your payment.";
      await rejectRegistration(regId, 'Admin', reason);
      if (selectedParticipant && selectedParticipant.id === regId) {
        setSelectedParticipant((prev) => (prev ? { ...prev, status: 'REJECTED', rejectionReason: reason } : null));
        showToast(`✕ Registration ${regId} REJECTED. Rejection email sent to ${selectedParticipant.email}.`, 'error');
      }
      setShowRejectForm(false);
      setRejectionReasonInput('');
    } catch (e) {
      console.error('Failed to reject:', e);
      showToast('Failed to reject registration. Firestore update failed.', 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Overall Statistics (Total Registrations = Active Valid Registrations, excluding REJECTED)
  const totalStats = {
    total: registrations.filter((r) => r.status !== 'REJECTED').length,
    pending: registrations.filter((r) => r.status === 'PENDING').length,
    verified: registrations.filter((r) => r.status === 'VERIFIED').length,
    rejected: registrations.filter((r) => r.status === 'REJECTED').length,
  };

  // Event-wise Counts (case-insensitive, normalized, excluding REJECTED)
  const getEventCount = (eventNameOrId: string) => {
    if (!eventNameOrId) return 0;
    const target = eventNameOrId.toLowerCase().replace(/[^a-z0-9]/g, '');
    return registrations.filter((r) => {
      if (r.status === 'REJECTED') return false;
      const tech = (r.technicalEvent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const nonTech = (r.nonTechnicalEvent || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return tech === target || nonTech === target;
    }).length;
  };

  // LOGIN SCREEN (IF NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 px-4 bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black font-orbitron text-white tracking-tight">
              ADMIN PORTAL
            </h2>
            <p className="text-xs font-mono text-cyan-400 mt-1">
              Authorized Event Management Access Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-mono"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-bold">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 text-white placeholder-slate-600 focus:outline-none transition-colors text-sm font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer mt-4"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToWebsite}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CISABZ'26 Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ALL ADMIN PAGES LIST
  const adminEvents = [
    { id: 'TECHVERSE', name: 'TECHVERSE', category: 'technical' },
    { id: 'TECH BRAINIAC', name: 'TECH BRAINIAC', category: 'technical' },
    { id: 'PROMPT FUSION', name: 'PROMPT FUSION', category: 'technical' },
    { id: 'BUG BASH', name: 'BUG BASH', category: 'technical' },
    { id: 'PINPOINT', name: 'PINPOINT', category: 'non-technical' },
    { id: 'BRAND SPOT', name: 'BRAND SPOT', category: 'non-technical' },
    { id: 'HAMMER HIT', name: 'HAMMER HIT', category: 'non-technical' },
    { id: 'CONNECTION', name: 'CONNECTION', category: 'non-technical' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* MOBILE ADMIN HEADER */}
      <div className="md:hidden p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <img src={cisabzLogo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-orbitron font-bold text-white text-sm">ADMIN PANEL</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-900 text-slate-200 border border-slate-800"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ADMIN SIDEBAR */}
      <aside
        className={`w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col shrink-0 transition-all ${
          mobileSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-white text-sm tracking-wider">
              ADMIN PANEL
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
              CISABZ-2K26
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveView('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] text-amber-400 border border-slate-800">
              {totalStats.total}
            </span>
          </button>

          <div className="pt-3 pb-1">
            <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Participants
            </span>

            <button
              onClick={() => {
                setActiveView('participants');
                setMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeView === 'participants'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>All Participants</span>
              <span className="text-[10px] text-slate-400">{totalStats.total}</span>
            </button>

            <button
              onClick={() => {
                setActiveView('pending');
                setMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeView === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Pending Verification</span>
              {totalStats.pending > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                  {totalStats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveView('rejected');
                setMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeView === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span>Rejected Participants</span>
              {totalStats.rejected > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-slate-950 text-[10px] font-black">
                  {totalStats.rejected}
                </span>
              )}
            </button>
          </div>

          <div className="pt-3 pb-1">
            <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Events Pages
            </span>

            {adminEvents.map((evt) => {
              const isSelected = activeView === 'event-specific' && selectedEventId === evt.id;
              const count = getEventCount(evt.id);
              return (
                <button
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    setActiveView('event-specific');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">{evt.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setActiveView('settings');
                setMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                activeView === 'settings'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ToggleRight className="w-4 h-4" />
              <span>Event Settings</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Website Home</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-900/40 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
        {/* Toast Notification Banner */}
        {actionToast && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border text-xs font-mono font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
              actionToast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/80 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-rose-500/80 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
            }`}
          >
            {actionToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionToast.message}</span>
          </div>
        )}

        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-amber-500/30 p-6 rounded-3xl backdrop-blur-xl">
              <div>
                <h1 className="text-2xl font-black font-orbitron text-white">
                  Live Registration Dashboard
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Realtime sync active • Subscribed to Firebase Firestore
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => exportToExcel(false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel (.xlsx)</span>
                </button>

                <button
                  onClick={() => exportToPDF(false)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF (.pdf)</span>
                </button>
              </div>
            </div>

            {/* LIVE OVERALL STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
                  Total Registrations
                </span>
                <span className="text-3xl sm:text-4xl font-black font-orbitron text-white">
                  {totalStats.total}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-amber-500/40 p-5 rounded-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                  Pending Verification
                </span>
                <span className="text-3xl sm:text-4xl font-black font-orbitron text-amber-400">
                  {totalStats.pending}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  Verified
                </span>
                <span className="text-3xl sm:text-4xl font-black font-orbitron text-emerald-400">
                  {totalStats.verified}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-rose-500/40 p-5 rounded-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold block mb-1">
                  Rejected
                </span>
                <span className="text-3xl sm:text-4xl font-black font-orbitron text-rose-400">
                  {totalStats.rejected}
                </span>
              </div>
            </div>

            {/* EVENT-WISE PARTICIPANT COUNTS */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold font-orbitron text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Event-Wise Participant Counts</span>
              </h2>

              {/* Technical Events */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-3">
                  Technical Events
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TECHNICAL_EVENTS.map((evt) => {
                    const count = getEventCount(evt.name);
                    const isOpen = eventStatuses[evt.name] !== false;
                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          setSelectedEventId(evt.name);
                          setActiveView('event-specific');
                        }}
                        className="bg-slate-900/80 hover:bg-slate-800/90 border border-blue-500/30 p-5 rounded-2xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {evt.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isOpen
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isOpen ? 'OPEN' : 'CLOSED'}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-3">
                          <span className="text-2xl font-black font-orbitron text-cyan-300">
                            {count}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 group-hover:text-white flex items-center gap-1">
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Non-Technical Events */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block mb-3">
                  Non-Technical Events
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {NON_TECHNICAL_EVENTS.map((evt) => {
                    const count = getEventCount(evt.name);
                    const isOpen = eventStatuses[evt.name] !== false;
                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          setSelectedEventId(evt.name);
                          setActiveView('event-specific');
                        }}
                        className="bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/30 p-5 rounded-2xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-orbitron font-bold text-white group-hover:text-amber-400 transition-colors">
                            {evt.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isOpen
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isOpen ? 'OPEN' : 'CLOSED'}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-3">
                          <span className="text-2xl font-black font-orbitron text-amber-300">
                            {count}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 group-hover:text-white flex items-center gap-1">
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2 & 3: ALL PARTICIPANTS / PENDING VERIFICATION / REJECTED / EVENT-SPECIFIC */}
        {(activeView === 'participants' ||
          activeView === 'pending' ||
          activeView === 'rejected' ||
          activeView === 'event-specific') && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
              <div>
                <h1 className="text-2xl font-black font-orbitron text-white">
                  {activeView === 'pending'
                    ? 'Pending Verification'
                    : activeView === 'rejected'
                    ? 'Rejected Participants'
                    : activeView === 'event-specific'
                    ? `Event Participants — ${selectedEventId}`
                    : 'All Active Participants'}
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Showing {filteredData.length} registrations
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => exportToExcel(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel (.xlsx)</span>
                </button>

                <button
                  onClick={() => exportToPDF(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF (.pdf)</span>
                </button>
              </div>
            </div>

            {/* SEARCH AND COMBINABLE FILTER CONTROLS — ONLY VISIBLE IN "ALL PARTICIPANTS" VIEW */}
            {activeView === 'participants' && (
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Search input */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by Name, Email, Mobile, College, Transaction ID..."
                      className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-500 text-xs font-mono focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Combinable Filter Selects */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
                  {/* College Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      College
                    </label>
                    <select
                      value={filterCollege}
                      onChange={(e) => setFilterCollege(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Colleges</option>
                      {uniqueColleges.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tech Event Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Tech Event
                    </label>
                    <select
                      value={filterTechEvent}
                      onChange={(e) => setFilterTechEvent(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Tech</option>
                      <option value="TECHVERSE">TECHVERSE</option>
                      <option value="TECH BRAINIAC">TECH BRAINIAC</option>
                      <option value="PROMPT FUSION">PROMPT FUSION</option>
                      <option value="BUG BASH">BUG BASH</option>
                    </select>
                  </div>

                  {/* Non-Tech Event Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Non-Tech Event
                    </label>
                    <select
                      value={filterNonTechEvent}
                      onChange={(e) => setFilterNonTechEvent(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Non-Tech</option>
                      <option value="PINPOINT">PINPOINT</option>
                      <option value="BRAND SPOT">BRAND SPOT</option>
                      <option value="HAMMER HIT">HAMMER HIT</option>
                      <option value="CONNECTION">CONNECTION</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">PENDING</option>
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Year
                    </label>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Years</option>
                      <option value="I Year">I Year</option>
                      <option value="II Year">II Year</option>
                      <option value="III Year">III Year</option>
                      <option value="IV Year">IV Year</option>
                    </select>
                  </div>

                  {/* Food Filter */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                      Food
                    </label>
                    <select
                      value={filterFood}
                      onChange={(e) => setFilterFood(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Food</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PARTICIPANTS TABLE VIEW */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {filteredData.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2 font-mono text-xs">
                  <Filter className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-white">No participants found</p>
                  <p>Try adjusting your search query or filter parameters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-4 px-4">Participant</th>
                        <th className="py-4 px-4">College & Dept</th>
                        <th className="py-4 px-4">Contact</th>
                        <th className="py-4 px-4">Tech Event</th>
                        <th className="py-4 px-4">Non-Tech Event</th>
                        <th className="py-4 px-4">Transaction ID</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/60">
                      {filteredData.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Name & ID */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-white text-sm font-rajdhani">
                              {reg.fullName}
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono font-bold block">
                              {reg.id}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {reg.year} • {reg.foodPreference}
                            </span>
                          </td>

                          {/* College & Dept */}
                          <td className="py-4 px-4 max-w-[180px]">
                            <div className="truncate font-medium text-slate-200" title={reg.collegeName}>
                              {reg.collegeName}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate" title={reg.department}>
                              {reg.department}
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-4 px-4">
                            <div className="text-cyan-300 font-bold">{reg.mobile}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {reg.email}
                            </div>
                          </td>

                          {/* Tech Event */}
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">
                              {reg.technicalEvent}
                            </span>
                          </td>

                          {/* Non-Tech Event */}
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              {reg.nonTechnicalEvent}
                            </span>
                          </td>

                          {/* Transaction ID */}
                          <td className="py-4 px-4">
                            <span className="text-slate-200 font-bold font-mono">
                              {reg.transactionId}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Name: {reg.paymentName}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                reg.status === 'VERIFIED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : reg.status === 'REJECTED'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedParticipant(reg);
                                setShowRejectForm(false);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white border border-slate-700 text-xs font-mono font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View & Verify</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: EVENT SETTINGS (OPEN / CLOSE REGISTRATIONS) */}
        {activeView === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
              <h1 className="text-2xl font-black font-orbitron text-white mb-2">
                Event Registration Control
              </h1>
              <p className="text-xs font-mono text-slate-400">
                Manually open or close registration for individual events in real time. Changes take effect on the participant registration page immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminEvents.map((evt) => {
                const isOpen = eventStatuses[evt.id] !== false;
                const count = getEventCount(evt.id);

                return (
                  <div
                    key={evt.id}
                    className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                        {evt.category} Event
                      </span>
                      <h3 className="text-lg font-bold font-orbitron text-white">
                        {evt.name}
                      </h3>
                      <span className="text-xs font-mono text-cyan-400 mt-1 block">
                        Registered Participants: {count}
                      </span>
                    </div>

                    <button
                      onClick={() => updateEventStatus(evt.id, !isOpen)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isOpen
                          ? 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Close Registration</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Open Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* VERIFICATION DETAIL MODAL */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.25)] space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Top Navigation & Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Admin List</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                  REG ID: {selectedParticipant.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedParticipant.createdAt ? new Date(selectedParticipant.createdAt).toLocaleString() : ''}
                </span>
              </div>

              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Participant Name Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">Participant Full Name</span>
                <h3 className="text-xl sm:text-2xl font-black font-orbitron text-white">
                  {selectedParticipant.fullName}
                </h3>
              </div>
              <div className="shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  selectedParticipant.status === 'VERIFIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : selectedParticipant.status === 'REJECTED'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {selectedParticipant.status}
                </span>
              </div>
            </div>

            {/* Complete Participant Details Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Registration Details Submitted By Participant</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div><span className="text-slate-500 block">Full Name:</span> <strong className="text-cyan-300 font-bold text-sm">{selectedParticipant.fullName}</strong></div>
                <div><span className="text-slate-500 block">Registration ID:</span> <strong className="text-amber-400 font-bold">{selectedParticipant.id}</strong></div>
                <div><span className="text-slate-500 block">College / Institution:</span> <strong className="text-white">{selectedParticipant.collegeName}</strong></div>
                <div><span className="text-slate-500 block">Department / Branch:</span> <strong className="text-white">{selectedParticipant.department}</strong></div>
                <div><span className="text-slate-500 block">Year of Study:</span> <strong className="text-white">{selectedParticipant.year}</strong></div>
                <div><span className="text-slate-500 block">Food Preference:</span> <strong className="text-emerald-400">{selectedParticipant.foodPreference}</strong></div>
                <div><span className="text-slate-500 block">Email Address:</span> <strong className="text-cyan-300">{selectedParticipant.email}</strong></div>
                <div><span className="text-slate-500 block">Mobile Number:</span> <strong className="text-cyan-300">{selectedParticipant.mobile}</strong></div>
                <div><span className="text-slate-500 block">Technical Event:</span> <strong className="text-blue-400 font-bold">{selectedParticipant.technicalEvent}</strong></div>
                <div><span className="text-slate-500 block">Non-Technical Event:</span> <strong className="text-amber-400 font-bold">{selectedParticipant.nonTechnicalEvent}</strong></div>
                {selectedParticipant.ambassadorReferralId && (
                  <div className="col-span-2"><span className="text-slate-500 block">Campus Ambassador Code:</span> <strong className="text-purple-300">{selectedParticipant.ambassadorReferralId}</strong></div>
                )}
                {selectedParticipant.rejectionReason && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
                    <span className="text-rose-400 block font-bold text-[10px]">Rejection Reason:</span>
                    {selectedParticipant.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info & Proof View */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold font-orbitron text-white">Payment Details</h4>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Transaction ID / UTR:</span> <strong className="text-amber-400 text-sm">{selectedParticipant.transactionId}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Payment Name:</span> <strong className="text-white">{selectedParticipant.paymentName}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Current Status:</span> <strong className="text-cyan-300">{selectedParticipant.status}</strong></div>
              </div>

              {/* Proof Image / File Link */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-xs font-mono text-slate-400 block mb-3">Uploaded Payment Screenshot / Proof</span>
                {selectedParticipant.paymentProofUrl ? (
                  <div className="space-y-3">
                    <img
                      src={selectedParticipant.paymentProofUrl}
                      alt="Uploaded Payment Proof"
                      className="max-h-60 mx-auto rounded-xl object-contain border border-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <a
                      href={selectedParticipant.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Proof Image in New Window</span>
                    </a>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-rose-400">No proof image available</span>
                )}
              </div>
            </div>

            {/* Rejection Form Input */}
            {showRejectForm && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
                <label className="block text-xs font-mono uppercase text-rose-300 font-bold">
                  Reason for Rejection (Optional)
                </label>
                <input
                  type="text"
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Transaction ID not found or amount incorrect"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-white text-xs font-mono focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedParticipant.id)}
                    disabled={isProcessingAction}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

            {/* Modal Action Buttons */}
            {!showRejectForm && (
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessingAction || selectedParticipant.status === 'REJECTED'}
                  className="px-5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>✕ Reject Registration</span>
                </button>

                <button
                  onClick={() => handleVerifyPayment(selectedParticipant.id)}
                  disabled={isProcessingAction || selectedParticipant.status === 'VERIFIED'}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Verify Payment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
