
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';
import { ProfileInformation } from '@/components/ProfileInformation';
import { PasswordChange } from '@/components/PasswordChange';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { SecurityService } from '@/services/securityService';
import { User, Shield, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileProfile } from '@/pages/student/MobileProfile';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching profile for user:', user.id);

      // Log profile access
      await SecurityService.logSecurityEvent({
        event_type: 'profile_access',
        event_details: { user_id: user.id }
      });

      // Use endpoints config
      const response = await authFetch(`${endpoints.auth.user}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user profile from API');
      }

      const data = await response.json();

      if (data) {
        console.log('Profile data found:', data);
        setProfileData({
          full_name: data.name || '',
          email: data.email || '',
          phone: '', // Phone might not be in basic user table yet, add to backend if needed
          avatar_url: '', // Add avatar_url to backend if needed
          is_active: true, // Assuming active if can login
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setError('Failed to load profile data from server');
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });

      // Fallback to local user data from useAuth if API fails
      if (user) {
        setProfileData({
          full_name: user.full_name || '',
          email: user.email || '',
          phone: '',
          avatar_url: '',
          is_active: true
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // createProfile is no longer needed as users are managed by backend
  const createProfile = async () => {
    console.warn("createProfile is deprecated in favor of Backend User Management");
  };

  const handleProfileUpdate = (updatedData: ProfileData) => {
    setProfileData(updatedData);

    // Refresh data from server to ensure consistency
    setTimeout(() => {
      fetchProfile();
    }, 1000);
  };

  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Use separate mobile view for student
  if (userRole === 'student' && isMobile) {
    return (
      <div className="p-2">
        <MobileProfile
          user={user}
          profileData={profileData}
          onProfileUpdate={handleProfileUpdate}
          userRole={userRole}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 sm:w-6 h-6" />
            Profile Settings
          </h1>
          <p className="text-sm text-gray-600">
            Manage your account information and security settings
          </p>
        </div>

        {userRole && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-slate-600 capitalize">
              Role: {userRole}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Profile Information Section */}
      <div className="space-y-6">
        <ProfileInformation
          user={user}
          profileData={profileData}
          onProfileUpdate={handleProfileUpdate}
        />

        <Separator />

        {/* Password Change Section */}
        <PasswordChange />

        <Separator />

        {/* Account Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Account Created</p>
                  <p className="text-gray-600">
                    {profileData.created_at
                      ? new Date(profileData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : 'Not available'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Last Login</p>
                  <p className="text-gray-600">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : 'Not available'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Email Verified</p>
                  <p className="text-gray-600">
                    {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-gray-700">User ID</p>
                  <p className="text-gray-600 font-mono text-xs break-all">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
