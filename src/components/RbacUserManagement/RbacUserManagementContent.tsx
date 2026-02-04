
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Search } from 'lucide-react';
import { useRbacUserRoles } from '@/hooks/useRbacUserRoles';
import { useRbacRoles } from '@/hooks/useRbacRoles';
import { RbacUserTable } from './RbacUserTable';
import { RbacUserRoleDialog } from './RbacUserRoleDialog';
import { RbacUserCreateDialog } from './RbacUserCreateDialog';
import { UserWithRoles } from '@/types/rbac';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RbacUserManagementContent() {
  const { users, loading, assignRoles, assigning, deleteUser } = useRbacUserRoles();
  const { roles } = useRbacRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithRoles | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignRoles = async (userId: string, roleIds: string[]) => {
    const success = await assignRoles({ user_id: userId, role_ids: roleIds });
    if (success) {
      setShowRoleDialog(false);
      setSelectedUser(null);
    }
  };

  const handleEditUserRoles = (user: UserWithRoles) => {
    setSelectedUser(user);
    setShowRoleDialog(true);
  };

  const confirmDeleteUser = (user: UserWithRoles) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setShowDeleteDialog(false);
        setUserToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-600">Manage users and their role assignments</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <RbacUserTable
            users={filteredUsers}
            loading={loading}
            onEditRoles={handleEditUserRoles}
            onDelete={(userId) => {
              const user = users.find(u => u.id === userId);
              if (user) confirmDeleteUser(user);
            }}
          />
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      {selectedUser && (
        <RbacUserRoleDialog
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
          user={selectedUser}
          availableRoles={roles}
          onAssignRoles={handleAssignRoles}
          loading={assigning}
        />
      )}

      {/* Create User Dialog */}
      <RbacUserCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        availableRoles={roles}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user "{userToDelete?.full_name || userToDelete?.email}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
