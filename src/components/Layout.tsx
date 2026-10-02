import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';
import { useData } from '../context/DataContext';

export const Layout: React.FC = () => {
  const { language } = useData();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900">
      <Header />

      <div className="flex-1 flex max-w-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto min-w-0 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Official GIGW Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              {language === 'hi'
                ? 'भूनीति - राष्ट्रीय भूमि शासन अनुसंधान एवं नीति नवाचार मंच'
                : 'BhuNiti - National Land Governance Research & Policy Innovation Platform'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Developed for Department of Land Resources (DoLR), MoRD • Smart India Hackathon 2026 (Problem Statement 26019)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              GIGW 3.0 Accessible
            </span>
            <span>NIC Standards Compliant</span>
            <span>OGC Geo-Services</span>
            <span>Empirical Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
