import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { DEMO_USERS } from '../data/users';
import {
  Globe,
  UserCheck,
  ChevronDown,
  Bell,
  Shield,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { language, setLanguage } = useData();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const roleColors: Record<UserRole, string> = {
    official: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    researcher: 'bg-blue-100 text-blue-800 border-blue-300',
    admin: 'bg-purple-100 text-purple-800 border-purple-300',
    industry: 'bg-amber-100 text-amber-800 border-amber-300',
    public: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Tricolor top border for National Government identity */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white border-y border-slate-200/50" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Department Branding */}
          <Link to="/dashboard" className="flex items-center gap-3.5 group shrink-0">
            {/* National emblem representation */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-50 to-orange-100 border border-amber-300/80 p-1 flex items-center justify-center shadow-xs">
              <div className="text-center">
                <span className="block text-xl leading-none">🏛️</span>
                <span className="text-[7px] font-bold text-amber-900 uppercase tracking-tighter">सत्यमेव जयते</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 bg-clip-text text-transparent">
                  BhuNiti
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-tight">
                {language === 'hi'
                  ? 'भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय, भारत सरकार'
                  : 'Department of Land Resources (DoLR), Ministry of Rural Development, GoI'}
              </p>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              placeholder={language === 'hi' ? 'खोजें: ULPIN, DILRMP, कैडस्ट्रल सर्वेक्षण, नीतियां...' : 'Search ULPIN, DILRMP, papers, district GIS, policies...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </form>

          {/* Topbar Controls: Language Toggle + Quick Role Switcher + User Profile */}
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              title="Toggle Hindi / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Role Switcher for Hackathon Evaluation */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-xs ${roleColors[currentRole] || roleColors.official}`}
                title="Switch role for presentation"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">
                      {language === 'hi' ? 'भूमिका बदलें (मूल्यांकन हेतु)' : 'Switch Role (Demonstration)'}
                    </p>
                    <p className="text-[11px] text-slate-500">Test platform permissions and role-based views</p>
                  </div>

                  <div className="p-1 space-y-1">
                    {(Object.keys(DEMO_USERS) as UserRole[]).map(roleKey => {
                      const user = DEMO_USERS[roleKey];
                      const active = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => {
                            switchRole(roleKey);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition ${
                            active ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" />
                          <div className="truncate flex-1">
                            <div className="flex items-center justify-between">
                              <span className="capitalize font-bold text-slate-800">{roleKey}</span>
                              {active && <span className="text-[10px] text-indigo-600 bg-indigo-100 px-1.5 rounded font-semibold">Active</span>}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{user.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl">
                    <Link
                      to="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 py-1"
                    >
                      View Role Permissions Matrix →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left text-xs leading-tight">
                <span className="font-bold text-slate-800 block truncate max-w-[130px]">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{(currentUser.organization || '').split('/')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
