
// Legacy permissions types for backward compatibility
export type AppRole = 'admin' | 'moderator' | 'user' | 'rekrutment';

// New flexible permissions types
export type AppModule = 
  | 'user_management' 
  | 'role_management' 
  | 'system_management'
  | 'lpk_mitra'
  | 'master_data'
  | 'operasional'
  | 'transaksi'
  | 'dashboard'
  | 'siswa'
  | 'kumiai'
  | 'perusahaan'
  | 'program'
  | 'jenis_kerja'
  | 'posisi_kerja';

export interface ModulePermission {
  module: AppModule;
  permissions: string[];
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// Add RolePermission interface for backward compatibility
export interface RolePermission {
  role: AppRole;
  module: AppModule;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// Helper functions for role display
export const getDisplayRoleName = (roleKey: string): string => {
  const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    moderator: 'Moderator',
    user: 'User',
    rekrutment: 'Rekrutmen',
    super_admin: 'Super Administrator',
  };
  return ROLE_LABELS[roleKey] || roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
};

export const getRoleKey = (roleKey: string): string => {
  return roleKey;
};

// Helper to check if role is system role
export const isSystemRole = (roleKey: string): boolean => {
  return ['admin', 'moderator', 'user', 'rekrutment', 'super_admin'].includes(roleKey);
};

// Permission checking utilities
export const checkPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const checkModuleAccess = (userPermissions: string[], module: string): boolean => {
  return userPermissions.some(permission => permission.startsWith(`${module}.`));
};
