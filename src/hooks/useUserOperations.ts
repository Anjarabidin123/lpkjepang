
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/userService';
import { CreateUserData, UpdateUserData } from '@/types/user';

export function useUserOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Creating user with data:', userData);
      await UserService.createUser(userData);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error in createUser:', error);
      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('Insufficient permissions')) {
        errorMessage = "You don't have permission to create users. Admin role required.";
      } else if (errorMessage.includes('User not authenticated')) {
        errorMessage = "Please log in again to continue.";
      } else if (errorMessage.includes('email')) {
        errorMessage = "Please check the email format and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, updates: UpdateUserData): Promise<boolean> => {
    setIsLoading(true);
    try {
      await UserService.updateUser(id, updates);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error in updateUser:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await UserService.deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await UserService.updateUserRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    isLoading,
  };
}
