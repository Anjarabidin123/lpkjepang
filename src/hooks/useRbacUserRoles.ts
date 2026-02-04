
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserRoleService } from '@/services/rbac/userRoleService';
import { UserWithRoles, AssignRoleData } from '@/types/rbac';

export function useRbacUserRoles() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await UserRoleService.fetchUsersWithRoles();
      setUsers(fetchedUsers);
      console.log('Users with roles fetched successfully:', fetchedUsers.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRoles = async (assignData: AssignRoleData): Promise<boolean> => {
    try {
      setAssigning(true);
      const success = await UserRoleService.assignRolesToUser(assignData);
      if (success) {
        toast({
          title: "Success",
          description: "User roles updated successfully",
        });
        await fetchUsers();
      }
      return success;
    } catch (error) {
      console.error('Error assigning roles:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign roles",
        variant: "destructive",
      });
      return false;
    } finally {
      setAssigning(false);
    }
  };

  const getUserRoles = async (userId: string): Promise<string[]> => {
    try {
      return await UserRoleService.getUserRoles(userId);
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await UserRoleService.deleteUser(userId);
      if (success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        await fetchUsers();
      }
      return success;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const unsubscribe = UserRoleService.subscribeToUserRoles((updatedUsers) => {
      setUsers(updatedUsers);
    });

    return unsubscribe;
  }, []);

  return {
    users,
    loading,
    assigning,
    fetchUsers,
    assignRoles,
    getUserRoles,
    deleteUser
  };
}
