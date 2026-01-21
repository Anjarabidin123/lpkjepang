
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getSession, 
  signIn as localSignIn, 
  signUp as localSignUp, 
  signOut as localSignOut,
  initializeLocalStorage,
  LocalSession,
  getUserRole
} from '@/lib/localStorage';

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
    console.log('Initializing localStorage auth...');
    
    // Initialize localStorage database
    initializeLocalStorage();
    
    // Check for existing session
    const existingSession = getSession();
    console.log('Existing session:', existingSession ? 'Found' : 'None');
    
    if (existingSession) {
      setSession(existingSession);
      setUser(existingSession.user as User);
      const role = getUserRole(existingSession.user.id);
      setUserRole(role || 'user');
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      setLoading(true);
      
      const result = await localSignIn(email, password);
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        setLoading(false);
        return { error: { message: result.error, name: 'AuthError' } as AuthError };
      }

      if (result.user) {
        const newSession = getSession();
        setSession(newSession);
        setUser(result.user as User);
        const role = getUserRole(result.user.id);
        setUserRole(role || 'user');
        console.log('Sign in successful:', result.user.email);
      }
      
      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      setLoading(false);
      return { 
        error: { 
          message: 'An unexpected error occurred during sign in',
          name: 'UnexpectedError'
        } as AuthError 
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await localSignUp(email, password);
      
      if (result.error) {
        return { error: { message: result.error, name: 'AuthError' } as AuthError };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { 
        error: { 
          message: 'An unexpected error occurred during sign up',
          name: 'UnexpectedError'
        } as AuthError 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      await localSignOut();
      setUser(null);
      setSession(null);
      setUserRole(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
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
