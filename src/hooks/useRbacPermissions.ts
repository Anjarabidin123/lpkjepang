
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PermissionService } from '@/services/rbac/permissionService';
import { Permission } from '@/types/rbac';

export function useRbacPermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByModule, setPermissionsByModule] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const [fetchedPermissions, groupedPermissions] = await Promise.all([
        PermissionService.fetchPermissions(),
        PermissionService.fetchPermissionsByModule()
      ]);
      
      setPermissions(fetchedPermissions);
      setPermissionsByModule(groupedPermissions);
      console.log('Permissions fetched successfully:', fetchedPermissions.length);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserPermission = async (userId: string, permissionName: string): Promise<boolean> => {
    try {
      return await PermissionService.checkUserPermission(userId, permissionName);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  const getUserPermissions = async (userId: string): Promise<Permission[]> => {
    try {
      return await PermissionService.getUserPermissions(userId);
    } catch (error) {
      console.error('Error getting user permissions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get user permissions",
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    permissionsByModule,
    loading,
    fetchPermissions,
    checkUserPermission,
    getUserPermissions
  };
}
