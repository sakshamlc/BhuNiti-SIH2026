import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Users2,
  MapPin,
  FileSpreadsheet,
  LineChart,
  Cpu,
  FlaskConical,
  Lightbulb,
  Layers,
  Code2,
  ShieldAlert,
  ChevronRight,
  Lock,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { canAccess, currentRole } = useAuth();
  const { language } = useData();

  const NAV_ITEMS = [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: language === 'hi' ? 'डैशबोर्ड (7 पैनल)' : 'National Dashboards',
      icon: LayoutDashboard,
      badge: '7 Panels',
    },
    {
      id: 'repository',
      path: '/repository',
      label: language === 'hi' ? 'केंद्रीय भंडार' : 'Central Repository',
      icon: FolderKanban,
      badge: '50 Docs',
    },
    {
      id: 'search',
      path: '/search',
      label: language === 'hi' ? 'एआई सिमेंटिक खोज' : 'AI Semantic Search',
      icon: Sparkles,
      badge: 'Gemini',
    },
    {
      id: 'gis',
      path: '/gis',
      label: language === 'hi' ? 'जीआईएस भू-स्थानिक' : 'GIS Geospatial Explorer',
      icon: MapPin,
      badge: '6 Layers',
    },
    {
      id: 'records',
      path: '/records',
      label: language === 'hi' ? 'भू-अभिलेख व पार्सल' : 'Land Records (Cadastral)',
      icon: FileSpreadsheet,
      badge: 'Bhu-Aadhaar',
    },
    {
      id: 'analytics',
      path: '/analytics',
      label: language === 'hi' ? 'विश्लेषिकी व विवाद' : 'Analytics & Disputes',
      icon: LineChart,
      badge: 'Evidence',
    },
    {
      id: 'simulation',
      path: '/simulation',
      label: language === 'hi' ? 'नीति सिमुलेशन' : 'Policy Simulation Engine',
      icon: Cpu,
      badge: 'Interactive',
    },
    {
      id: 'ailab',
      path: '/ai-lab',
      label: language === 'hi' ? 'एआई अनुसंधान लैब' : 'AI Research Lab',
      icon: FlaskConical,
      badge: 'Brief Gen',
    },
    {
      id: 'workspaces',
      path: '/workspaces',
      label: language === 'hi' ? 'सहयोगी कार्यस्थान' : 'Collaborative Workspaces',
      icon: Users2,
      badge: '4 Active',
    },
    {
      id: 'innovation',
      path: '/innovation',
      label: language === 'hi' ? 'नवाचार व हैकाथॉन' : 'Innovation Portal',
      icon: Lightbulb,
      badge: '12 Calls',
    },
    {
      id: 'integration',
      path: '/integration',
      label: language === 'hi' ? 'डेटा एकीकरण (DoLR)' : 'Data Integration Hub',
      icon: Layers,
      badge: '10 APIs',
    },
    {
      id: 'apidocs',
      path: '/api-docs',
      label: language === 'hi' ? 'एपीआई कंसोल' : 'API Console & Docs',
      icon: Code2,
      badge: 'Try-It',
    },
    {
      id: 'admin',
      path: '/admin',
      label: language === 'hi' ? 'प्रशासन व ऑडिट लॉग' : 'Admin & Audit Logs',
      icon: ShieldAlert,
      badge: 'Secured',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col min-h-[calc(100vh-5rem)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
          <span>{language === 'hi' ? 'मुख्य मॉड्यूल' : 'Core Modules'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">PS 26019</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Role Access: <span className="capitalize text-emerald-400 font-semibold">{currentRole}</span>
        </p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const accessible = canAccess(item.id);
          const Icon = item.icon;

          if (!accessible) {
            return (
              <div
                key={item.id}
                className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-400 cursor-not-allowed opacity-60"
                title={`Requires Official or Admin clearance`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-slate-600" />
                  <span className="truncate">{item.label}</span>
                </div>
                <Lock className="w-3 h-3 text-slate-600" />
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-black/20 text-slate-300 border border-white/10 shrink-0">
                {item.badge}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-300">National Platform</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-[10px] text-slate-500">
          Smart India Hackathon 2026 Prototype • Fully functional local sandbox
        </p>
      </div>
    </aside>
  );
};
