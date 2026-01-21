
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, loading } = useAuth();

  console.log('ProtectedRoute state:', {
    user: !!user,
    session: !!session,
    loading,
    userEmail: user?.email,
    pathname: window.location.pathname
  });

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <LoadingSpinner size={60} />
      </Box>
    );
  }

  if (!user || !session) {
    console.log('No authenticated user, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
