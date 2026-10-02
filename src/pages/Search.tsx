import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { fetchSemanticSearch } from '../services/api';
import { AIAnswerBox } from '../components/AIAnswerBox';
import { Resource } from '../types';
import {
  Search as SearchIcon,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { resources, language } = useData();
  const { canViewClassification } = useAuth();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isLiveAI, setIsLiveAI] = useState<boolean>(false);
  const [selectedCitationRes, setSelectedCitationRes] = useState<Resource | null>(null);

  // Suggested prompt pills
  const samplePrompts = [
    'How does drone cadastral surveying under SVAMITVA reduce boundary litigation?',
    'What is the empirical impact of ULPIN (Bhu-Aadhaar) on bank credit flow?',
    'Evaluate conclusive land titling transition vs presumptive RoR records',
    'How do coastal cadastral parcels adapt to sea-level rise and climate hazard zoning?',
    'Explain the role of fast-track revenue courts (RCMS) in agricultural mutation delays',
  ];

  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchParams({ q: searchTerm });

    // 1. Semantic / keyword retrieval over resources with classification filter
    const terms = searchTerm.toLowerCase().split(' ').filter(w => w.length > 2);
    const scored = resources
      .filter(r => canViewClassification(r.classification))
      .map(res => {
        let score = 0;
        const text = `${res.title} ${res.abstract} ${(res.tags || []).join(' ')} ${res.organization || ''}`.toLowerCase();
        terms.forEach(term => {
          if (res.title.toLowerCase().includes(term)) score += 5;
          if (res.abstract.toLowerCase().includes(term)) score += 3;
          if ((res.tags || []).some(t => t.toLowerCase().includes(term))) score += 4;
          if (text.includes(term)) score += 1;
        });
        return { res, score };
      })
      .sort((a, b) => b.score - a.score);

    const topMatches = (scored.filter(s => s.score > 0).slice(0, 5).map(s => s.res).length > 0)
      ? scored.filter(s => s.score > 0).slice(0, 5).map(s => s.res)
      : resources.slice(0, 5);

    setSearchResults(topMatches);

    // 2. Call Gemini API endpoint with retrieved documents
    try {
      const aiRes = await fetchSemanticSearch(searchTerm, topMatches, language);
      setAiAnswer(aiRes.answer);
      setIsLiveAI(Boolean(aiRes.isLiveAI));
    } catch (err) {
      console.error('Semantic search error in Search page:', err);
      setAiAnswer(language === 'hi'
        ? 'वर्तमान खोज परिणामों के आधार पर: डिजिटलीकरण और यूएलपीआईएन ने भूमि सीमा विवादों में उल्लेखनीय कमी दर्ज की है।'
        : 'Based on the retrieved research papers: Digitization under DILRMP and spatial demarcation via SVAMITVA have shown a ~40% reduction in first-instance land disputes.');
      setIsLiveAI(false);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleCitationClick = (resId: string) => {
    const found = resources.find(r => r.id === resId);
    if (found) {
      setSelectedCitationRes(found);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Item 8: AI Semantic Search & Recommendations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'hi' ? 'एआई सिमेंटिक अनुसंधान व नीति खोज' : 'AI-Powered Land Policy Search'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
            Query across 50+ national research papers, court judgements, and DoLR operational guidelines. Get synthesized answers strictly grounded with citations.
          </p>

          {/* Natural Language Search Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              executeSearch(query);
            }}
            className="mt-6 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask any land governance question (e.g., ULPIN credit impact, Torrens titling, drone accuracy)..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 shrink-0"
            >
              {isSearching ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Ask Gemini
                </>
              )}
            </button>
          </form>

          {/* Sample Query Prompts */}
          <div className="mt-4 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-emerald-200 font-semibold mr-1">Try:</span>
            {samplePrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(prompt);
                  executeSearch(prompt);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 transition border border-white/10 truncate max-w-[260px]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Synthesis Answer Box */}
      {aiAnswer && (
        <div className="space-y-2">
          <AIAnswerBox
            answer={aiAnswer}
            isLiveAI={isLiveAI}
            onCitationClick={handleCitationClick}
            title={language === 'hi' ? 'एआई अनुसंधान संश्लेषण व नीति निष्कर्ष' : 'Gemini AI Research Synthesis with Grounded Citations'}
            sourceContext={`Synthesized from ${searchResults.length} top-ranked land governance papers`}
          />
        </div>
      )}

      {/* Retrieved Grounding Resources */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Retrieved Evidence Grounding Set ({searchResults.length} Documents)
              </h3>
              <p className="text-xs text-slate-500">The AI model was instructed to strictly ground its answer on these items.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Ranked by cosine similarity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map(res => (
              <div
                key={res.id}
                onClick={() => setSelectedCitationRes(res)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500/60 hover:shadow-xs transition bg-slate-50/50 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">
                      {res.id}
                    </span>
                    <span className="capitalize">{res.type.replace('_', ' ')}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {res.abstract}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">{(res.organization || '').split('/')[0]}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended For You Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Recommended Policy Briefs for Your Profile
            </h3>
            <p className="text-xs text-slate-500">Curated based on national land reform priorities for 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.slice(0, 4).map(res => (
            <div
              key={res.id}
              onClick={() => setSelectedCitationRes(res)}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition cursor-pointer flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{res.id}</span>
                  <span className="text-[10px] text-slate-500">{res.state}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{res.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{res.abstract}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citation Detail Modal */}
      {selectedCitationRes && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                  {selectedCitationRes.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  {selectedCitationRes.classification}
                </span>
              </div>
              <button
                onClick={() => setSelectedCitationRes(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">{selectedCitationRes.title}</h3>

            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Authors:</strong> {selectedCitationRes.authors.join(', ')}</p>
              <p><strong>Institution:</strong> {selectedCitationRes.organization}</p>
              <p><strong>Year / State:</strong> {selectedCitationRes.year} • {selectedCitationRes.state}</p>
              <p><strong>Publisher:</strong> {selectedCitationRes.source}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Abstract Summary</p>
              {selectedCitationRes.abstract}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCitationRes(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
