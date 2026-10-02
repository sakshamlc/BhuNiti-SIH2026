import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DataSource } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  ExternalLink,
  ShieldCheck,
  Code,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';

export const Integration: React.FC = () => {
  const { dataSources, syncDataSource, language } = useData();

  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | undefined>(dataSources[0]);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleTestSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      syncDataSource(id);
      setIsSyncing(null);
    }, 900);
  };

  const statusBadges = {
    operational: {
      label: 'Operational / Synced',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    degraded: {
      label: 'High Latency / Degraded',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    syncing: {
      label: 'Sync in Progress',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-500 animate-pulse',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 uppercase tracking-wider">
              Item 13: Data Integration & Connectors
            </span>
            <span className="text-xs text-slate-500">• 10 National Central Databases Linked</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            DoLR & National Land Systems Integration Hub
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Interoperable data exchange bridges connecting Bhu-Naksha, DILRMP, NGDRS, SVAMITVA, ISRO Bhuvan, and e-Courts under open OGC/ISO standards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            9/10 Endpoints Healthy (99.4% Uptime)
          </span>
        </div>
      </div>

      {/* Main Grid: Connector List & Schema Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 10 Connectors List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Registered Connectors ({dataSources.length})
          </h2>

          <div className="space-y-2">
            {dataSources.map(ds => {
              const isSelected = ds.id === selectedDataSource?.id;
              const badge = statusBadges[ds.status] || statusBadges.operational;
              return (
                <div
                  key={ds.id}
                  onClick={() => setSelectedDataSource(ds)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-white ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{ds.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badge.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {ds.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs leading-snug mb-1">
                    {ds.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mb-3">{ds.recordsCount}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Latency: <strong className="text-slate-700 font-mono">{ds.latencyMs}ms</strong></span>
                    <span>Synced: {ds.lastSync}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Schema Inspector & Ping Test (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {selectedDataSource ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                      {selectedDataSource.id}
                    </span>
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase">
                      {selectedDataSource.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {selectedDataSource.name} ({selectedDataSource.acronym})
                  </h2>
                </div>

              <button
                onClick={() => handleTestSync(selectedDataSource.id)}
                disabled={isSyncing === selectedDataSource.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing === selectedDataSource.id ? 'animate-spin' : ''}`} />
                <span>{isSyncing === selectedDataSource.id ? 'Pinging Gateway...' : 'Ping Test & Sync'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedDataSource.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Volume</span>
                <span className="font-bold text-slate-800">{selectedDataSource.recordsCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Authentication</span>
                <span className="font-bold text-slate-800">{selectedDataSource.authType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">REST / OGC Gateway</span>
                <span className="font-mono text-slate-700 truncate block text-[11px]">{selectedDataSource.endpoint}</span>
              </div>
            </div>

            {/* Schema Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-teal-600" />
                Interchange Schema Fields ({selectedDataSource.schemaFields.length})
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2.5 px-3">Field Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                    {selectedDataSource.schemaFields.map((field, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono font-bold text-teal-900">{field.field}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{field.type}</td>
                        <td className="py-2 px-3 text-[11px] text-slate-600">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Select a data source connector from the left panel.
          </div>
        )}

          {/* National Interoperability Framework Architecture diagram box */}
          <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              DoLR Interoperability Architecture Standard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every data connector operates over standard JSON-LD and OGC GeoJSON protocol formats. Cadastral parcel coordinates are strictly normalized to EPSG:4326 / WGS84 coordinates to maintain cross-state topological consistency.
            </p>
          </div>
        </div>
      </div>

      <ProvenanceFooter
        source="National Informatics Centre (NIC) Land Informatics Division & DoLR Enterprise Bus"
        version="v2026.10-LiveBridge"
      />
    </div>
  );
};
