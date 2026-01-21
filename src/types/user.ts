
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  user_roles?: UserRole[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user' | 'rekrutment' | 'custom';
  custom_role_name?: string;
  created_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role?: string; // Changed to string to support flexible roles
  is_active?: boolean;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
}
