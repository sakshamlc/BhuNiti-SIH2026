import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Workspace } from '../types';
import { AIAnswerBox } from '../components/AIAnswerBox';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Users2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  FileText,
  Plus,
  Send,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const Workspaces: React.FC = () => {
  const { workspaces, addWorkspaceComment, toggleWorkspaceTask, language } = useData();
  const { currentUser } = useAuth();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(workspaces[0]?.id || 'WS-01');
  const [commentText, setCommentText] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace || !commentText.trim()) return;

    addWorkspaceComment(
      selectedWorkspace.id,
      commentText.trim(),
      currentUser.name,
      currentUser.role
    );
    setCommentText('');
  };

  const handleSummarizeWorkspace = () => {
    if (!selectedWorkspace) return;
    setIsSummarizing(true);
    setTimeout(() => {
      const completedTasks = (selectedWorkspace.tasks || []).filter(t => t.status === 'completed').length;
      const totalTasks = (selectedWorkspace.tasks || []).length;
      const summary = `Executive Summary for "${selectedWorkspace.title}":
• Key Mandate: ${selectedWorkspace.description}
• Current Progress: ${completedTasks} of ${totalTasks} statutory milestones completed.
• Lead Institution: ${selectedWorkspace.leader}
• Active Discussion Points: Team has verified spatial pilot data showing a 62% reduction in boundary overlap litigation following high-precision drone cadastral surveys.
• Next Critical Blocker: Harmonizing state title guarantee indemnity caps with Department of Expenditure financial guidelines prior to the upcoming parliamentary review.`;
      setAiSummary(summary);
      setIsSummarizing(false);
    }, 800);
  };

  const priorityColors = {
    high: 'bg-rose-100 text-rose-800 border-rose-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider">
              Item 9: Collaborative Workspaces
            </span>
            <span className="text-xs text-slate-500">• 4 Active Inter-Ministerial Taskforces</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inter-Agency Research & Policy Workspaces
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Cross-departmental collaboration between DoLR officials, IIT researchers, state revenue secretaries, and legal experts.
          </p>
        </div>

        <button
          onClick={handleSummarizeWorkspace}
          disabled={isSummarizing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isSummarizing ? 'Summarizing...' : 'AI Summarize Workspace'}</span>
        </button>
      </div>

      {/* AI Workspace Summary Box */}
      {aiSummary && selectedWorkspace && (
        <AIAnswerBox
          answer={aiSummary}
          title={`Taskforce Executive Synthesis: ${selectedWorkspace.title}`}
          sourceContext="Synthesized from collaborative task lists, member comments, and linked working papers"
        />
      )}

      {/* Main Layout: Workspace Selector (Sidebar/Cards) + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace List (1 col) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Taskforces ({workspaces.length})
          </h2>

          {workspaces.map(ws => {
            const isSelected = ws.id === selectedWorkspace?.id;
            return (
              <div
                key={ws.id}
                onClick={() => {
                  setSelectedWorkspaceId(ws.id);
                  setAiSummary(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span className="uppercase">{ws.category}</span>
                  <span className="font-mono">{ws.id}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs leading-snug mb-1.5">
                  {ws.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {ws.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>{ws.membersCount} Members • {ws.documentsCount} Docs</span>
                  <span className="text-indigo-600 font-semibold">{ws.tasks.filter(t => t.status === 'completed').length}/{ws.tasks.length} Done</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Workspace Detail (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedWorkspace ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No workspaces available.
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    {selectedWorkspace.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedWorkspace.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Chair: <strong>{selectedWorkspace.leader}</strong></p>
                </div>
              </div>

              {/* Taskforce Members Row */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Taskforce Members ({selectedWorkspace.members?.length || 0})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(selectedWorkspace.members || []).map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200" />
                      <div className="truncate text-xs">
                        <span className="font-bold text-slate-800 block truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{m.organization.split('/')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Tasks Board */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Actionable Milestones ({selectedWorkspace.tasks?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-400">Click circle to toggle status</span>
                </div>

                <div className="space-y-2">
                  {(selectedWorkspace.tasks || []).map(task => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleWorkspaceTask(selectedWorkspace.id, task.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                          isDone ? 'bg-slate-50/80 border-slate-200 text-slate-500' : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`truncate font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400">{task.assignee}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discussion & Comments Thread */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Collaborative Discussion Thread ({selectedWorkspace.comments?.length || 0})
                </h4>

                <div className="space-y-2.5 max-h-52 overflow-y-auto mb-3 pr-1">
                  {(selectedWorkspace.comments || []).map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{c.author} <span className="font-normal text-slate-500">({c.role})</span></span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Comment Post Form */}
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={`Comment as ${currentUser.name} (${currentUser.role})...`}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-40 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
