import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { RoleGuard } from './components/RoleGuard';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Repository } from './pages/Repository';
import { SearchPage } from './pages/Search';
import { GISExplorer } from './pages/GISExplorer';
import { LandRecords } from './pages/LandRecords';
import { Analytics } from './pages/Analytics';
import { Simulation } from './pages/Simulation';
import { AILab } from './pages/AILab';
import { Workspaces } from './pages/Workspaces';
import { Innovation } from './pages/Innovation';
import { Integration } from './pages/Integration';
import { ApiDocs } from './pages/ApiDocs';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Top-level Login page */}
            <Route path="/login" element={<Login />} />

            {/* Layout Wraps core application */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="repository" element={<Repository />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="gis" element={<GISExplorer />} />
              <Route
                path="records"
                element={
                  <RoleGuard module="records">
                    <LandRecords />
                  </RoleGuard>
                }
              />
              <Route
                path="analytics"
                element={
                  <RoleGuard module="analytics">
                    <Analytics />
                  </RoleGuard>
                }
              />
              <Route
                path="simulation"
                element={
                  <RoleGuard module="simulation" allowedRoles={['official', 'admin']}>
                    <Simulation />
                  </RoleGuard>
                }
              />
              <Route
                path="ai-lab"
                element={
                  <RoleGuard module="ailab" allowedRoles={['researcher', 'official', 'admin']}>
                    <AILab />
                  </RoleGuard>
                }
              />
              <Route
                path="workspaces"
                element={
                  <RoleGuard module="workspaces" allowedRoles={['researcher', 'official', 'admin', 'industry']}>
                    <Workspaces />
                  </RoleGuard>
                }
              />
              <Route path="innovation" element={<Innovation />} />
              <Route
                path="integration"
                element={
                  <RoleGuard module="integration" allowedRoles={['official', 'admin']}>
                    <Integration />
                  </RoleGuard>
                }
              />
              <Route
                path="api-docs"
                element={
                  <RoleGuard module="apidocs" allowedRoles={['researcher', 'official', 'admin', 'industry']}>
                    <ApiDocs />
                  </RoleGuard>
                }
              />
              <Route
                path="admin"
                element={
                  <RoleGuard module="admin" allowedRoles={['admin']}>
                    <Admin />
                  </RoleGuard>
                }
              />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
                      <h2 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h2>
                      <p className="text-xs text-slate-600 mb-4">
                        The requested land governance route does not exist in the platform catalogue.
                      </p>
                      <a
                        href="/dashboard"
                        className="inline-flex px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        Return to Dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
