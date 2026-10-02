import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  BookOpen,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Scale,
  CheckCircle,
  MapPin,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Link } from 'react-router-dom';

type DashboardTab = 'all' | 'research' | 'policy' | 'landuse' | 'climate' | 'disputes' | 'outcomes' | 'geospatial';

export const Dashboard: React.FC = () => {
  const { resources, policies, districts } = useData();
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('all');

  // Panel 1: Research Output metrics
  const totalPapers = resources.filter(r => r.type === 'research_paper').length;
  const totalDatasets = resources.filter(r => r.type === 'dataset').length;
  const totalCitations = resources.reduce((acc, r) => acc + r.citationsCount, 0);
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloadsCount, 0);

  // Panel 2: Policy performance time series (DILRMP 2018-2025)
  const dilrmpPolicy = policies.find(p => p.acronym === 'DILRMP') || policies[0];
  const policyTrendData = dilrmpPolicy?.indicators || [];

  // Panel 3: Aggregate Land Use breakdown across 40 districts
  const landUseData = [
    { name: 'Agricultural', value: 52, color: '#10b981' },
    { name: 'Forest & Green', value: 21, color: '#059669' },
    { name: 'Urban / Built-up', value: 18, color: '#6366f1' },
    { name: 'Barren / Fallow', value: 5, color: '#f59e0b' },
    { name: 'Water Bodies', value: 4, color: '#06b6d4' },
  ];

  // Panel 4: Climate vulnerability ranking
  const topVulnerableDistricts = [...districts]
    .sort((a, b) => b.climateVulnerabilityIndex - a.climateVulnerabilityIndex)
    .slice(0, 6);

  // Panel 5: Dispute statistics by state/district
  const disputeData = districts.slice(0, 8).map(d => ({
    name: d.name,
    pending: d.disputes.pending,
    resolved: d.disputes.resolved,
    turnaround: d.disputes.avgResolutionDays,
  }));

  // Panel 6: Project outcomes & implementation progress
  const svamitvaPolicy = policies.find(p => p.acronym === 'SVAMITVA');
  const outcomesData = [
    { metric: 'Villages Drone Surveyed', value: '102,400', target: '120,000', progress: 85.3 },
    { metric: 'Property Cards Issued', value: '1.42 Crore', target: '1.60 Crore', progress: 88.7 },
    { metric: 'Sub-Registrar Integration (NGDRS)', value: '5,240 SROs', target: '5,600', progress: 93.5 },
    { metric: 'Bhu-Aadhaar (ULPIN) Generated', value: '18.4 Crore', target: '20.0 Crore', progress: 92.0 },
    { metric: 'Modern Record Rooms Established', value: '4,100', target: '4,400', progress: 93.1 },
  ];

  // Panel 7: Geospatial Insights & Cadastral Digitization %
  const geospatialData = districts.slice(0, 7).map(d => ({
    name: d.name,
    digitizedPct: d.digitizedRecordsPct,
    ulpinCoverage: d.ulpinCoveragePct,
    urbanExpansion: d.urbanExpansionRate,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              DoLR Executive Overview
            </span>
            <span className="text-xs text-slate-500">• All 7 Required Panels Live</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            National Land Governance Performance Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time synchronization of cadastral mapping, conclusive titling indicators, revenue court litigation, and satellite land dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/gis"
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            Open GIS Explorer
          </Link>
          <Link
            to="/simulation"
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Policy Simulation
          </Link>
        </div>
      </div>

      {/* 7 Panels Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All 7 Panels Summary' },
          { id: 'research', label: '1. Research Outputs' },
          { id: 'policy', label: '2. Policy Performance' },
          { id: 'landuse', label: '3. Land-Use Trends' },
          { id: 'climate', label: '4. Climate Resilience' },
          { id: 'disputes', label: '5. Dispute Statistics' },
          { id: 'outcomes', label: '6. Project Outcomes' },
          { id: 'geospatial', label: '7. Geospatial Insights' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metric Quick Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Cadastral Digitization</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">98.2%</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+36.1% since 2018</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Bhu-Aadhaar (ULPIN)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">18.4 Cr</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>92.0% National Target</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Mutation Turnaround</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">2.4 Days</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Reduced from 48 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Stamp Duty Realized</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹1.04 L Cr</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+148% digital compliance</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* PANEL 1: Research Outputs & Scientific Repository */}
      {(activeTab === 'all' || activeTab === 'research') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">1</span>
                Panel 1: Research Outputs & Scientific Productivity
              </h2>
              <p className="text-xs text-slate-500">Empirical studies, academic citations, and datasets published under DoLR grants</p>
            </div>
            <Link to="/repository" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Browse All 50 Items →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Peer-Reviewed Papers</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalPapers}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+6 this quarter</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Open Spatial Datasets</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalDatasets}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">ISRO & Bhuvan</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Academic Citations</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalCitations}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">H-Index: 28</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Policy Downloads</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalDownloads.toLocaleString()}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Global access</span>
            </div>
          </div>

          <ProvenanceFooter
            source="DoLR Research Division & National Knowledge Portal"
            version="v2026.09"
            assumptions="Includes academic publications indexed in Scopus/UGC CARE and verified DoLR working papers."
          />
        </div>
      )}

      {/* PANEL 2: Policy Performance (DILRMP Longitudinal Trends) */}
      {(activeTab === 'all' || activeTab === 'policy') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
                Panel 2: Policy Performance & Longitudinal Impact (DILRMP)
              </h2>
              <p className="text-xs text-slate-500">Longitudinal evaluation of Cadastral Digitization % vs Average Mutation Hours (2018-2025)</p>
            </div>
            <Link to="/analytics" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
              Deep Policy Comparison →
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={policyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDigi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="digitizationPct" name="Digitization (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorDigi)" strokeWidth={2} />
                <Area type="monotone" dataKey="registrationHours" name="Deed Processing (Hours)" stroke="#6366f1" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <ProvenanceFooter
            source="DILRMP Performance MIS / State Revenue Dashboards"
            version="v2026.03"
            assumptions="Annualized average across 28 states. Processing hours reflect time elapsed from SRO deed presentation to digitized Tehsil mutation."
          />
        </div>
      )}

      {/* Grid: PANEL 3 (Land-Use Trends) & PANEL 4 (Climate Resilience) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 3: Land-Use Trends */}
        {(activeTab === 'all' || activeTab === 'landuse') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">3</span>
                    Panel 3: National Land-Use Trends (LULC)
                  </h2>
                  <p className="text-xs text-slate-500">Distribution across 40 surveyed districts</p>
                </div>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={landUseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {landUseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: unknown) => [`${String(val)}%`, 'Coverage']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <ProvenanceFooter
              source="ISRO Bhuvan 1:50k LULC Sentinel-2 Fusion"
              version="v2025.4"
              assumptions="Vegetation index derived from multi-spectral NDVI composite."
            />
          </div>
        )}

        {/* PANEL 4: Climate Resilience & Vulnerability */}
        {(activeTab === 'all' || activeTab === 'climate') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">4</span>
                    Panel 4: Climate Vulnerability Index (CVI)
                  </h2>
                  <p className="text-xs text-slate-500">Districts with acute coastal inundation & erosion exposure</p>
                </div>
                <Link to="/gis" className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                  View Map →
                </Link>
              </div>

              <div className="space-y-3">
                {topVulnerableDistricts.map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-slate-400 font-mono font-bold">#{i + 1}</span>
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      <span className="text-[10px] text-slate-400">({d.state})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"
                          style={{ width: `${d.climateVulnerabilityIndex}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800 w-8 text-right">
                        {d.climateVulnerabilityIndex}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProvenanceFooter
              source="IIT Bombay / National Institute of Disaster Management (NIDM)"
              version="v2026.01"
              assumptions="Combines 50-year return storm inundation, slope instability, and cadastral density."
            />
          </div>
        )}
      </div>

      {/* PANEL 5: Dispute Statistics (Pending vs Resolved in Hotspots) */}
      {(activeTab === 'all' || activeTab === 'disputes') && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-bold">5</span>
                Panel 5: Land Dispute Statistics & Court Disposal Velocity
              </h2>
              <p className="text-xs text-slate-500">Comparison of pending litigation vs resolved mutation appeals across key districts</p>
            </div>
            <Link to="/analytics" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Dispute Hotspot Predictor →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disputeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                <Bar dataKey="resolved" name="Resolved Disputes" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending Litigation" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ProvenanceFooter
            source="Revenue Court Management System (RCMS) & e-Courts National Portal"
            version="v2026.08"
            assumptions="Includes Section 24 demarcation appeals, inheritance mutation disputes, and Gram Sabha commons litigation."
          />
        </div>
      )}

      {/* Grid: PANEL 6 (Project Outcomes) & PANEL 7 (Geospatial Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 6: Project Outcomes */}
        {(activeTab === 'all' || activeTab === 'outcomes') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">6</span>
                    Panel 6: National Project Outcomes & Milestones
                  </h2>
                  <p className="text-xs text-slate-500">Key performance indicators under SVAMITVA & DILRMP</p>
                </div>
              </div>

              <div className="space-y-4">
                {outcomesData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{item.metric}</span>
                      <span className="text-slate-600 font-mono">
                        {item.value} / <span className="text-slate-400">{item.target}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-emerald-700 font-semibold">
                      {item.progress}% Completed
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProvenanceFooter
              source="Survey of India / Ministry of Panchayati Raj / DoLR"
              version="v2026.09"
              assumptions="Data reconciled monthly through state revenue nodal officers."
            />
          </div>
        )}

        {/* PANEL 7: Geospatial Insights & Cadastral Digitization */}
        {(activeTab === 'all' || activeTab === 'geospatial') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs flex items-center justify-center font-bold">7</span>
                    Panel 7: Geospatial Insights & Cadastral Vectorization
                  </h2>
                  <p className="text-xs text-slate-500">Bhu-Naksha spatial polygon digitization & ULPIN mapping %</p>
                </div>
                <Link to="/records" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                  Inspect Parcels →
                </Link>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geospatialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[60, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="digitizedPct" name="Cadastral Maps Vectorized (%)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ulpinCoverage" name="ULPIN Bhu-Aadhaar (%)" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <ProvenanceFooter
              source="Bhu-Naksha Open Vector Service & State NIC Centres"
              version="v2026.06"
              assumptions="Vector accuracy tested against DGPS ground control points (error < 10cm)."
            />
          </div>
        )}
      </div>
    </div>
  );
};
