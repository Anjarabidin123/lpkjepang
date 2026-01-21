
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { SecurityService } from '@/services/securityService';

interface AdminSetupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminSetupForm({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
}: AdminSetupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = SecurityService.checkPasswordStrength(password);
  const isPasswordValid = SecurityService.validatePassword(password).isValid;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Admin Email *</Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin-password">Admin Password *</Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {password && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password Strength:</span>
              <span style={{ color: passwordStrength.color }} className="font-medium">
                {passwordStrength.label}
              </span>
            </div>
            <Progress value={(passwordStrength.score / 5) * 100} className="h-2" />
            {passwordStrength.feedback.length > 0 && (
              <div className="text-xs text-gray-600">
                <ul className="list-disc list-inside space-y-1">
                  {passwordStrength.feedback.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-red-600">Passwords do not match</p>
        )}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Default Credentials:</strong>
          <div className="mt-1 text-sm">
            This form is pre-filled with default super admin credentials for quick setup.
            You can modify them or use as-is for testing.
          </div>
        </AlertDescription>
      </Alert>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !isPasswordValid || password !== confirmPassword}
      >
        {loading ? 'Creating Super Admin...' : 'Create Super Admin'}
      </Button>
    </form>
  );
}
