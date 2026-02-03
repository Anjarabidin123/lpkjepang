
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';
import { Save, Edit2, Eye, EyeOff, Shield, AlertTriangle, Lock } from 'lucide-react';
import { SecurityService } from '@/services/securityService';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChange() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const passwordStrength = SecurityService.checkPasswordStrength(passwordData.newPassword);
  const passwordValidation = SecurityService.validatePassword(passwordData.newPassword);

  const validatePasswords = (): string[] => {
    const errors: string[] = [];

    if (!passwordData.currentPassword) {
      errors.push('Current password is required');
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      errors.push('Please fill in all password fields');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push('New passwords do not match');
    }

    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    if (SecurityService.isCommonPassword(passwordData.newPassword)) {
      errors.push('Please choose a less common password for better security');
    }

    if (passwordData.newPassword.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    return errors;
  };

  const handlePasswordUpdate = async () => {
    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      toast({
        title: "Password Requirements Not Met",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Log password change attempt
      await SecurityService.logSecurityEvent({
        event_type: 'password_change_attempt',
        event_details: {
          timestamp: new Date().toISOString(),
          password_strength: passwordStrength.score
        }
      });

      // Update password using Laravel API
      const response = await authFetch(endpoints.auth.changePassword, {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          new_password_confirmation: passwordData.confirmPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      // Log successful password change
      await SecurityService.logSecurityEvent({
        event_type: 'password_changed',
        event_details: {
          timestamp: new Date().toISOString(),
          password_strength: passwordStrength.score
        }
      });

      toast({
        title: "Success",
        description: "Password updated successfully with enhanced security",
      });

      // Reset form and exit editing mode
      setIsEditing(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });

    } catch (error) {
      console.error('Error updating password:', error);

      await SecurityService.logSecurityEvent({
        event_type: 'password_change_failed',
        event_details: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    setIsEditing(false);
  };

  const isFormValid = () => {
    return passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordValidation.isValid &&
      passwordData.newPassword === passwordData.confirmPassword &&
      !SecurityService.isCommonPassword(passwordData.newPassword);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Change Password'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Enhanced Security Requirements:</strong>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                  <li>Minimum 8 characters with uppercase, lowercase, numbers, and special characters</li>
                  <li>Avoid common passwords</li>
                  <li>Strong passwords help protect your account</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="currentPassword">Current Password *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: SecurityService.sanitizeInput(e.target.value)
                    }))}
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: SecurityService.sanitizeInput(e.target.value)
                    }))}
                    placeholder="Enter new secure password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {passwordData.newPassword && (
                  <div className="mt-2 space-y-2">
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

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: SecurityService.sanitizeInput(e.target.value)
                    }))}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {!passwordValidation.isValid && passwordData.newPassword && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Password Requirements Not Met:</strong>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    {passwordValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {SecurityService.isCommonPassword(passwordData.newPassword) && passwordData.newPassword && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This password is too common. Please choose a more unique password for better security.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handlePasswordUpdate}
                disabled={isLoading || !isFormValid()}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Updating...' : 'Update Password Securely'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">Click "Change Password" to update your password with enhanced security requirements</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Security Enhanced</p>
                  <p>Password changes now require strong passwords and comprehensive validation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
