import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { InnovationItem } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Lightbulb,
  Award,
  Sparkles,
  Calendar,
  Building,
  Tag,
  ArrowRight,
  Plus,
  X,
  CheckCircle,
  FileCheck,
  Send,
} from 'lucide-react';

export const Innovation: React.FC = () => {
  const { innovationItems, submitInnovationProposal, language } = useData();
  const { currentUser } = useAuth();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedItemForApply, setSelectedItemForApply] = useState<InnovationItem | null>(null);

  // Proposal form state
  const [teamName, setTeamName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filteredItems = useMemo(() => {
    return innovationItems.filter(item => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [innovationItems, selectedType, selectedStatus]);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForApply || !teamName.trim() || !proposalAbstract.trim()) return;

    submitInnovationProposal(selectedItemForApply.id, {
      teamName,
      email,
      abstract: proposalAbstract,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedItemForApply(null);
      setProposalAbstract('');
    }, 1500);
  };

  const typeBadges = {
    hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
    grant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pilot: 'bg-blue-100 text-blue-800 border-blue-200',
    competition: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              Item 15: Innovation Portal
            </span>
            <span className="text-xs text-slate-500">• 12 Active Opportunities</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            National Land Governance Innovation Portal
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Open hackathons, research grants, sandbox pilot contracts, and technical challenges accelerating Digital India land reforms.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold">
            ₹3.8 Cr Total Funding Pool
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">All Challenge Types</option>
            <option value="hackathon">Hackathons (SIH 2026)</option>
            <option value="grant">R&D Research Grants</option>
            <option value="pilot">State Demonstration Pilots</option>
            <option value="competition">Grand Challenges</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open for Submissions</option>
            <option value="reviewing">Under Jury Evaluation</option>
            <option value="completed">Completed / Awarded</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{filteredItems.length}</strong> innovation calls
        </span>
      </div>

      {/* Grid of Innovation Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${typeBadges[item.type]}`}>
                  {item.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {item.id}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Funding / Award:</span>
                  <span className="font-bold text-emerald-700 font-mono">{item.prizeOrFunding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-semibold text-slate-800">{item.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organizer:</span>
                  <span className="text-slate-700 truncate max-w-[140px]">{item.organizer.split('&')[0]}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((t, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">
                  {item.submissionsCount} proposals submitted
                </span>
                <button
                  onClick={() => setSelectedItemForApply(item)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Application Modal */}
      {selectedItemForApply && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Proposal Submission
                </span>
                <h3 className="text-sm font-bold text-slate-900">{selectedItemForApply.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItemForApply(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Proposal Successfully Submitted</h4>
                <p className="text-xs text-slate-500">
                  Confirmation receipt issued and logged in DoLR Innovation Registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Applicant / Team Name *</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technical Proposal Abstract / Methodology *</label>
                  <textarea
                    required
                    rows={4}
                    value={proposalAbstract}
                    onChange={e => setProposalAbstract(e.target.value)}
                    placeholder="Briefly describe your algorithmic approach, dataset sources (e.g. Bhuvan/ISRO, DILRMP), and expected delivery milestones..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedItemForApply(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <ProvenanceFooter
        source="Ministry of Rural Development & Innovation Cell, Government of India"
        version="v2026.10-IN (SIH 2026 Track)"
      />
    </div>
  );
};
