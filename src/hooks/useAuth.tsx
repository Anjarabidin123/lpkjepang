
import { endpoints } from '@/config/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  last_sign_in_at?: string;
  app_metadata?: Record<string, any>;
  aud?: string;
  created_at?: string;
}

interface AuthError {
  message: string;
  name: string;
}

export interface LocalSession {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: LocalSession | null;
  loading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    console.log('Initializing Laravel API auth...');
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSession({ user: parsedUser, access_token: token } as any);

        // Restore role from stored user data
        if (parsedUser.roles && parsedUser.roles.length > 0) {
          setUserRole(parsedUser.roles[0]);
        } else {
          setUserRole('student');
        }
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in to Laravel API...', email);
      setLoading(true);

      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        return { error: { message: data.message || 'Login failed', name: 'AuthError' } };
      }

      // Login Sukses
      // Extract roles names
      const roles = data.user.roles && data.user.roles.length > 0
        ? data.user.roles.map((r: any) => r.name)
        : ['student']; // Default fallback role

      const userData = {
        id: data.user.id.toString(),
        email: data.user.email,
        full_name: data.user.name,
        avatar_url: null,
        roles: roles
      };

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData as any);
      setSession({ user: userData, access_token: data.access_token } as any);
      setUserRole(roles[0]); // Primary role for simple checks

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      setLoading(false);
      return { error: { message: 'Network Error', name: 'UnexpectedError' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    return { error: { message: 'Registration disabled', name: 'AuthError' } };
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(endpoints.auth.logout, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setSession(null);
      setUserRole(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
