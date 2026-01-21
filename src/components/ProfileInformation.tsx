
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Edit2, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SecurityService } from '@/services/securityService';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserRole {
  id: string;
  role: string;
  created_at: string;
}

interface ProfileInformationProps {
  user: SupabaseUser;
  profileData: ProfileData;
  onProfileUpdate: (data: ProfileData) => void;
}

export function ProfileInformation({ user, profileData, onProfileUpdate }: ProfileInformationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Update formData when profileData changes
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  // Fetch user roles
  useEffect(() => {
    if (user) {
      fetchUserRoles();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    try {
      console.log('Fetching user roles for:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, role, created_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      setUserRoles(data || []);
      console.log('User roles fetched:', data);
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate email
    if (!formData.email || !SecurityService.validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate full name
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters long';
    }

    // Validate phone (if provided)
    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: SecurityService.sanitizeInput(value)
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    setFormData(profileData); // Reset to original data
    setValidationErrors({});
    setIsEditing(false);
  };

  const handleProfileUpdate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before saving",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating profile with data:', formData);
      
      // Log security event
      await SecurityService.logSecurityEvent({
        event_type: 'profile_update_attempt',
        event_details: { 
          user_id: user.id,
          updated_fields: Object.keys(formData)
        }
      });

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error('Failed to update profile');
      }

      // Update email in auth if it changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) {
          console.error('Email update error:', emailError);
          throw new Error('Failed to update email');
        }

        toast({
          title: "Email Update",
          description: "Check your new email for confirmation",
        });
      }

      // Log successful update
      await SecurityService.logSecurityEvent({
        event_type: 'profile_updated',
        event_details: { 
          user_id: user.id,
          updated_fields: Object.keys(formData)
        }
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsEditing(false);
      onProfileUpdate(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      await SecurityService.logSecurityEvent({
        event_type: 'profile_update_failed',
        event_details: { 
          user_id: user.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      case 'rekrutment': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
              className={validationErrors.full_name ? 'border-red-500' : ''}
            />
            {validationErrors.full_name && (
              <p className="text-sm text-red-600">{validationErrors.full_name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your email"
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your phone number"
              className={validationErrors.phone ? 'border-red-500' : ''}
            />
            {validationErrors.phone && (
              <p className="text-sm text-red-600">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        {/* User Roles */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            User Roles
          </Label>
          <div className="flex flex-wrap gap-2">
            {userRoles.length > 0 ? (
              userRoles.map((role) => (
                <Badge
                  key={role.id}
                  variant={getRoleBadgeVariant(role.role)}
                  className="capitalize"
                >
                  {role.role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No roles assigned</Badge>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Account Status</Label>
            <div className="flex items-center gap-2">
              <Badge variant={profileData.is_active ? "default" : "secondary"}>
                {profileData.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Member Since</Label>
            <p className="text-sm">{formatDate(profileData.created_at)}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
            <p className="text-sm">{formatDate(profileData.updated_at)}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">User ID</Label>
            <p className="text-sm font-mono text-gray-500">{user.id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={handleProfileUpdate} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
