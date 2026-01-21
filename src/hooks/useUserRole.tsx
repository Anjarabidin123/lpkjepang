
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AppModule, ModulePermission } from '@/types/permissions';
import { PermissionService } from '@/services/rbac/permissionService';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setPermissions([]);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch legacy role for backward compatibility
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
        } else {
          setRole(roleData?.role || 'user');
        }

        // Fetch new flexible permissions
        try {
          const userPermissions = await PermissionService.getUserPermissions(user.id);
          setPermissions(userPermissions.map(p => p.name));
        } catch (permError) {
          console.error('Error fetching user permissions:', permError);
          setPermissions([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setRole('user');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';
  const isSuperAdmin = permissions.includes('system_management.update');

  const checkModulePermission = async (module: AppModule): Promise<ModulePermission | null> => {
    if (!user) return null;

    // Since get_user_module_permissions function doesn't exist, return a basic permission structure
    // based on existing permissions
    const modulePermissions = permissions.filter(p => p.startsWith(`${module}.`));
    
    if (modulePermissions.length === 0) return null;

    return {
      module,
      permissions: modulePermissions,
      can_view: modulePermissions.includes(`${module}.view`) || isAdmin,
      can_create: modulePermissions.includes(`${module}.create`) || isAdmin,
      can_update: modulePermissions.includes(`${module}.update`) || isAdmin,
      can_delete: modulePermissions.includes(`${module}.delete`) || isAdmin,
    };
  };

  const hasPermission = (permissionName: string): boolean => {
    return permissions.includes(permissionName);
  };

  const canAccessModule = (moduleName: string): boolean => {
    return permissions.some(permission => permission.startsWith(`${moduleName}.`));
  };

  return { 
    role, 
    permissions,
    isAdmin, 
    isModerator,
    isSuperAdmin,
    loading, 
    checkModulePermission,
    hasPermission,
    canAccessModule
  };
}
