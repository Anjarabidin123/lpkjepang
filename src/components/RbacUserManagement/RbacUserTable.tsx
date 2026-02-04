
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCog, Mail, Phone, Trash2 } from 'lucide-react';
import { UserWithRoles } from '@/types/rbac';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface RbacUserTableProps {
  users: UserWithRoles[];
  loading: boolean;
  onEditRoles: (user: UserWithRoles) => void;
  onDelete?: (userId: string) => void;
}

export function RbacUserTable({ users, loading, onEditRoles, onDelete }: RbacUserTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.full_name || 'No Name'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} variant="secondary" className="text-xs">
                        {role.display_name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">No Roles</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRoles(user)}
                    className="flex items-center gap-2"
                  >
                    <UserCog className="h-4 w-4" />
                    Manage Roles
                  </Button>
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
