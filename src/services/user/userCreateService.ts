
import { profilesTable, userRolesTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { CreateUserData } from '@/types/user';
import { generateId } from '@/lib/localStorage/core';

export class UserCreateService {
  static async createUser(userData: CreateUserData): Promise<boolean> {
    console.log('Creating user in localStorage:', userData);
    
    try {
      const userId = generateId();
      
      // Create profile
      profilesTable.create({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url || null,
        username: userData.email.split('@')[0],
      } as any);

      // Create role
      if (userData.role) {
        // Find role id by name if needed, or just use role name
        userRolesTable.create({
          user_id: userId,
          role: userData.role
        } as any);
      }

      console.log('User created successfully in localStorage');
      return true;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
}
