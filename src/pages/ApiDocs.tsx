import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ApiEndpoint } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Code2,
  Play,
  Copy,
  Check,
  Key,
  Lock,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const { apiEndpoints, language } = useData();

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | undefined>(apiEndpoints[0]);
  const [paramsInput, setParamsInput] = useState<string>(() =>
    JSON.stringify(apiEndpoints[0]?.sampleParams || {}, null, 2)
  );
  const [responsePayload, setResponsePayload] = useState<string>(() =>
    JSON.stringify(apiEndpoints[0]?.sampleResponse || {}, null, 2)
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [mockApiKey, setMockApiKey] = useState('bn_live_981a2f64c0199e81b2447d');

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setParamsInput(JSON.stringify(ep.sampleParams, null, 2));
    setResponsePayload(JSON.stringify(ep.sampleResponse, null, 2));
  };

  const handleExecuteTryIt = () => {
    if (!selectedEndpoint) return;
    setIsExecuting(true);
    setTimeout(() => {
      // Return the mock response with updated execution timestamp
      const updated = {
        ...(selectedEndpoint.sampleResponse || {}),
        executed_at: new Date().toISOString(),
        request_latency_ms: Math.floor(Math.random() * 45 + 30),
      };
      setResponsePayload(JSON.stringify(updated, null, 2));
      setIsExecuting(false);
    }, 450);
  };

  const generateNewKey = () => {
    const newKey = `bn_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 10)}`;
    setMockApiKey(newKey);
  };

  const handleCopyKey = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(mockApiKey).then(() => {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }).catch(err => {
        console.warn('Clipboard write failed:', err);
      });
    }
  };

  const handleCopyResponse = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(responsePayload).then(() => {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      }).catch(err => {
        console.warn('Clipboard write failed:', err);
      });
    }
  };

  const methodColors = {
    GET: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    POST: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 uppercase tracking-wider">
              Item 18: APIs & Interactive Sandbox
            </span>
            <span className="text-xs text-slate-500">• RESTful JSON Endpoints</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Developer API Catalogue & Interactive Console
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Standard REST endpoints for cadastral lookups, district land governance metrics, satellite LULC changes, and dispute predictive scores.
          </p>
        </div>

        {/* API Key Box */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              Sandbox API Key
            </span>
            <button
              onClick={generateNewKey}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Regenerate
            </button>
          </div>
          <div className="flex items-center gap-2">
            <code className="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-800">
              {mockApiKey}
            </code>
            <button
              onClick={handleCopyKey}
              className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              title="Copy Key"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Endpoint Catalogue & Interactive Try-It Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Endpoint List (1 col) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Endpoints ({apiEndpoints.length})
          </h2>

          <div className="space-y-2">
            {apiEndpoints.map(ep => {
              const isSelected = ep.id === selectedEndpoint?.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${methodColors[ep.method]}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-800 truncate">
                      {ep.path}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs leading-snug">
                    {ep.summary}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                    {ep.category}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Try-It Console (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedEndpoint ? (
            <>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${methodColors[selectedEndpoint.method]}`}>
                        {selectedEndpoint.method}
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {selectedEndpoint.path}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-700">{selectedEndpoint.summary}</h3>
                  </div>

                  <button
                    onClick={handleExecuteTryIt}
                    disabled={isExecuting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 shrink-0"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-pulse' : ''}`} />
                    <span>{isExecuting ? 'Calling Gateway...' : 'Send Request (Try It)'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedEndpoint.description}
                </p>

                {/* Request Payload Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" />
                      Request Parameters (JSON)
                    </span>
                    <span className="text-[10px] text-slate-400">Bearer Token Header Included</span>
                  </div>
                  <textarea
                    rows={4}
                    value={paramsInput}
                    onChange={e => setParamsInput(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                {/* Live Response Payload Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-emerald-600" />
                      Response Output (200 OK)
                    </span>
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      {copiedResponse ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedResponse ? 'Copied' : 'Copy JSON'}
                    </button>
                  </div>

                  <pre className="w-full p-4 font-mono text-xs bg-slate-950 text-slate-200 rounded-xl border border-slate-800 overflow-x-auto max-h-72 leading-relaxed">
                    {responsePayload}
                  </pre>
                </div>
              </div>

              {/* Integration Sample Code Snippet */}
              <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                  cURL Request Example
                </span>
                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-2 bg-black/40 rounded-lg">
                  {`curl -X ${selectedEndpoint.method} "https://api.bhuniti.nic.in${selectedEndpoint.path}" \\
  -H "Authorization: Bearer ${mockApiKey}" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Select an API endpoint from the catalogue.
            </div>
          )}
        </div>
      </div>

      <ProvenanceFooter
        source="DoLR National API Gateway & NIC Open Data Standard"
        version="OpenAPI 3.1 Specification"
      />
    </div>
  );
};
