import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Classification } from '../types';
import { DEMO_USERS } from '../data/users';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  loginAs: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
  canViewClassification: (classification: Classification) => boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, { modules: string[]; classifications: Classification[] }> = {
  admin: {
    modules: ['dashboard', 'repository', 'search', 'workspaces', 'gis', 'records', 'analytics', 'simulation', 'ailab', 'innovation', 'integration', 'apidocs', 'admin'],
    classifications: ['public', 'restricted', 'confidential'],
  },
  official: {
    modules: ['dashboard', 'repository', 'search', 'workspaces', 'gis', 'records', 'analytics', 'simulation', 'ailab', 'innovation', 'integration', 'apidocs'],
    classifications: ['public', 'restricted', 'confidential'],
  },
  researcher: {
    modules: ['dashboard', 'repository', 'search', 'workspaces', 'gis', 'records', 'analytics', 'ailab', 'innovation', 'apidocs'],
    classifications: ['public', 'restricted'],
  },
  industry: {
    modules: ['dashboard', 'repository', 'search', 'workspaces', 'gis', 'records', 'analytics', 'innovation', 'apidocs'],
    classifications: ['public'],
  },
  public: {
    modules: ['dashboard', 'repository', 'search', 'gis', 'records', 'innovation'],
    classifications: ['public'],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('bhuniti_user_role');
    return (saved as UserRole) || 'official';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => DEMO_USERS[currentRole] || DEMO_USERS.official);

  useEffect(() => {
    localStorage.setItem('bhuniti_user_role', currentRole);
    setCurrentUser(DEMO_USERS[currentRole] || DEMO_USERS.official);
  }, [currentRole]);

  const loginAs = (role: UserRole) => {
    setCurrentRole(role);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const canAccess = (module: string): boolean => {
    const perms = ROLE_PERMISSIONS[currentRole];
    if (!perms) return false;
    return perms.modules.includes(module.toLowerCase());
  };

  const canViewClassification = (classification: Classification): boolean => {
    const perms = ROLE_PERMISSIONS[currentRole];
    if (!perms) return false;
    return perms.classifications.includes(classification);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        loginAs,
        canAccess,
        canViewClassification,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
