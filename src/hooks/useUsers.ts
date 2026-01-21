
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/userService';
import { useUserOperations } from '@/hooks/useUserOperations';
import { UserProfile } from '@/types/user';

// Re-export types for backward compatibility
export type { UserProfile, CreateUserData, UpdateUserData } from '@/types/user';

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const { toast } = useToast();
  const userOperations = useUserOperations();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await UserService.fetchUsers();
      setUsers(fetchedUsers);
      console.log('Users fetched and synced:', fetchedUsers.length);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up optimized realtime subscription
  useEffect(() => {
    console.log('Setting up optimized realtime subscription for users...');
    
    const unsubscribe = UserService.subscribeToUsers((updatedUsers) => {
      console.log('Realtime update received, updating users:', updatedUsers.length);
      setUsers(updatedUsers);
      setRealtimeConnected(true);
    });

    // Initial fetch
    fetchUsers();

    return () => {
      console.log('Cleaning up realtime subscription...');
      unsubscribe();
      setRealtimeConnected(false);
    };
  }, []);

  const createUser = async (userData: any) => {
    const success = await userOperations.createUser(userData);
    if (success) {
      // Realtime will handle the update, but also refresh manually for immediate feedback
      setTimeout(() => fetchUsers(), 100);
    }
    return success;
  };

  const updateUser = async (id: string, updates: any) => {
    const success = await userOperations.updateUser(id, updates);
    if (success) {
      // Realtime will handle the update, but also refresh manually for immediate feedback
      setTimeout(() => fetchUsers(), 100);
    }
    return success;
  };

  const deleteUser = async (id: string) => {
    const success = await userOperations.deleteUser(id);
    if (success) {
      // Realtime will handle the update, but also refresh manually for immediate feedback
      setTimeout(() => fetchUsers(), 100);
    }
    return success;
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const success = await userOperations.updateUserRole(userId, newRole);
    if (success) {
      // Realtime will handle the update, but also refresh manually for immediate feedback
      setTimeout(() => fetchUsers(), 100);
    }
    return success;
  };

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    realtimeConnected,
    isLoading: userOperations.isLoading,
  };
}
