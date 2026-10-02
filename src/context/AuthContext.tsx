import React, { createContext, useContext, useState, useMemo } from 'react';
import { User, Role } from '../types/index';
import { PermissionMatrix, getPermissions } from '../types/auth';

interface AuthContextType {
  currentUser: User;
  activeRole: Role;
  permissions: PermissionMatrix;
  setRole: (role: Role, salesmanId?: string) => void;
  isSuperAdmin: boolean;
  isJunior: boolean;
}

const DEFAULT_SUPER_ADMIN: User = {
  id: 'admin-super',
  name: 'Rajesh Sen (Director)',
  email: 'admin@graminmart.in',
  phone: '+919830012345',
  role: 'SUPER_ADMIN',
};

const DEFAULT_JUNIOR: User = {
  id: 'user-rahul',
  name: 'Rahul Kumar (Field Junior)',
  email: 'rahul.kumar@graminmart.in',
  phone: '+919876543210',
  role: 'JUNIOR',
  salesmanId: 'sm-rahul',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_SUPER_ADMIN);

  const permissions = useMemo(() => getPermissions(currentUser.role), [currentUser.role]);

  const setRole = (role: Role, salesmanId?: string) => {
    if (role === 'SUPER_ADMIN') {
      setCurrentUser(DEFAULT_SUPER_ADMIN);
    } else {
      setCurrentUser({
        ...DEFAULT_JUNIOR,
        salesmanId: salesmanId || 'sm-rahul',
      });
    }
  };

  const value: AuthContextType = {
    currentUser,
    activeRole: currentUser.role,
    permissions,
    setRole,
    isSuperAdmin: currentUser.role === 'SUPER_ADMIN',
    isJunior: currentUser.role === 'JUNIOR',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
