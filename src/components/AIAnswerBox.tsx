import React, { useState } from 'react';
import { Sparkles, Copy, Check, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Resource } from '../types';

interface AIAnswerBoxProps {
  answer: string;
  isLiveAI?: boolean;
  onCitationClick?: (resId: string) => void;
  title?: string;
  sourceContext?: string;
}

export const AIAnswerBox: React.FC<AIAnswerBoxProps> = ({
  answer,
  isLiveAI = false,
  onCitationClick,
  title = 'AI Research Synthesis & Empirical Insights',
  sourceContext,
}) => {
  const [copied, setCopied] = useState(false);
  const { resources, language } = useData();

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(answer).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.warn('Clipboard write failed:', err);
      });
    }
  };

  // Find all citations like [RES-01], [RES-12]
  const renderFormattedText = (text: string) => {
    if (!text || typeof text !== 'string') return null;
    const parts = text.split(/(\[RES-\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(RES-\d+)\]/);
      if (match) {
        const resId = match[1];
        const resource = resources.find(r => r.id === resId);
        return (
          <button
            key={index}
            onClick={() => onCitationClick && onCitationClick(resId)}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer align-baseline shadow-xs"
            title={resource ? `${resource.title} (${resource.year})` : resId}
          >
            <BookOpen className="w-3 h-3" />
            {resId}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-indigo-800/50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h3>
            <p className="text-xs text-indigo-200/80">
              {sourceContext || (language === 'hi' ? 'कैडस्ट्रल अभिलेखों व नीति अनुसंधानों पर आधारित' : 'Grounded on DoLR repositories, DILRMP data & peer-reviewed research')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLiveAI ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Gemini 3.8 Flash
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Empirical Model Synthesis
            </span>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            title="Copy answer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Answer Body */}
      <div className="text-sm leading-relaxed text-slate-200 space-y-3 font-normal whitespace-pre-wrap relative z-10">
        {renderFormattedText(answer)}
      </div>

      {/* Footer provenance note */}
      <div className="mt-5 pt-3 border-t border-indigo-900/60 flex flex-wrap items-center justify-between text-[11px] text-indigo-300/70 gap-2 relative z-10">
        <span>Click citation pills (e.g. [RES-01]) to view the underlying research paper or official gazette.</span>
        <span className="italic">Department of Land Resources • Research Division</span>
      </div>
    </div>
  );
};
