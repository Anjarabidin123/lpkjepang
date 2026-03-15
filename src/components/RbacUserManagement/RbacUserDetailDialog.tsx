
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, Shield, Info } from 'lucide-react';
import { UserWithRoles } from '@/types/rbac';
import { format } from 'date-fns';

interface RbacUserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRoles | null;
}

export function RbacUserDetailDialog({
  open,
  onOpenChange,
  user
}: RbacUserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            User Details
          </DialogTitle>
          <DialogDescription className="sr-only">
            Profile information for {user.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20 ring-4 ring-blue-50">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{user.full_name || 'No Name'}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <Badge variant={user.is_active ? "default" : "secondary"} className="px-3 py-1">
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-gray-700">{user.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-medium text-gray-700">{user.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Joined At</p>
                  <p className="text-sm font-medium text-gray-700">
                    {user.created_at ? format(new Date(user.created_at), 'PPP p') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-bold text-gray-900">Assigned Roles</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary" className="bg-violet-50 text-violet-700 border-violet-100">
                    {role.display_name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No roles assigned</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
