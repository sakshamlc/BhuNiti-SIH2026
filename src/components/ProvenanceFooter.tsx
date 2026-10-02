import React from 'react';
import { Info, ShieldCheck, Database } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ProvenanceFooterProps {
  source?: string;
  version?: string;
  assumptions?: string;
  classification?: 'public' | 'restricted' | 'confidential';
}

export const ProvenanceFooter: React.FC<ProvenanceFooterProps> = ({
  source = 'DoLR DILRMP MIS / Survey of India / ISRO Bhuvan Open Data',
  version = 'v2026.10-IN (Cadastral Standard OGC)',
  assumptions = 'Computed on 40 pilot districts longitudinal returns (2018-2025). Illustrative sample data calibrated for policy simulation.',
  classification = 'public',
}) => {
  const { language } = useData();

  const classificationStyles = {
    public: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    restricted: 'bg-amber-50 text-amber-800 border-amber-200',
    confidential: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-500 bg-slate-50/70 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-start sm:items-center gap-2 flex-1">
        <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 sm:mt-0 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-700">
            {language === 'hi' ? 'डेटा स्रोत व संस्करण:' : 'Source & Data Provenance:'}
          </span>{' '}
          {source} • <span className="font-mono text-slate-600">{version}</span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            <span className="font-medium text-slate-500">{language === 'hi' ? 'मान्यताएं:' : 'Assumptions:'}</span> {assumptions}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${classificationStyles[classification]}`}>
          <ShieldCheck className="w-3 h-3" />
          {classification}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
          <Database className="w-3 h-3 text-slate-400" />
          DoLR Verified
        </span>
      </div>
    </div>
  );
};
