import { Workspace } from '../types';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'WS-01',
    title: 'National Cadastral Modernization & Torrens Transition Working Group',
    description: 'Inter-ministerial technical taskforce standardizing conclusive land titling statutes, state land revenue code revisions, and compensation guarantee funds.',
    category: 'Legal & Titling Framework',
    leader: 'Shri Rajeshwar Verma, IAS (DoLR)',
    membersCount: 14,
    documentsCount: 28,
    recentActivity: 'Drafted Section 12 on State Title Indemnity Fund guidelines',
    members: [
      { name: 'Dr. Ananya Sharma', role: 'Principal Investigator', organization: 'CPR India / IIT Delhi', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
      { name: 'Rajeshwar Verma, IAS', role: 'Taskforce Chair', organization: 'DoLR', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'K. Venkatesh', role: 'Legal Expert', organization: 'NLSIU Bengaluru', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { name: 'Sunita Deshmukh', role: 'Systems Architect', organization: 'NIC Land Informatics', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
    ],
    tasks: [
      { id: 'TSK-101', title: 'Synthesize State Title Indemnity draft bills (AP, Maharashtra, Haryana)', status: 'completed', assignee: 'Dr. Ananya Sharma', priority: 'high' },
      { id: 'TSK-102', title: 'Audit ULPIN vector polygon overlap error margins in hilly taluks', status: 'in_progress', assignee: 'Sunita Deshmukh', priority: 'high' },
      { id: 'TSK-103', title: 'Finalize compensation liability cap for Torrens state guarantee', status: 'todo', assignee: 'Rajeshwar Verma', priority: 'medium' },
      { id: 'TSK-104', title: 'Prepare presentation for Cabinet Committee on Economic Affairs', status: 'todo', assignee: 'K. Venkatesh', priority: 'high' },
    ],
    comments: [
      { id: 'C-01', author: 'Dr. Ananya Sharma', role: 'Researcher', time: 'Yesterday at 3:45 PM', text: 'We have compiled the empirical error rates from the 2024 pilot. Boundary overlap disputes dropped by 62% in villages with verified drone base maps.' },
      { id: 'C-02', author: 'Rajeshwar Verma, IAS', role: 'Government Official', time: 'Today at 10:15 AM', text: 'Excellent progress. Please align the indemnity model with the Department of Expenditure financial thresholds before the Friday briefing.' },
    ],
  },
  {
    id: 'WS-02',
    title: 'Climate-Resilient Land Zoning & Coastal Hazard Spatial Taskforce',
    description: 'Multi-institutional team developing GIS zoning overlays to prevent dangerous settlement expansion in floodplains and cyclone-prone coastal cadastral sectors.',
    category: 'Environmental & Climate Risk',
    leader: 'Dr. P. S. Roy (IIT Bombay / NRSC)',
    membersCount: 11,
    documentsCount: 19,
    recentActivity: 'Integrated Odisha coastal 50-year storm surge contour maps',
    members: [
      { name: 'Dr. P. S. Roy', role: 'Lead Climatologist', organization: 'IIT Bombay', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      { name: 'V. K. Dadhwal', role: 'Remote Sensing Chair', organization: 'NIDM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
      { name: 'Dr. Ananya Sharma', role: 'Policy Analyst', organization: 'CPR India', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
    ],
    tasks: [
      { id: 'TSK-201', title: 'Overlay CRZ-I and CRZ-II polygons on district cadastral layers', status: 'completed', assignee: 'Dr. P. S. Roy', priority: 'high' },
      { id: 'TSK-202', title: 'Model climate vulnerability score for 40 selected pilot districts', status: 'completed', assignee: 'V. K. Dadhwal', priority: 'medium' },
      { id: 'TSK-203', title: 'Draft zoning restrictions for Tehsildar non-agricultural conversion', status: 'in_progress', assignee: 'Dr. Ananya Sharma', priority: 'high' },
    ],
    comments: [
      { id: 'C-11', author: 'Dr. P. S. Roy', role: 'Lead Climatologist', time: '2 days ago', text: 'Puri and North 24 Parganas show acute parcel exposure. We need mandatory risk disclosures on RoR records.' },
    ],
  },
  {
    id: 'WS-03',
    title: 'Peri-Urban Agrarian Land Conversion & Land Pooling Innovation Hub',
    description: 'Analyzing urban expansion corridors around top-10 metro hubs; creating transparent land pooling models that protect farmer equity and prevent slum sprawl.',
    category: 'Urban-Rural Transition',
    leader: 'Prof. Ramesh Chand (NITI Aayog)',
    membersCount: 16,
    documentsCount: 34,
    recentActivity: 'Completed comparative study of Gujarat TP Schemes vs Amaravati pooling',
    members: [
      { name: 'Prof. Ramesh Chand', role: 'Lead Economist', organization: 'NITI Aayog', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { name: 'Vikram Singhania', role: 'Industry Representative', organization: 'CII Geospatial Council', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      { name: 'Ramesh Patel', role: 'Farmer Representative', organization: 'Kisan Agrarian Collective', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    ],
    tasks: [
      { id: 'TSK-301', title: 'Compile farmer compensation satisfaction metrics across 5 states', status: 'completed', assignee: 'Ramesh Patel', priority: 'high' },
      { id: 'TSK-302', title: 'Formulate standard infrastructure return ratio guidelines', status: 'in_progress', assignee: 'Prof. Ramesh Chand', priority: 'medium' },
      { id: 'TSK-303', title: 'Validate proptech spatial valuation models with market deed data', status: 'todo', assignee: 'Vikram Singhania', priority: 'medium' },
    ],
    comments: [
      { id: 'C-21', author: 'Vikram Singhania', role: 'Industry Expert', time: '3 days ago', text: 'Real estate developers are ready to adopt standardized pooling schemas if title approvals are digitized and guaranteed within 60 days.' },
    ],
  },
  {
    id: 'WS-04',
    title: 'AI in Revenue Courts: Fast-Track Dispute Triage & NLP Deed Extraction',
    description: 'Developing open-source machine learning models to classify pending land litigation, extract encumbrances from handwritten deeds, and flag fraudulent double-mortgages.',
    category: 'LegalTech & AI',
    leader: 'IIT Kanpur & NIC Judicial Informatics Division',
    membersCount: 9,
    documentsCount: 15,
    recentActivity: 'Trained IndicBERT on 50,000 bilingual land mutation dispute orders',
    members: [
      { name: 'IIT Kanpur AI Team', role: 'ML Research Lead', organization: 'IIT Kanpur', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { name: 'Sunita Deshmukh', role: 'NIC Liaison', organization: 'NIC', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
    ],
    tasks: [
      { id: 'TSK-401', title: 'Benchmarking OCR accuracy on 1960-1990 Urdu/Hindi Jamabandi records', status: 'in_progress', assignee: 'IIT Kanpur AI Team', priority: 'high' },
      { id: 'TSK-402', title: 'Integrate automated cause-list recommendation engine with e-Courts API', status: 'todo', assignee: 'Sunita Deshmukh', priority: 'high' },
    ],
    comments: [
      { id: 'C-31', author: 'IIT Kanpur AI Team', role: 'Researcher', time: '4 days ago', text: 'Character recognition accuracy for cursive Hindi Patwari notes has reached 91.4% with synthetic augmentation.' },
    ],
  },
];
