
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityService } from '@/services/securityService';

export function useAdminSetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSecureAdminUser = async (email: string, password: string, confirmPassword: string) => {
    setLoading(true);

    try {
      // Enhanced validation
      if (!SecurityService.validateEmail(email)) {
        toast({
          title: "Email Tidak Valid",
          description: "Silakan masukkan alamat email yang valid",
          variant: "destructive",
        });
        return false;
      }

      const isPasswordValid = SecurityService.validatePassword(password).isValid;
      if (!isPasswordValid) {
        toast({
          title: "Password Lemah",
          description: "Silakan buat password yang lebih kuat sesuai persyaratan",
          variant: "destructive",
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Tidak Cocok",
          description: "Password dan konfirmasi password tidak sama",
          variant: "destructive",
        });
        return false;
      }

      console.log('Creating secure admin user:', email);
      
      // Sanitize inputs
      const sanitizedEmail = SecurityService.sanitizeInput(email);
      
      // Log admin creation attempt
      await SecurityService.logSecurityEvent({
        event_type: 'admin_creation_attempt',
        event_details: { 
          email: sanitizedEmail,
          timestamp: new Date().toISOString()
        }
      });

      // Try to create user using Supabase admin API
      console.log('Attempting to create user with admin API...');
      
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: sanitizedEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: 'Super Admin'
        }
      });

      if (createError) {
        console.error('User creation error:', createError);
        
        // Check if user already exists
        if (createError.message?.includes('already registered') || 
            createError.message?.includes('already exists') ||
            createError.message?.includes('User already registered')) {
          toast({
            title: "User Sudah Ada",
            description: `User ${sanitizedEmail} sudah terdaftar. Anda dapat coba login dengan kredensial yang diberikan.`,
            variant: "default",
          });
          return true;
        } else {
          await SecurityService.logFailedLogin(sanitizedEmail, createError.message);
          throw createError;
        }
      }

      if (!userData?.user) {
        throw new Error('Failed to create user - no user data returned');
      }

      console.log('User created successfully:', userData.user.id);

      // Create/update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          full_name: 'Super Admin',
          email: sanitizedEmail,
          is_active: true
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue with role assignment even if profile creation fails
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userData.user.id,
          role: 'admin'
        }, {
          onConflict: 'user_id,role'
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        toast({
          title: "User dibuat tapi role assignment gagal",
          description: roleError.message,
          variant: "destructive",
        });
        return false;
      } else {
        console.log('Admin role assigned successfully');
        
        // Log successful admin creation
        await SecurityService.logSecurityEvent({
          event_type: 'admin_created',
          event_details: { 
            created_user_id: userData.user.id,
            created_user_email: sanitizedEmail,
            timestamp: new Date().toISOString()
          }
        });
        
        toast({
          title: "Super Admin Berhasil Dibuat!",
          description: `Admin user berhasil dibuat: ${sanitizedEmail}`,
        });
        return true;
      }

    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan yang tidak terduga.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSecureAdminUser
  };
}
