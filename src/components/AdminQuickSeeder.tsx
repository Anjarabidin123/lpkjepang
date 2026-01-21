
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, ExternalLink } from 'lucide-react';

export default function AdminQuickSeeder() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkExistingAdmin = async () => {
    setLoading(true);

    try {
      console.log('Checking for existing admin users...');
      
      // Check if any admin users exist
      const { data: adminRoles, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (error) {
        console.error('Error checking admin users:', error);
        toast({
          title: "Error",
          description: "Failed to check existing admin users",
          variant: "destructive",
        });
        return;
      }

      if (adminRoles && adminRoles.length > 0) {
        toast({
          title: "Admin Users Found",
          description: `Found ${adminRoles.length} existing admin user(s). Use the secure admin setup if you need to create additional administrators.`,
        });
      } else {
        toast({
          title: "No Admin Users Found",
          description: "No admin users found in the system. Please use the 'Admin Setup' tab to create your first secure admin account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while checking admin users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Admin Account Status</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-left">
              <p className="font-medium text-gray-800 mb-2">Security Update Notice:</p>
              <p className="text-sm text-gray-700 mb-2">
                This system has been updated with enhanced security measures. Hardcoded default credentials have been removed for your security.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Strong password requirements enforced</li>
                <li>Rate limiting for login attempts</li>
                <li>Enhanced input validation and sanitization</li>
                <li>Comprehensive security logging</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-800 mb-1">Secure Admin Setup</p>
              <p className="text-sm text-blue-700 mb-2">
                To create your first admin account, use the "Admin Setup" tab above. This will guide you through creating a secure administrator account with strong password requirements.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={checkExistingAdmin} className="w-full" disabled={loading}>
          {loading ? 'Checking Admin Status...' : 'Check Admin Account Status'}
        </Button>

        <div className="text-xs text-gray-500 mt-4">
          <p className="flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" />
            For security best practices, visit our documentation
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
