import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { DEMO_USERS } from '../data/users';

interface RoleGuardProps {
  module: string;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ module, allowedRoles, children }) => {
  const { currentRole, canAccess, switchRole } = useAuth();

  const isAllowed = allowedRoles
    ? allowedRoles.includes(currentRole)
    : canAccess(module);

  if (!isAllowed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Restricted Module: {module.toUpperCase()}
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your current role (<span className="font-semibold text-slate-800 uppercase">{currentRole}</span>) does not have clearance to view this module. This section contains confidential policy levers or administrative controls.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6 text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Authorized Roles For This View
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(allowedRoles || ['official', 'admin']).map(role => (
                <span
                  key={role}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md shadow-xs capitalize"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-3">For presentation & demonstration evaluation, you can switch role:</p>
            <div className="grid grid-cols-2 gap-2">
              {(allowedRoles || (['official', 'admin'] as UserRole[])).map(r => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Switch to {DEMO_USERS[r]?.name.split(' ')[0]}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
