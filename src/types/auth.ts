import { Role, User } from './index';

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeRole: Role;
}

export interface PermissionMatrix {
  canModifyMasterSales: boolean;
  canManageProducts: boolean;
  canManageSalesmen: boolean;
  canViewAllLeads: boolean;
  canViewAllSales: boolean;
  canUpdateCommissionLevels: boolean;
  canCreatePublicNotes: boolean;
  canRecordSale: boolean;
}

export const getPermissions = (role: Role): PermissionMatrix => {
  if (role === 'SUPER_ADMIN') {
    return {
      canModifyMasterSales: true,
      canManageProducts: true,
      canManageSalesmen: true,
      canViewAllLeads: true,
      canViewAllSales: true,
      canUpdateCommissionLevels: true,
      canCreatePublicNotes: true,
      canRecordSale: true,
    };
  }

  // JUNIOR / SALESMAN
  return {
    canModifyMasterSales: false, // Explicitly restricted
    canManageProducts: false,
    canManageSalesmen: false,
    canViewAllLeads: false, // Only assigned leads
    canViewAllSales: false, // Only own sales
    canUpdateCommissionLevels: false,
    canCreatePublicNotes: false,
    canRecordSale: true, // Junior can submit sale proposal
  };
};
