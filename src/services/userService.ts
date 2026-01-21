
import { UserProfile, CreateUserData, UpdateUserData } from '@/types/user';
import { UserFetchService } from './user/userFetchService';
import { UserCreateService } from './user/userCreateService';
import { UserUpdateService } from './user/userUpdateService';
import { UserDeleteService } from './user/userDeleteService';
import { UserSubscriptionService } from './user/userSubscriptionService';

export class UserService {
  // Fetch operations
  static async fetchUsers(): Promise<UserProfile[]> {
    return UserFetchService.fetchUsers();
  }

  // Create operations
  static async createUser(userData: CreateUserData): Promise<boolean> {
    return UserCreateService.createUser(userData);
  }

  // Update operations
  static async updateUser(id: string, updates: UpdateUserData): Promise<boolean> {
    return UserUpdateService.updateUser(id, updates);
  }

  static async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    return UserUpdateService.updateUserRole(userId, newRole);
  }

  // Delete operations
  static async deleteUser(id: string): Promise<boolean> {
    return UserDeleteService.deleteUser(id);
  }

  // Subscription operations
  static subscribeToUsers(callback: (users: UserProfile[]) => void) {
    return UserSubscriptionService.subscribeToUsers(callback);
  }
}
