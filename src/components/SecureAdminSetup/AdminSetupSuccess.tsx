
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminSetupSuccessProps {
  email: string;
  password: string;
}

export function AdminSetupSuccess({ email, password }: AdminSetupSuccessProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800">Super Admin Ready!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-green-800">Admin Account Ready!</p>
              <p className="text-sm text-green-700">Your super admin account has been set up successfully.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800 mb-2">Login Credentials:</p>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Password:</strong> {password}</p>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">Next Steps:</p>
          <ol className="text-sm text-amber-700 list-decimal list-inside space-y-1">
            <li>Go to the Login tab</li>
            <li>Sign in with the credentials above</li>
            <li>Access all system modules as super admin</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
