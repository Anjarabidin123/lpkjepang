
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Users } from 'lucide-react';
import { UserManagementSettings } from '@/components/Settings/UserManagementSettings';

export default function Settings() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagementSettings />
        </CardContent>
      </Card>
    </div>
  );
}
