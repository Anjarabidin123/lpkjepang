
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index page - user authenticated:', !!user, 'loading:', loading);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    console.log('User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If no user, redirect to auth
  console.log('No user found, redirecting to auth');
  return <Navigate to="/auth" replace />;
};

export default Index;
