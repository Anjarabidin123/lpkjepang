
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';
import { Role } from '@/types/rbac';

interface RbacUserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRoles: Role[];
}

export function RbacUserCreateDialog({
  open,
  onOpenChange,
  availableRoles
}: RbacUserCreateDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
    full_name: '',
    phone: ''
  });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleIds(prev => [...prev, roleId]);
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.full_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create user via Laravel API
      const response = await authFetch(endpoints.users, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.full_name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
          phone: formData.phone || null,
          roles: selectedRoleIds // Laravel UserController expects 'roles' array
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const result = await response.json();
      console.log('User created successfully:', result);

      toast({
        title: "Success",
        description: "User created successfully",
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
        passwordConfirmation: '',
        full_name: '',
        phone: ''
      });
      setSelectedRoleIds([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the information to create a new user account and assign roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label htmlFor="passwordConfirmation">Confirm Password <span className="text-red-500">*</span></Label>
              <Input
                id="passwordConfirmation"
                type="password"
                value={formData.passwordConfirmation}
                onChange={(e) => setFormData(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                placeholder="Confirm password"
                required
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Role Assignment */}
          <div>
            <Label className="text-base font-medium">Assign Roles</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`new-user-role-${role.id}`}
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`new-user-role-${role.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {role.display_name}
                      {role.is_system_role && (
                        <Badge variant="outline" className="ml-2 text-xs">System</Badge>
                      )}
                    </label>
                    {role.description && (
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
