
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { AdminSetupSuccess } from './SecureAdminSetup/AdminSetupSuccess';
import { AdminSetupForm } from './SecureAdminSetup/AdminSetupForm';
import { useAdminSetup } from '@/hooks/useAdminSetup';

export default function SecureAdminSetup() {
  const [email, setEmail] = useState('superadmin@lpkujc.com');
  const [password, setPassword] = useState('1234qwer');
  const [confirmPassword, setConfirmPassword] = useState('1234qwer');
  const [success, setSuccess] = useState(false);
  
  const { loading, createSecureAdminUser } = useAdminSetup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createSecureAdminUser(email, password, confirmPassword);
    if (result) {
      setSuccess(true);
    }
  };

  if (success) {
    return <AdminSetupSuccess email={email} password={password} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle>Create Super Admin Account</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminSetupForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
