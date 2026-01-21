
import React, { useEffect } from 'react';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SiswaRegulerContent } from "@/components/SiswaReguler/SiswaRegulerContent";
import { useSiswaMagang } from "@/hooks/useSiswaMagang";

export default function SiswaReguler() {
  const { refetch } = useSiswaMagang();

  // Enhanced real-time data synchronization
  useEffect(() => {
    // Initial data fetch when component mounts
    refetch();
    
    // Set up periodic refresh with exponential backoff for error recovery
    let retryCount = 0;
    const maxRetries = 5;
    
    const setupPeriodicRefresh = () => {
      const interval = setInterval(async () => {
        try {
          await refetch();
          retryCount = 0; // Reset retry count on success
        } catch (error) {
          console.error('Periodic refresh failed:', error);
          retryCount++;
          
          if (retryCount >= maxRetries) {
            console.warn('Max retries reached, stopping periodic refresh');
            clearInterval(interval);
          }
        }
      }, 30000); // Refresh every 30 seconds

      return interval;
    };

    const interval = setupPeriodicRefresh();

    // Handle visibility change for better performance
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refetch when page becomes visible again
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  return (
    <ErrorBoundary>
      <SiswaRegulerContent />
    </ErrorBoundary>
  );
}
