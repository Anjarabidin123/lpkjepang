// localStorage-based authentication system

import { generateId, getFromStorage, setToStorage, getStorageKey } from './core';

export interface LocalUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalUserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface LocalSession {
  user: Omit<LocalUser, 'password_hash'>;
  access_token: string;
  expires_at: number;
}

const USERS_KEY = 'users';
const USER_ROLES_KEY = 'user_roles';
const SESSION_KEY = 'session';

// Simple hash function for demo purposes (NOT SECURE for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function getUsers(): LocalUser[] {
  return getFromStorage<LocalUser>(USERS_KEY);
}

export function getUserRoles(): LocalUserRole[] {
  return getFromStorage<LocalUserRole>(USER_ROLES_KEY);
}

export function getSession(): LocalSession | null {
  try {
    const stored = localStorage.getItem(getStorageKey(SESSION_KEY));
    if (!stored) return null;
    const session: LocalSession = JSON.parse(stored);
    
    // Check if session expired
    if (session.expires_at < Date.now()) {
      localStorage.removeItem(getStorageKey(SESSION_KEY));
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function setSession(session: LocalSession | null): void {
  if (session) {
    localStorage.setItem(getStorageKey(SESSION_KEY), JSON.stringify(session));
  } else {
    localStorage.removeItem(getStorageKey(SESSION_KEY));
  }
}

export async function signUp(email: string, password: string, fullName?: string): Promise<{ user: Omit<LocalUser, 'password_hash'> | null; error: string | null }> {
  const users = getUsers();
  
  // Check if email exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { user: null, error: 'Email sudah terdaftar' };
  }
  
  const newUser: LocalUser = {
    id: generateId(),
    email: email.toLowerCase(),
    password_hash: simpleHash(password),
    full_name: fullName || null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  setToStorage(USERS_KEY, users);
  
  // Create default user role
  const roles = getUserRoles();
  const newRole: LocalUserRole = {
    id: generateId(),
    user_id: newUser.id,
    role: 'user',
    created_at: new Date().toISOString(),
  };
  roles.push(newRole);
  setToStorage(USER_ROLES_KEY, roles);
  
  const { password_hash, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, error: null };
}

export async function signIn(email: string, password: string): Promise<{ user: Omit<LocalUser, 'password_hash'> | null; error: string | null }> {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return { user: null, error: 'Email atau password salah' };
  }
  
  if (user.password_hash !== simpleHash(password)) {
    return { user: null, error: 'Email atau password salah' };
  }
  
  const { password_hash, ...userWithoutPassword } = user;
  
  // Create session
  const session: LocalSession = {
    user: userWithoutPassword,
    access_token: generateId(),
    expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  
  setSession(session);
  
  return { user: userWithoutPassword, error: null };
}

export async function signOut(): Promise<void> {
  setSession(null);
}

export function getUserRole(userId: string): string | null {
  const roles = getUserRoles();
  const role = roles.find(r => r.user_id === userId);
  return role?.role || null;
}

export function updateUserRole(userId: string, newRole: string): boolean {
  const roles = getUserRoles();
  const index = roles.findIndex(r => r.user_id === userId);
  
  if (index === -1) {
    // Create new role
    const newRoleEntry: LocalUserRole = {
      id: generateId(),
      user_id: userId,
      role: newRole,
      created_at: new Date().toISOString(),
    };
    roles.push(newRoleEntry);
  } else {
    roles[index].role = newRole;
  }
  
  setToStorage(USER_ROLES_KEY, roles);
  return true;
}

export function deleteUser(userId: string): boolean {
  // Delete user
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  setToStorage(USERS_KEY, filteredUsers);
  
  // Delete user roles
  const roles = getUserRoles();
  const filteredRoles = roles.filter(r => r.user_id !== userId);
  setToStorage(USER_ROLES_KEY, filteredRoles);
  
  return true;
}

export function initializeDefaultAdmin(): void {
  const users = getUsers();
  const roles = getUserRoles();
  
  const demoAdmins = [
    { email: 'admin@lpk.local', fullName: 'Administrator', password: 'admin123' },
    { email: 'admin@demo.com', fullName: 'Demo Admin', password: 'admin123' },
    { email: 'superadmin@lpkujc.com', fullName: 'Super Admin', password: '1234qwer' }
  ];

  let storageUpdated = false;

  demoAdmins.forEach(admin => {
    if (!users.some(u => u.email.toLowerCase() === admin.email.toLowerCase())) {
      const adminUser: LocalUser = {
        id: generateId(),
        email: admin.email,
        password_hash: simpleHash(admin.password),
        full_name: admin.fullName,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      users.push(adminUser);
      
      const adminRole: LocalUserRole = {
        id: generateId(),
        user_id: adminUser.id,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      roles.push(adminRole);
      
      console.log(`Default admin created: ${admin.email} / admin123`);
      storageUpdated = true;
    }
  });

  if (storageUpdated) {
    setToStorage(USERS_KEY, users);
    setToStorage(USER_ROLES_KEY, roles);
  }
}
