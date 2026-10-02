import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { DEMO_USERS } from '../data/users';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Building2,
  Briefcase,
  User,
  Shield,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { currentRole, loginAs } = useAuth();
  const { language } = useData();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    loginAs(role);
    navigate('/dashboard');
  };

  const roleDetails: Record<
    UserRole,
    {
      title: string;
      icon: React.ComponentType<{ className?: string }>;
      badgeColor: string;
      allowed: string[];
      restricted: string[];
      description: string;
    }
  > = {
    official: {
      title: 'Government Official',
      icon: Building2,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Department of Land Resources (DoLR), State Revenue Secretaries & District Collectors.',
      allowed: ['National Dashboards (All 7 Panels)', 'Cadastral GIS Explorer & Parcel Maps', 'Policy Simulation Levers & Projections', 'Confidential Intelligence Dossiers', 'Policy Evidence Brief Generator'],
      restricted: ['System Administration & Database Configuration'],
    },
    researcher: {
      title: 'Lead Policy Researcher',
      icon: BookOpen,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'IITs, IIMs, NITI Aayog Fellows, Land Policy Think Tanks & Academic Economists.',
      allowed: ['AI Research Lab (Synthesis & Forecasting)', 'Full Knowledge Repository (50+ Papers)', 'Collaborative Workspaces & Tasks', 'Upload New Research Studies', 'Export GIS & Statistical Datasets'],
      restricted: ['Confidential Inter-Ministerial Dossiers', 'Admin Console'],
    },
    admin: {
      title: 'Institution Administrator',
      icon: Shield,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'National Informatics Centre (NIC) Land Informatics Division & Platform Custodians.',
      allowed: ['Complete System Clearance (All 13 Modules)', 'Full Tamper-Evident Audit Logs', 'Data Source Sync & Endpoint Management', 'Classification Controls & User Verification'],
      restricted: [],
    },
    industry: {
      title: 'Industry Expert & PropTech',
      icon: Briefcase,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'CII Geospatial Council, Drone Survey Consortia, PropTech Standards & Urban Planners.',
      allowed: ['Innovation Portal (Hackathons, Grants, Pilots)', 'Commercial & Peri-Urban Analytics', 'Collaborative Workspaces', 'Developer API Console & Try-It Sandbox'],
      restricted: ['Restricted Security Audits & Confidential Government Records', 'Policy Simulation Internal Levers'],
    },
    public: {
      title: 'Public User & Farmer Co-op',
      icon: User,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Citizens, Farmer Cooperatives, Rural Landholders & Agronomists.',
      allowed: ['Public Knowledge Repository', 'National Overview Dashboards', 'Public GIS Maps & Bhu-Aadhaar Parcel Lookup', 'Apply to Open Innovation Challenges'],
      restricted: ['Restricted & Confidential Government Dossiers', 'AI Research Lab', 'Policy Simulation Engine', 'Admin Console'],
    },
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-3 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          Role-Based Access Control (RBAC) System
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'hi' ? 'भूमिका चयन एवं प्रमाणीकरण' : 'Select Demonstration Role'}
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          {language === 'hi'
            ? 'अपनी इच्छित भूमिका चुनें। प्रत्येक भूमिका को विशिष्ट अनुमतियां और डेटा वर्गीकरण एक्सेस प्राप्त है।'
            : 'Click any persona below to switch roles instantaneously. Experience tailored dashboards, security clearance, and module access.'}
        </p>
      </div>

      {/* 5 Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(Object.keys(roleDetails) as UserRole[]).map(roleKey => {
          const info = roleDetails[roleKey];
          const user = DEMO_USERS[roleKey] || DEMO_USERS.public;
          if (!info || !user) return null;
          const isSelected = currentRole === roleKey;
          const Icon = info.icon;

          return (
            <div
              key={roleKey}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-xs uppercase tracking-wider">
                  Currently Active
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.designation}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${info.badgeColor}`}>
                    {roleKey}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{info.description}</p>

                {/* Allowed capabilities */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Privileges</p>
                  {info.allowed.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                  {info.restricted.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-through">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRoleSelect(roleKey)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <span>{isSelected ? 'Continue to App' : `Login as ${info.title}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Summary */}
      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">Platform Access & Data Classification Matrix</h3>
        <p className="text-xs text-slate-500 mb-4">
          Strict separation of concerns ensures that sensitive land dossiers and policy simulations are only exposed to authorized government officials and admins.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">User Role</th>
                <th className="py-2.5 px-3 font-semibold">Clearance Level</th>
                <th className="py-2.5 px-3 font-semibold">AI Lab & Simulation</th>
                <th className="py-2.5 px-3 font-semibold">Land Records (Cadastre)</th>
                <th className="py-2.5 px-3 font-semibold">Admin & Audit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-bold text-purple-900">Institution Admin</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]">Confidential / Level-3</span></td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Unmasked + Geometry Edit</td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Full Control</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-900">Government Official</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]">Confidential / Level-3</span></td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Full Access</td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">Complete Cadastral Access</td>
                <td className="py-2.5 px-3 text-slate-400">Read-Only Logs</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-blue-900">Lead Researcher</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px]">Restricted / Level-2</span></td>
                <td className="py-2.5 px-3 text-emerald-600 font-semibold">AI Lab Access</td>
                <td className="py-2.5 px-3 text-slate-600">Masked PII</td>
                <td className="py-2.5 px-3 text-slate-400">No Access</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-900">Industry Expert</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">Public / Level-1</span></td>
                <td className="py-2.5 px-3 text-slate-400">Read Analytics Only</td>
                <td className="py-2.5 px-3 text-slate-600">Masked PII</td>
                <td className="py-2.5 px-3 text-slate-400">No Access</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-700">Public User</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">Public / Level-1</span></td>
                <td className="py-2.5 px-3 text-slate-400">No Access</td>
                <td className="py-2.5 px-3 text-slate-600">Single Parcel ULPIN Search</td>
                <td className="py-2.5 px-3 text-slate-400">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
