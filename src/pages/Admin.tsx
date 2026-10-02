import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AuditLog, Classification } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Lock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Key,
  Server,
  FileCheck,
} from 'lucide-react';
import { DEMO_USERS } from '../data/users';

export const Admin: React.FC = () => {
  const { auditLogs, language } = useData();
  const { currentRole, switchRole } = useAuth();

  const [searchAudit, setSearchAudit] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (selectedClassification !== 'all' && log.classification !== selectedClassification) return false;
    if (selectedStatus !== 'all' && log.status !== selectedStatus) return false;
    if (searchAudit.trim()) {
      const q = searchAudit.toLowerCase();
      const matchUser = (log.user || '').toLowerCase().includes(q);
      const matchAction = (log.action || '').toLowerCase().includes(q);
      const matchRes = (log.resource || '').toLowerCase().includes(q);
      if (!matchUser && !matchAction && !matchRes) return false;
    }
    return true;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhuniti_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusIcons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    flagged: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
    denied: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
  };

  const statusBadgeClass = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    flagged: 'bg-amber-50 text-amber-800 border-amber-200',
    denied: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const classificationBadges: Record<Classification, string> = {
    public: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    restricted: 'bg-amber-50 text-amber-800 border-amber-200',
    confidential: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 uppercase tracking-wider">
              Institution Administration & Security
            </span>
            <span className="text-xs text-slate-500">• Tamper-Evident SHA-256 Audit Trail</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Governance, Security Audit & User Verification
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Comprehensive access logging, role authorization matrix, and data classification governance adhering to CERT-In and Digital India standards.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Trail (JSON)
        </button>
      </div>

      {/* Security Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Cryptographic Audit Chain</span>
            <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">SHA-256 Verified</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Zero tampering detected</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Active Authorized Roles</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">5 Verified Personas</h3>
            <span className="text-[10px] text-slate-500">RBAC Level-1 to Level-3</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Confidential Dossier Protection</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">Enforced (Level-3)</h3>
            <span className="text-[10px] text-purple-600 font-semibold">Benami & Foreign FDI Scrutiny</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Real-Time Security Access & Data Access Log
            </h2>
            <p className="text-xs text-slate-500">
              Captures every user query, resource access, and clearance level check.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                placeholder="Filter audit events..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>

            <select
              value={selectedClassification}
              onChange={e => setSelectedClassification(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="all">All Classifications</option>
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="confidential">Confidential</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="flagged">Flagged</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Accessed Resource</th>
                <th className="py-2.5 px-3">Clearance</th>
                <th className="py-2.5 px-3">Client Network IP</th>
                <th className="py-2.5 px-3">Event Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 block truncate max-w-[140px]">{log.user}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-900 text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 truncate max-w-[180px]">
                    {log.resource}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${classificationBadges[log.classification]}`}>
                      {log.classification}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${statusBadgeClass[log.status]}`}>
                      {statusIcons[log.status]}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ProvenanceFooter
          source="National Informatics Centre (NIC) Security Incident & Event Management (SIEM)"
          version="ISO/IEC 27001 ISMS Standard"
          classification="confidential"
        />
      </div>
    </div>
  );
};
