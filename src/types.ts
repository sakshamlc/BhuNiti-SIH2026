export type UserRole = 'researcher' | 'official' | 'admin' | 'public' | 'industry';

export type Classification = 'public' | 'restricted' | 'confidential';

export type ResourceType = 'research_paper' | 'policy_document' | 'dataset' | 'legal_precedent' | 'case_study';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  state?: string;
  avatar: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  authors: string[];
  organization: string;
  year: number;
  state: string;
  tags: string[];
  abstract: string;
  source: string;
  url?: string;
  classification: Classification;
  citationsCount: number;
  downloadsCount: number;
  dateAdded: string;
}

export interface DistrictLandUse {
  agri: number;    // %
  forest: number;  // %
  urban: number;   // %
  barren: number;  // %
  water: number;   // %
}

export interface DistrictDisputes {
  pending: number;
  resolved: number;
  avgResolutionDays: number;
}

export interface District {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  landUse: DistrictLandUse;
  climateVulnerabilityIndex: number; // 0-100 (higher = more vulnerable)
  disputes: DistrictDisputes;
  infraScore: number;                 // 0-100
  digitizedRecordsPct: number;        // 0-100%
  urbanExpansionRate: number;         // % annual growth
  ndviScore: number;                  // 0.0 - 1.0 (vegetation greenness)
  totalParcels: number;
  ulpinCoveragePct: number;
}

export interface MutationHistoryItem {
  id: string;
  date: string;
  type: 'sale_deed' | 'inheritance' | 'partition' | 'mortgage' | 'court_decree';
  status: 'approved' | 'in_progress' | 'disputed';
  parties: string;
  remarks: string;
}

export interface Parcel {
  id: string;
  surveyNo: string;
  ulpin: string; // 14-digit Bhu-Aadhaar
  district: string;
  state: string;
  taluk: string;
  village: string;
  areaHectares: number;
  landType: 'Agricultural' | 'Residential' | 'Commercial' | 'Forest/Public' | 'Industrial';
  ownerType: 'Individual' | 'Joint' | 'Community' | 'Government' | 'Tribal Trust';
  ownerNameMasked: string; // privacy compliance
  disputeStatus: 'clear' | 'pending_litigation' | 'mutation_in_progress';
  mutationHistory: MutationHistoryItem[];
  geoCoords: [number, number][]; // Polygon coordinates
}

export interface PolicyIndicator {
  year: number;
  digitizationPct: number;
  pendingDisputes: number;
  avgResolutionDays: number;
  registrationHours: number;
  revenueCrores: number;
}

export interface Policy {
  id: string;
  name: string;
  acronym: string;
  department: string;
  launchYear: number;
  description: string;
  status: 'Active' | 'Pioneered' | 'Expanded' | 'Under Review';
  keyFocusAreas: string[];
  indicators: PolicyIndicator[];
}

export interface WorkspaceTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WorkspaceComment {
  id: string;
  author: string;
  role: string;
  time: string;
  text: string;
}

export interface WorkspaceMember {
  name: string;
  role: string;
  organization: string;
  avatar: string;
}

export interface Workspace {
  id: string;
  title: string;
  description: string;
  category: string;
  leader: string;
  membersCount: number;
  members: WorkspaceMember[];
  documentsCount: number;
  tasks: WorkspaceTask[];
  comments: WorkspaceComment[];
  recentActivity: string;
}

export interface InnovationItem {
  id: string;
  title: string;
  type: 'hackathon' | 'grant' | 'pilot' | 'competition';
  prizeOrFunding: string;
  deadline: string;
  status: 'open' | 'reviewing' | 'completed';
  organizer: string;
  description: string;
  eligibleEntities: string[];
  tags: string[];
  submissionsCount: number;
}

export interface DataSourceSchemaField {
  field: string;
  type: string;
  description: string;
}

export interface DataSource {
  id: string;
  name: string;
  acronym: string;
  category: 'Land Records' | 'Satellite / GIS' | 'Registration' | 'Governance / Census' | 'Infrastructure';
  status: 'operational' | 'degraded' | 'syncing';
  recordsCount: string;
  lastSync: string;
  latencyMs: number;
  authType: string;
  endpoint: string;
  description: string;
  schemaFields: DataSourceSchemaField[];
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST';
  summary: string;
  description: string;
  category: string;
  authRequired: boolean;
  sampleParams: Record<string, unknown>;
  sampleResponse: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  resource: string;
  classification: Classification;
  ipAddress: string;
  status: 'success' | 'flagged' | 'denied';
}

export interface SimulationParams {
  digitizationBudget: number;       // ₹ Crores (50 to 500)
  fastTrackCourts: number;          // Number of dedicated revenue benches (5 to 100)
  tenureCoverage: number;           // % of rural landholders granted conclusive title (20 to 100)
  agriProtectionZone: number;       // Stringency of agricultural land preservation (1 to 10)
  stampDutyRationalization: number; // % reduction in transaction duty (0 to 5%)
}

export interface SimulationProjection {
  year: number;
  pendingDisputes: number;
  revenueCrores: number;
  agriLandPreservedPct: number;
  easeOfDoingBusinessScore: number;
  formalCreditFlowCrores: number;
}
