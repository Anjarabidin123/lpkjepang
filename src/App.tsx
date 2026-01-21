import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import Auth from "@/pages/Auth";
import { DashboardLayout } from "@/components/DashboardLayout";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
        } 
      />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <DashboardLayout />
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <HoverReceiver />
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </>
);

export default App;