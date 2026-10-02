import React, { createContext, useContext, useState } from 'react';
import {
  Resource,
  District,
  Parcel,
  Policy,
  Workspace,
  InnovationItem,
  DataSource,
  ApiEndpoint,
  AuditLog,
} from '../types';
import { INITIAL_RESOURCES } from '../data/resources';
import { DISTRICTS_DATA } from '../data/districts';
import { INITIAL_PARCELS } from '../data/parcels';
import { POLICIES_DATA } from '../data/policies';
import { INITIAL_WORKSPACES } from '../data/workspaces';
import { INITIAL_INNOVATION_ITEMS } from '../data/innovation';
import { INITIAL_DATA_SOURCES } from '../data/dataSources';
import { API_ENDPOINTS } from '../data/apiCatalog';
import { INITIAL_AUDIT_LOGS } from '../data/auditLogs';

interface DataContextType {
  resources: Resource[];
  districts: District[];
  parcels: Parcel[];
  policies: Policy[];
  workspaces: Workspace[];
  innovationItems: InnovationItem[];
  dataSources: DataSource[];
  apiEndpoints: ApiEndpoint[];
  auditLogs: AuditLog[];
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  addResource: (resource: Omit<Resource, 'id' | 'citationsCount' | 'downloadsCount' | 'dateAdded'>) => void;
  submitInnovationProposal: (itemId: string, proposal: { teamName: string; email: string; abstract: string }) => void;
  addWorkspaceComment: (workspaceId: string, text: string, author: string, role: string) => void;
  toggleWorkspaceTask: (workspaceId: string, taskId: string) => void;
  recordAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  syncDataSource: (sourceId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [districts] = useState<District[]>(DISTRICTS_DATA);
  const [parcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [policies] = useState<Policy[]>(POLICIES_DATA);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [innovationItems, setInnovationItems] = useState<InnovationItem[]>(INITIAL_INNOVATION_ITEMS);
  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [apiEndpoints] = useState<ApiEndpoint[]>(API_ENDPOINTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const addResource = (newResData: Omit<Resource, 'id' | 'citationsCount' | 'downloadsCount' | 'dateAdded'>) => {
    const id = `RES-${String(resources.length + 1).padStart(2, '0')}`;
    const newRes: Resource = {
      ...newResData,
      id,
      citationsCount: 0,
      downloadsCount: 1,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setResources(prev => [newRes, ...prev]);

    // Record audit log
    recordAuditLog({
      user: 'Current User',
      role: 'researcher',
      action: 'UPLOAD_RESOURCE',
      resource: `${id}: ${newRes.title}`,
      classification: newRes.classification,
      ipAddress: '127.0.0.1 (Local Session)',
      status: 'success',
    });
  };

  const submitInnovationProposal = (itemId: string, proposal: { teamName: string; email: string; abstract: string }) => {
    setInnovationItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, submissionsCount: item.submissionsCount + 1 }
          : item
      )
    );
    recordAuditLog({
      user: proposal.teamName,
      role: 'industry',
      action: 'SUBMIT_INNOVATION_APPLICATION',
      resource: itemId,
      classification: 'public',
      ipAddress: '127.0.0.1 (Portal)',
      status: 'success',
    });
  };

  const addWorkspaceComment = (workspaceId: string, text: string, author: string, role: string) => {
    const newComment = {
      id: `C-${Date.now()}`,
      author,
      role,
      time: 'Just now',
      text,
    };
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.id === workspaceId
          ? { ...ws, comments: [newComment, ...ws.comments] }
          : ws
      )
    );
  };

  const toggleWorkspaceTask = (workspaceId: string, taskId: string) => {
    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.id !== workspaceId) return ws;
        return {
          ...ws,
          tasks: ws.tasks.map(t => {
            if (t.id !== taskId) return t;
            const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
            return { ...t, status: nextStatus };
          }),
        };
      })
    );
  };

  const recordAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const syncDataSource = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(ds =>
        ds.id === sourceId
          ? { ...ds, status: 'operational', lastSync: 'Just now', latencyMs: Math.floor(Math.random() * 80 + 70) }
          : ds
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        resources,
        districts,
        parcels,
        policies,
        workspaces,
        innovationItems,
        dataSources,
        apiEndpoints,
        auditLogs,
        language,
        setLanguage,
        addResource,
        submitInnovationProposal,
        addWorkspaceComment,
        toggleWorkspaceTask,
        recordAuditLog,
        syncDataSource,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
