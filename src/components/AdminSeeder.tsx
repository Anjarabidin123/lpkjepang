
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSeeder() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      console.log('Creating admin user:', email);
      
      // First create the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        toast({
          title: "Error creating user",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      console.log('User created:', data.user?.id);

      if (data.user) {
        // Assign admin role to the user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          toast({
            title: "User created but role assignment failed",
            description: roleError.message,
            variant: "destructive",
          });
        } else {
          console.log('Admin role assigned successfully');
          setSuccess(true);
          toast({
            title: "Admin user created successfully!",
            description: `Admin user ${email} has been created. Check your email to confirm the account.`,
          });
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Admin Created!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your admin user has been created successfully. Please check your email to confirm your account.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800">Next Steps:</p>
                <ol className="text-sm text-blue-700 mt-1 list-decimal list-inside space-y-1">
                  <li>Check your email and click the confirmation link</li>
                  <li>Go to the login page to sign in</li>
                  <li>Access the dashboard with admin privileges</li>
                </ol>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="w-full"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Create Admin User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createAdminUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@lpkujc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Strong password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> This admin user will have full access to all data and features in the system.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Admin...' : 'Create Admin User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
