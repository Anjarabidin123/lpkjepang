
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoleService } from '@/services/rbac/roleService';
import { Role, CreateRoleData, UpdateRoleData, RoleWithPermissions } from '@/types/rbac';

export function useRbacRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const fetchedRoles = await RoleService.fetchRoles();
      setRoles(fetchedRoles);
      console.log('Roles fetched successfully:', fetchedRoles.length);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleWithPermissions = async (roleId: string): Promise<RoleWithPermissions | null> => {
    try {
      return await RoleService.fetchRoleWithPermissions(roleId);
    } catch (error) {
      console.error('Error fetching role with permissions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch role details",
        variant: "destructive",
      });
      return null;
    }
  };

  const createRole = async (roleData: CreateRoleData): Promise<boolean> => {
    try {
      setCreating(true);
      const success = await RoleService.createRole(roleData);
      if (success) {
        toast({
          title: "Success",
          description: "Role created successfully",
        });
        await fetchRoles();
      }
      return success;
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create role",
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateRole = async (roleId: string, updates: UpdateRoleData): Promise<boolean> => {
    try {
      setUpdating(true);
      const success = await RoleService.updateRole(roleId, updates);
      if (success) {
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
        await fetchRoles();
      }
      return success;
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update role",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteRole = async (roleId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      const success = await RoleService.deleteRole(roleId);
      if (success) {
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
        await fetchRoles();
      }
      return success;
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    
    const unsubscribe = RoleService.subscribeToRoles((updatedRoles) => {
      setRoles(updatedRoles);
    });

    return unsubscribe;
  }, []);

  return {
    roles,
    loading,
    creating,
    updating,
    deleting,
    fetchRoles,
    fetchRoleWithPermissions,
    createRole,
    updateRole,
    deleteRole
  };
}
