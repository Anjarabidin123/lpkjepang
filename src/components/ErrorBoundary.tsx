
import React from 'react';
import { Alert, AlertTitle, Container, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a fallback component is provided, use it
      if (this.props.fallback && this.state.error) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <Container maxWidth="md">
          <Box sx={{ mt: 4 }}>
            <Alert severity="error">
              <AlertTitle>Something went wrong</AlertTitle>
              {this.state.error?.message || 'An unexpected error occurred'}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </Box>
            </Alert>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Export DataErrorFallback component for compatibility
export function DataErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Data Loading Error</AlertTitle>
          {error.message || 'Failed to load data'}
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={retry}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>
        </Alert>
      </Box>
    </Container>
  );
}
