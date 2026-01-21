
// New flexible Role-Based Access Control types
export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  module: string;
  action: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
}

export interface UserWithRoles {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
}

export interface RoleWithPermissions extends Role {
  permissions?: Permission[];
}

export interface CreateRoleData {
  name: string;
  display_name: string;
  description?: string;
  permission_ids?: string[];
}

export interface UpdateRoleData {
  name?: string;
  display_name?: string;
  description?: string;
  is_active?: boolean;
  permission_ids?: string[];
}

export interface AssignRoleData {
  user_id: string;
  role_ids: string[];
}
