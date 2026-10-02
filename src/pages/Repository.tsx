import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Resource, ResourceType, Classification } from '../types';
import { ProvenanceFooter } from '../components/ProvenanceFooter';
import {
  Search,
  Filter,
  Download,
  Plus,
  BookOpen,
  FileText,
  Database,
  Scale,
  Award,
  Shield,
  Eye,
  X,
  CheckCircle,
  Tag,
  Building,
} from 'lucide-react';

export const Repository: React.FC = () => {
  const { resources, addResource, language } = useData();
  const { canViewClassification, currentRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<ResourceType>('research_paper');
  const [uploadAuthors, setUploadAuthors] = useState('');
  const [uploadOrg, setUploadOrg] = useState('');
  const [uploadYear, setUploadYear] = useState('2026');
  const [uploadState, setUploadState] = useState('Pan-India');
  const [uploadTags, setUploadTags] = useState('DILRMP, Cadastral, Land Governance');
  const [uploadAbstract, setUploadAbstract] = useState('');
  const [uploadClassification, setUploadClassification] = useState<Classification>('public');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Filtered list
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      // Classification security check
      if (!canViewClassification(res.classification)) return false;

      // Filter by classification dropdown
      if (selectedClassification !== 'all' && res.classification !== selectedClassification) return false;

      // Filter by type
      if (selectedType !== 'all' && res.type !== selectedType) return false;

      // Filter by state
      if (selectedState !== 'all' && !res.state.toLowerCase().includes(selectedState.toLowerCase())) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchAbstract = res.abstract.toLowerCase().includes(q);
        const matchAuthors = (res.authors || []).some(a => a.toLowerCase().includes(q));
        const matchTags = (res.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAbstract && !matchAuthors && !matchTags) return false;
      }

      return true;
    });
  }, [resources, canViewClassification, selectedClassification, selectedType, selectedState, searchQuery]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadAbstract.trim()) return;

    addResource({
      title: uploadTitle,
      type: uploadType,
      authors: uploadAuthors.split(',').map(a => a.trim()).filter(Boolean),
      organization: uploadOrg || 'Academic / Policy Institution',
      year: parseInt(uploadYear) || 2026,
      state: uploadState,
      tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean),
      abstract: uploadAbstract,
      source: 'User Uploaded via National Research Portal',
      classification: uploadClassification,
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadAbstract('');
    }, 1200);
  };

  const typeIcons: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
    research_paper: BookOpen,
    policy_document: FileText,
    dataset: Database,
    legal_precedent: Scale,
    case_study: Award,
  };

  const classificationBadges: Record<Classification, string> = {
    public: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    restricted: 'bg-amber-50 text-amber-800 border-amber-200',
    confidential: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider">
              Item 7: Central Repository
            </span>
            <span className="text-xs text-slate-500">• {resources.length} Total Registered Artifacts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            National Land Governance Knowledge Repository
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Multi-state empirical research papers, cadastral geospatial datasets, judicial precedents, and official gazettes.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          {language === 'hi' ? 'नया शोध अपलोड करें' : 'Upload Research / Paper'}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search title, authors, abstract, tags (e.g. DILRMP, Conclusive Titling)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Document Types</option>
            <option value="research_paper">Research Papers</option>
            <option value="policy_document">Policy Documents & Circulars</option>
            <option value="dataset">Geospatial Datasets</option>
            <option value="legal_precedent">Judicial & High Court Precedents</option>
            <option value="case_study">Case Studies</option>
          </select>

          {/* Classification Filter */}
          <select
            value={selectedClassification}
            onChange={e => setSelectedClassification(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Classifications</option>
            <option value="public">Public</option>
            <option value="restricted">Restricted (Official)</option>
            <option value="confidential">Confidential (Level-3)</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All States & Regions</option>
            <option value="Pan-India">National / Pan-India</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Odisha">Odisha</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredResources.length}</strong> of {resources.length} resources
          </span>
          <span className="text-[11px] text-slate-400">
            Current clearance: <strong className="capitalize text-slate-700">{currentRole}</strong>
          </span>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          const Icon = typeIcons[res.type] || FileText;
          return (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-500/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {res.id}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${classificationBadges[res.classification]}`}>
                    {res.classification}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-800 transition line-clamp-2 mb-2">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                  {res.abstract}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {res.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                      #{tag}
                    </span>
                  ))}
                  {res.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">+{res.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                  <span className="truncate max-w-[140px] font-medium text-slate-600">
                    {(res.organization || '').split('/')[0]}
                  </span>
                  <span>{res.year} • {res.citationsCount || 0} citations</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No resources match your current filter</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search query or adjusting your clearance filter.</p>
        </div>
      )}

      {/* Resource Detail Drawer / Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                  {selectedResource.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${classificationBadges[selectedResource.classification]}`}>
                  {selectedResource.classification}
                </span>
                <span className="text-xs font-semibold text-slate-500 capitalize">
                  {selectedResource.type.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {selectedResource.title}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Authors</span>
                <span className="font-medium text-slate-800">{selectedResource.authors.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Organization</span>
                <span className="font-medium text-slate-800">{selectedResource.organization}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Year & Region</span>
                <span className="font-medium text-slate-800">{selectedResource.year} • {selectedResource.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Journal / Publisher</span>
                <span className="font-medium text-slate-800">{selectedResource.source}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Executive Abstract & Findings</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {selectedResource.abstract}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Thematic Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedResource.tags.map((t, i) => (
                  <span key={i} className="px-2 py-1 rounded-md text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <ProvenanceFooter
              source={selectedResource.source}
              version={`Artifact Ref ${selectedResource.id} (Verified)`}
              classification={selectedResource.classification}
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Downloaded {selectedResource.downloadsCount} times • {selectedResource.citationsCount} citations
              </span>
              <button
                onClick={() => {
                  alert(`Downloading verified copy of ${selectedResource.id}: ${selectedResource.title}`);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Full Paper (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Research Artifact</h3>
                <p className="text-xs text-slate-500">Adds paper or dataset to local repository state</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Resource Uploaded Successfully</h4>
                <p className="text-xs text-slate-500">Recorded in local repository & cryptographic audit trail.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="e.g. Impact of Drone Resurvey on Cadastral Mutation Speed"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Document Type</label>
                    <select
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value as ResourceType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                    >
                      <option value="research_paper">Research Paper</option>
                      <option value="policy_document">Policy Document</option>
                      <option value="dataset">Dataset</option>
                      <option value="legal_precedent">Legal Precedent</option>
                      <option value="case_study">Case Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Classification</label>
                    <select
                      value={uploadClassification}
                      onChange={e => setUploadClassification(e.target.value as Classification)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                    >
                      <option value="public">Public</option>
                      <option value="restricted">Restricted (Govt Only)</option>
                      <option value="confidential">Confidential (Level-3)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Author(s)</label>
                    <input
                      type="text"
                      value={uploadAuthors}
                      onChange={e => setUploadAuthors(e.target.value)}
                      placeholder="Dr. Rajeshwar Sharma, Meera Sen"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization / Institution</label>
                    <input
                      type="text"
                      value={uploadOrg}
                      onChange={e => setUploadOrg(e.target.value)}
                      placeholder="IIT Delhi / CPR"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keywords / Tags (comma separated)</label>
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={e => setUploadTags(e.target.value)}
                    placeholder="DILRMP, Drone Survey, Conclusive Titling"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Abstract / Executive Summary *</label>
                  <textarea
                    required
                    rows={3}
                    value={uploadAbstract}
                    onChange={e => setUploadAbstract(e.target.value)}
                    placeholder="Describe methodology, sample size of surveyed parcels, and empirical policy conclusions..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Confirm & Publish to Repository
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
