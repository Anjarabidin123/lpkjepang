
import { profilesTable, userRolesTable } from '@/lib/localStorage/tables';
import { UpdateUserData } from '@/types/user';
import { SecurityService } from '../securityService';

export class UserUpdateService {
  static async updateUser(id: string, updates: UpdateUserData): Promise<boolean> {
    console.log('Updating user in localStorage:', id, updates);
    
    try {
      // Log user update attempt
      await SecurityService.logSecurityEvent({
        event_type: 'user_update_attempt',
        event_details: { 
          target_user_id: id,
          updated_fields: Object.keys(updates)
        }
      });

      // Sanitize update data
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.email) {
        if (!SecurityService.validateEmail(sanitizedUpdates.email)) {
          throw new Error('Invalid email format');
        }
        sanitizedUpdates.email = SecurityService.sanitizeInput(sanitizedUpdates.email);
      }
      if (sanitizedUpdates.full_name) {
        sanitizedUpdates.full_name = SecurityService.sanitizeInput(sanitizedUpdates.full_name);
      }
      
      const updated = profilesTable.update(id, sanitizedUpdates);

      if (!updated) {
        console.error('User not found for update:', id);
        throw new Error('Failed to update user');
      }

      // Log successful user update
      await SecurityService.logSecurityEvent({
        event_type: 'user_updated',
        event_details: { 
          updated_user_id: id,
          updated_fields: Object.keys(updates)
        }
      });

      return true;
    } catch (error) {
      await SecurityService.logSecurityEvent({
        event_type: 'user_update_error',
        event_details: { 
          target_user_id: id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  static async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    console.log('Updating user role in localStorage:', userId, newRole);
    
    try {
      // Log role update attempt
      await SecurityService.logSecurityEvent({
        event_type: 'user_role_update_attempt',
        event_details: { 
          target_user_id: userId,
          new_role: newRole
        }
      });
      
      // Delete existing roles
      const allRoles = userRolesTable.getAll();
      const rolesToKeep = allRoles.filter(role => role.user_id !== userId);
      userRolesTable.setAll(rolesToKeep as any);

      // Insert new role
      userRolesTable.create({ 
        user_id: userId, 
        role: newRole as any
      } as any);

      // Log successful role update
      await SecurityService.logSecurityEvent({
        event_type: 'user_role_updated',
        event_details: { 
          updated_user_id: userId,
          new_role: newRole
        }
      });

      return true;
    } catch (error) {
      await SecurityService.logSecurityEvent({
        event_type: 'user_role_update_error',
        event_details: { 
          target_user_id: userId,
          new_role: newRole,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
}
