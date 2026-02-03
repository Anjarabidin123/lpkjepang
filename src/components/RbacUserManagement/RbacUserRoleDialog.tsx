
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserWithRoles, Role } from '@/types/rbac';

interface RbacUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRoles;
  availableRoles: Role[];
  onAssignRoles: (userId: string, roleIds: string[]) => Promise<void>;
  loading: boolean;
}

export function RbacUserRoleDialog({
  open,
  onOpenChange,
  user,
  availableRoles,
  onAssignRoles,
  loading
}: RbacUserRoleDialogProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.roles) {
      setSelectedRoleIds(user.roles.map(role => role.id));
    }
  }, [user]);

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleIds(prev => [...prev, roleId]);
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
    }
  };

  const handleSave = async () => {
    await onAssignRoles(user.id, selectedRoleIds);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            Manage Roles for {user.full_name || user.email}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Select the roles you want to assign to this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Roles */}
          <div>
            <h4 className="font-medium mb-2">Current Roles</h4>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.display_name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No Roles Assigned</Badge>
              )}
            </div>
          </div>

          {/* Available Roles */}
          <div>
            <h4 className="font-medium mb-3">Available Roles</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={role.id}
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={role.id}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {role.display_name}
                      {role.is_system_role && (
                        <Badge variant="outline" className="ml-2 text-xs">System</Badge>
                      )}
                    </label>
                    {role.description && (
                      <p className="mt-1 text-xs text-gray-500">{role.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
