import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Plus, 
  Search, 
  Users, 
  Key, 
  Lock, 
  Unlock,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { useRbacRoles } from '@/hooks/useRbacRoles';
import { useRbacPermissions } from '@/hooks/useRbacPermissions';
import { RbacRoleTable } from './RbacRoleTable';
import { RbacRoleInlineForm } from './RbacRoleInlineForm';
import { Role, CreateRoleData, UpdateRoleData } from '@/types/rbac';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
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

type FilterStatus = 'all' | 'active' | 'inactive';
type FilterType = 'all' | 'system' | 'custom';

export function RbacRoleManagementContent() {
  const { roles, loading, createRole, updateRole, deleteRole, creating, updating } = useRbacRoles();
  const { permissions, permissionsByModule } = useRbacPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleting, setDeleting] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const total = roles.length;
    const active = roles.filter(r => r.is_active).length;
    const inactive = total - active;
    const system = roles.filter(r => r.is_system_role).length;
    const custom = total - system;
    return { total, active, inactive, system, custom };
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch = 
        (role.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (role.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (role.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'active' && role.is_active) ||
        (filterStatus === 'inactive' && !role.is_active);
      
      const matchesType = 
        filterType === 'all' ||
        (filterType === 'system' && role.is_system_role) ||
        (filterType === 'custom' && !role.is_system_role);
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [roles, searchTerm, filterStatus, filterType]);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  const handleDuplicateRole = async (role: Role) => {
    const duplicateData: CreateRoleData = {
      name: `${role.name}_copy`,
      display_name: `${role.display_name} (Copy)`,
      description: role.description,
      permission_ids: []
    };
    
    const success = await createRole(duplicateData);
    if (success) {
      toast({
        title: "Berhasil",
        description: `Peran "${role.display_name}" berhasil diduplikasi`,
      });
    }
  };

  const handleToggleStatus = async (role: Role) => {
    const success = await updateRole(role.id, { is_active: !role.is_active });
    if (success) {
      toast({
        title: "Berhasil",
        description: `Peran "${role.display_name}" ${role.is_active ? 'dinonaktifkan' : 'diaktifkan'}`,
      });
    }
  };

  const confirmDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    
    setDeleting(prev => [...prev, roleToDelete.id]);
    try {
      await deleteRole(roleToDelete.id);
    } finally {
      setDeleting(prev => prev.filter(id => id !== roleToDelete.id));
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleSaveRole = async (data: CreateRoleData | { roleId: string; updates: UpdateRoleData }): Promise<boolean> => {
    if ('roleId' in data) {
      return await updateRole(data.roleId, data.updates);
    } else {
      return await createRole(data);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
  };

  const hasActiveFilters = searchTerm || filterStatus !== 'all' || filterType !== 'all';

  return (
    <div className="space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Manajemen Peran
            </h1>
            <p className="text-gray-500 mt-1">Kelola peran dan hak akses pengguna sistem</p>
          </div>
        </div>
        {!showForm && (
          <Button 
            onClick={handleCreateRole} 
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-300"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Buat Peran Baru
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Peran</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-200/80">
                <Shield className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Aktif</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-200/80">
                <Unlock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Tidak Aktif</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">{stats.inactive}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-200/80">
                <Lock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Sistem</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">{stats.system}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-200/80">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Kustom</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">{stats.custom}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-200/80">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inline Form for Create/Edit */}
      {showForm && (
        <RbacRoleInlineForm
          mode={formMode}
          role={selectedRole}
          permissions={permissions}
          permissionsByModule={permissionsByModule}
          onSave={handleSaveRole}
          onCancel={handleCancelForm}
          loading={creating || updating}
        />
      )}

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Cari nama peran, nama tampilan, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-gray-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                <SelectTrigger className="w-[160px] h-12 border-gray-200">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                <SelectTrigger className="w-[160px] h-12 border-gray-200">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="h-12 text-gray-500 hover:text-gray-700"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filter aktif:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                  Pencarian: "{searchTerm}"
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Status: {filterStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              )}
              {filterType !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Tipe: {filterType === 'system' ? 'Sistem' : 'Kustom'}
                </Badge>
              )}
              <span className="text-sm text-gray-400 ml-auto">
                Menampilkan {filteredRoles.length} dari {roles.length} peran
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Peran</CardTitle>
              <CardDescription className="mt-1">
                {filteredRoles.length} peran ditemukan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RbacRoleTable
            roles={filteredRoles}
            loading={loading}
            onEdit={handleEditRole}
            onDelete={confirmDeleteRole}
            onDuplicate={handleDuplicateRole}
            onToggleStatus={handleToggleStatus}
            deleting={deleting}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus peran <strong>"{roleToDelete?.display_name}"</strong>? 
              Tindakan ini tidak dapat dibatalkan dan akan menghapus semua izin yang terkait dengan peran ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus Peran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
