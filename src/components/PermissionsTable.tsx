
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Edit, Save, X } from 'lucide-react';
import { RolePermission, AppRole, AppModule } from '@/types/permissions';

interface PermissionsTableProps {
  permissions: RolePermission[];
  onUpdatePermission: (role: AppRole, module: AppModule, updates: any) => Promise<boolean>;
  isUpdating: boolean;
}

export function PermissionsTable({ permissions, onUpdatePermission, isUpdating }: PermissionsTableProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, boolean>>({});

  const modules: AppModule[] = [
    'dashboard',
    'siswa',
    'kumiai',
    'perusahaan',
    'program',
    'jenis_kerja',
    'posisi_kerja',
    'user_management'
  ];

  const roles: AppRole[] = ['admin', 'moderator', 'user'];

  const getPermissionForRoleModule = (role: AppRole, module: AppModule) => {
    return permissions.find(p => p.role === role && p.module === module);
  };

  const handleEdit = (role: AppRole, module: AppModule, permissionType: string) => {
    const key = `${role}-${module}-${permissionType}`;
    const permission = getPermissionForRoleModule(role, module);
    if (permission) {
      setTempValues({
        ...tempValues,
        [key]: permission[permissionType as keyof RolePermission] as boolean
      });
      setEditingCell(key);
    }
  };

  const handleSave = async (role: AppRole, module: AppModule, permissionType: string) => {
    const key = `${role}-${module}-${permissionType}`;
    const newValue = tempValues[key];
    
    const success = await onUpdatePermission(role, module, {
      [permissionType]: newValue
    });

    if (success) {
      setEditingCell(null);
      setTempValues({ ...tempValues, [key]: undefined });
    }
  };

  const handleCancel = (role: AppRole, module: AppModule, permissionType: string) => {
    const key = `${role}-${module}-${permissionType}`;
    setEditingCell(null);
    setTempValues({ ...tempValues, [key]: undefined });
  };

  const formatModuleName = (module: string) => {
    return module.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatRoleName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const renderPermissionCell = (
    role: AppRole, 
    module: AppModule, 
    permissionType: 'can_view' | 'can_create' | 'can_update' | 'can_delete'
  ) => {
    const permission = getPermissionForRoleModule(role, module);
    if (!permission) return <TableCell>-</TableCell>;

    const key = `${role}-${module}-${permissionType}`;
    const isEditing = editingCell === key;
    const currentValue = permission[permissionType];
    const tempValue = tempValues[key];

    return (
      <TableCell>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Switch
                checked={tempValue}
                onCheckedChange={(checked) => setTempValues({
                  ...tempValues,
                  [key]: checked
                })}
                disabled={isUpdating}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(role, module, permissionType)}
                disabled={isUpdating}
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(role, module, permissionType)}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Badge variant={currentValue ? "default" : "secondary"}>
                {currentValue ? "Yes" : "No"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(role, module, permissionType)}
                disabled={isUpdating}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Permissions Matrix
        </CardTitle>
        <CardDescription>
          Manage permissions for each role across different modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roles.map((role) => (
            <div key={role} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatRoleName(role)} Role
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>View</TableHead>
                      <TableHead>Create</TableHead>
                      <TableHead>Update</TableHead>
                      <TableHead>Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module}>
                        <TableCell className="font-medium">
                          {formatModuleName(module)}
                        </TableCell>
                        {renderPermissionCell(role, module, 'can_view')}
                        {renderPermissionCell(role, module, 'can_create')}
                        {renderPermissionCell(role, module, 'can_update')}
                        {renderPermissionCell(role, module, 'can_delete')}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
