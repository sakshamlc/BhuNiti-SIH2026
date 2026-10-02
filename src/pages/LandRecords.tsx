import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Parcel } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Search,
  Filter,
  FileSpreadsheet,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  X,
  History,
  Tag,
  Building,
} from 'lucide-react';

export const LandRecords: React.FC = () => {
  const [searchParams] = useSearchParams();
  const districtParam = searchParams.get('district') || 'all';

  const { parcels, districts, language } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(districtParam);
  const [selectedDisputeFilter, setSelectedDisputeFilter] = useState<string>('all');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      if (selectedDistrict !== 'all' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      if (selectedDisputeFilter !== 'all' && p.disputeStatus !== selectedDisputeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUlpin = p.ulpin.toLowerCase().includes(q);
        const matchSurvey = p.surveyNo.toLowerCase().includes(q);
        const matchVillage = p.village.toLowerCase().includes(q);
        const matchTaluk = p.taluk.toLowerCase().includes(q);
        if (!matchUlpin && !matchSurvey && !matchVillage && !matchTaluk) return false;
      }
      return true;
    });
  }, [parcels, selectedDistrict, selectedDisputeFilter, searchQuery]);

  const disputeBadges = {
    clear: {
      label: 'Clear Title / Verified',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle,
    },
    pending_litigation: {
      label: 'Pending Litigation',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: AlertTriangle,
    },
    mutation_in_progress: {
      label: 'Mutation In Progress',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 uppercase tracking-wider">
              Cadastral Records & Bhu-Aadhaar
            </span>
            <span className="text-xs text-slate-500">• 14-Digit ULPIN Geo-Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cadastral Land Records & Parcel Viewer
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Parcel-level cadastral survey register with unique Bhu-Aadhaar (ULPIN), area in hectares, mutation audit trail, and active litigation flags.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Privacy Compliance: <strong>Owner PII Masked</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by 14-digit ULPIN, Survey Number, Village, or Taluk..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* District Filter */}
        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">All Districts</option>
          {Array.from(new Set(parcels.map(p => p.district))).sort().map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Dispute Status Filter */}
        <select
          value={selectedDisputeFilter}
          onChange={e => setSelectedDisputeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">All Title Statuses</option>
          <option value="clear">Clear Title (No Injunction)</option>
          <option value="pending_litigation">Pending Litigation</option>
          <option value="mutation_in_progress">Mutation In Progress</option>
        </select>
      </div>

      {/* Cadastral Parcel Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-4">ULPIN (Bhu-Aadhaar)</th>
                <th className="py-3 px-4">Survey No</th>
                <th className="py-3 px-4">Location (District / Village)</th>
                <th className="py-3 px-4">Area (Ha)</th>
                <th className="py-3 px-4">Land & Owner Type</th>
                <th className="py-3 px-4">Owner (Masked)</th>
                <th className="py-3 px-4">Title / Dispute Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredParcels.map(parcel => {
                const badge = disputeBadges[parcel.disputeStatus] || disputeBadges.clear;
                const BadgeIcon = badge.icon;
                return (
                  <tr key={parcel.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-900">
                      {parcel.ulpin}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {parcel.surveyNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{parcel.district}, {parcel.state}</span>
                      <span className="text-[11px] text-slate-500">{parcel.taluk} / {parcel.village}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {parcel.areaHectares} ha
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">{parcel.landType}</span>
                      <span className="text-[10px] text-slate-500">{parcel.ownerType}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {parcel.ownerNameMasked}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition shadow-xs"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredParcels.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-500">
            No cadastral parcels match the selected criteria.
          </div>
        )}
      </div>

      {/* Parcel Detail Modal with Mutation History Timeline */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cadastral Parcel Record (RoR)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-lg font-bold text-slate-900 font-mono">
                    {selectedParcel.ulpin}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-semibold">
                    Survey {selectedParcel.surveyNo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Area</span>
                <span className="font-mono font-bold text-slate-900">{selectedParcel.areaHectares} Hectares</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Classification</span>
                <span className="font-semibold text-slate-800">{selectedParcel.landType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Ownership</span>
                <span className="font-semibold text-slate-800">{selectedParcel.ownerType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Title Status</span>
                <span className="font-semibold text-slate-800 capitalize">{selectedParcel.disputeStatus.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Polygon Coordinates representation */}
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono font-bold text-emerald-400">WGS84 Cadastral Boundary Vertices:</span>
                <span>EPSG:4326</span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all leading-relaxed">
                POLYGON(({(selectedParcel.geoCoords || []).map(c => Array.isArray(c) ? `[${(c[0] ?? 0).toFixed(4)}, ${(c[1] ?? 0).toFixed(4)}]` : '').filter(Boolean).join(', ')}))
              </p>
            </div>

            {/* Mutation History Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-600" />
                Mutation Audit Trail & Succession Log
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(selectedParcel.mutationHistory || []).map((item, idx) => (
                  <div key={item.id || idx} className="relative pl-7 text-xs">
                    <span className="absolute left-1.5 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-700">{item.id}</span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="font-semibold text-slate-900 capitalize">
                        {(item.type || '').replace('_', ' ')} • <span className="text-slate-600 font-normal">{item.parties}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">{item.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProvenanceFooter
              source="State Revenue Directorate / Bhoomi / e-Mahabhumi / Bhulekh"
              version="Cadastral Record v2026.09"
              assumptions="Encumbrances verified against Sub-Registrar deed indexation records."
            />

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedParcel(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      <ProvenanceFooter
        source="Department of Land Resources (DoLR) National ULPIN Hub"
        version="v2026.10-IN"
        assumptions="Live simulated cadastral register complying with ISO 19152 Land Administration Domain Model (LADM)."
      />
    </div>
  );
};
