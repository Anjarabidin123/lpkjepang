
import { profilesTable, userRolesTable } from '@/lib/localStorage/tables';
import { SecurityService } from '../securityService';

export class UserDeleteService {
  static async deleteUser(id: string): Promise<boolean> {
    console.log('Deleting user from localStorage:', id);
    
    try {
      // Log user deletion attempt
      await SecurityService.logSecurityEvent({
        event_type: 'user_deletion_attempt',
        event_details: { target_user_id: id }
      });
      
      // Delete user roles
      const allRoles = userRolesTable.getAll();
      const rolesToKeep = allRoles.filter(role => role.user_id !== id);
      userRolesTable.setAll(rolesToKeep as any);

      // Delete profile
      const success = profilesTable.delete(id);

      if (!success) {
        console.error('Error deleting user profile:', id);
        throw new Error('Failed to delete user');
      }

      // Log successful user deletion
      await SecurityService.logSecurityEvent({
        event_type: 'user_deleted',
        event_details: { deleted_user_id: id }
      });

      return true;
    } catch (error) {
      await SecurityService.logSecurityEvent({
        event_type: 'user_deletion_error',
        event_details: { 
          target_user_id: id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
}
