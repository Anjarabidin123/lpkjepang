
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Role, Permission, CreateRoleData, UpdateRoleData } from '@/types/rbac';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Shield, 
  Check, 
  X, 
  Eye, 
  Plus, 
  Pencil, 
  Trash2,
  Database,
  Settings,
  FileText,
  Users,
  Briefcase,
  BarChart3,
  CreditCard,
  ChevronRight,
  Search,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RbacRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  role?: Role | null;
  permissions: Permission[];
  permissionsByModule: Record<string, Permission[]>;
  onSave: (data: CreateRoleData | { roleId: string; updates: UpdateRoleData }) => Promise<boolean>;
  loading: boolean;
}

const permissionGroups = {
  'master_data': {
    label: 'Master Data',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    modules: ['siswa_magang', 'siswa', 'kumiai', 'perusahaan', 'lpk_mitra', 'program', 'jenis_kerja', 'posisi_kerja']
  },
  'operasional': {
    label: 'Operasional',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    modules: ['job_order', 'tugas', 'rekrutmen', 'monitoring', 'dashboard']
  },
  'transaksi': {
    label: 'Transaksi',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    modules: ['internal_payment', 'invoice', 'arus_kas', 'pengaturan', 'laporan_keuangan']
  },
  'system_management': {
    label: 'Manajemen Sistem',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    modules: ['user_management', 'role_management', 'system_management']
  }
};

const moduleTranslations: Record<string, string> = {
  user_management: 'Manajemen Pengguna',
  role_management: 'Manajemen Peran',
  system_management: 'Manajemen Sistem',
  siswa_magang: 'Siswa Magang',
  siswa: 'Siswa',
  kumiai: 'Kumiai',
  perusahaan: 'Perusahaan',
  lpk_mitra: 'LPK Mitra',
  program: 'Program',
  jenis_kerja: 'Jenis Kerja',
  posisi_kerja: 'Posisi Kerja',
  job_order: 'Job Order',
  tugas: 'Tugas',
  rekrutmen: 'Rekrutmen',
  monitoring: 'Monitoring',
  dashboard: 'Dashboard',
  internal_payment: 'Internal Payment',
  invoice: 'Invoice',
  arus_kas: 'Arus Kas',
  pengaturan: 'Pengaturan',
  laporan_keuangan: 'Laporan Keuangan'
};

const actionTranslations: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  view: { label: 'Lihat', icon: <Eye className="h-3.5 w-3.5" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  read: { label: 'Baca', icon: <Eye className="h-3.5 w-3.5" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  create: { label: 'Buat', icon: <Plus className="h-3.5 w-3.5" />, color: 'bg-green-100 text-green-700 border-green-200' },
  write: { label: 'Tulis', icon: <Plus className="h-3.5 w-3.5" />, color: 'bg-green-100 text-green-700 border-green-200' },
  update: { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  delete: { label: 'Hapus', icon: <Trash2 className="h-3.5 w-3.5" />, color: 'bg-red-100 text-red-700 border-red-200' },
  assign_roles: { label: 'Tugaskan', icon: <Users className="h-3.5 w-3.5" />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  assign_permissions: { label: 'Izin', icon: <Shield className="h-3.5 w-3.5" />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  manage: { label: 'Kelola', icon: <Settings className="h-3.5 w-3.5" />, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  execute: { label: 'Eksekusi', icon: <ChevronRight className="h-3.5 w-3.5" />, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
};

export function RbacRoleDialog({
  open,
  onOpenChange,
  mode,
  role,
  permissions,
  permissionsByModule,
  onSave,
  loading
}: RbacRoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    is_active: true
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState('master_data');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (mode === 'edit' && role) {
      setFormData({
        name: role.name,
        display_name: role.display_name,
        description: role.description || '',
        is_active: role.is_active
      });
      setSelectedPermissions([]);
    } else {
      setFormData({
        name: '',
        display_name: '',
        description: '',
        is_active: true
      });
      setSelectedPermissions([]);
    }
    setSearchTerm('');
  }, [mode, role, open]);

  const getModulePermissionsWithDefaults = (module: string) => {
    const existingPermissions = permissionsByModule[module] || [];
    
    if (existingPermissions.length === 0) {
      const defaultActions = ['view', 'create', 'update', 'delete'];
      return defaultActions.map((action, index) => ({
        id: `${module}_${action}_${index}`,
        name: `${module}.${action}`,
        display_name: `${moduleTranslations[module] || module} - ${actionTranslations[action]?.label || action}`,
        description: `${actionTranslations[action]?.label || action} ${moduleTranslations[module] || module}`,
        module: module,
        action: action,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    }
    
    return existingPermissions;
  };

  const allPermissionsWithDefaults = useMemo(() => {
    const allPerms: Permission[] = [];
    Object.values(permissionGroups).forEach(group => {
      group.modules.forEach(module => {
        allPerms.push(...getModulePermissionsWithDefaults(module));
      });
    });
    return allPerms;
  }, [permissionsByModule]);

  const filteredModules = useMemo(() => {
    if (!searchTerm) return null;
    
    const searchLower = searchTerm.toLowerCase();
    const results: Record<string, Permission[]> = {};
    
    Object.values(permissionGroups).forEach(group => {
      group.modules.forEach(module => {
        const moduleName = moduleTranslations[module] || module;
        const modulePerms = getModulePermissionsWithDefaults(module);
        
        if (moduleName.toLowerCase().includes(searchLower)) {
          results[module] = modulePerms;
        } else {
          const matchingPerms = modulePerms.filter(p => 
            p.display_name.toLowerCase().includes(searchLower) ||
            (actionTranslations[p.action]?.label || '').toLowerCase().includes(searchLower)
          );
          if (matchingPerms.length > 0) {
            results[module] = matchingPerms;
          }
        }
      });
    });
    
    return results;
  }, [searchTerm, permissionsByModule]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllModule = (module: string) => {
    const modulePermissions = getModulePermissionsWithDefaults(module);
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)));
    } else {
      setSelectedPermissions(prev => [...prev.filter(id => !modulePermissionIds.includes(id)), ...modulePermissionIds]);
    }
  };

  const handleSelectAllGroup = (groupKey: string) => {
    const group = permissionGroups[groupKey as keyof typeof permissionGroups];
    const groupPermissionIds: string[] = [];
    
    group.modules.forEach(module => {
      const modulePermissions = getModulePermissionsWithDefaults(module);
      groupPermissionIds.push(...modulePermissions.map(p => p.id));
    });
    
    const allSelected = groupPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !groupPermissionIds.includes(id)));
    } else {
      setSelectedPermissions(prev => [...prev.filter(id => !groupPermissionIds.includes(id)), ...groupPermissionIds]);
    }
  };

  const handleSelectAllPermissions = () => {
    const allPermissionIds = allPermissionsWithDefaults.map(p => p.id);
    const allSelected = allPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissionIds);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      const createData: CreateRoleData = {
        ...formData,
        permission_ids: selectedPermissions
      };
      const success = await onSave(createData);
      if (success) {
        onOpenChange(false);
      }
    } else if (mode === 'edit' && role) {
      const updateData = {
        roleId: role.id,
        updates: {
          ...formData,
          permission_ids: selectedPermissions
        }
      };
      const success = await onSave(updateData);
      if (success) {
        onOpenChange(false);
      }
    }
  };

  const getGroupStats = (groupKey: string) => {
    const group = permissionGroups[groupKey as keyof typeof permissionGroups];
    let total = 0;
    let selected = 0;
    
    group.modules.forEach(module => {
      const modulePerms = getModulePermissionsWithDefaults(module);
      total += modulePerms.length;
      selected += modulePerms.filter(p => selectedPermissions.includes(p.id)).length;
    });
    
    return { total, selected };
  };

  const totalStats = useMemo(() => {
    const total = allPermissionsWithDefaults.length;
    const selected = selectedPermissions.length;
    return { total, selected };
  }, [allPermissionsWithDefaults, selectedPermissions]);

  const isAllSelected = totalStats.selected === totalStats.total && totalStats.total > 0;

  const renderPermissionCard = (module: string, modulePermissions: Permission[], groupConfig: typeof permissionGroups[keyof typeof permissionGroups]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const selectedCount = modulePermissionIds.filter(id => selectedPermissions.includes(id)).length;
    const allModuleSelected = selectedCount === modulePermissionIds.length && modulePermissionIds.length > 0;
    
    return (
      <Card key={module} className={cn(
        "border transition-all duration-200",
        allModuleSelected ? `${groupConfig.borderColor} ${groupConfig.bgColor}` : "border-gray-200 hover:border-gray-300"
      )}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-gray-800">
                {moduleTranslations[module] || module.replace(/_/g, ' ')}
              </CardTitle>
              {selectedCount > 0 && (
                <Badge variant="secondary" className={cn("text-xs", groupConfig.bgColor, groupConfig.textColor)}>
                  {selectedCount}/{modulePermissions.length}
                </Badge>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleSelectAllModule(module)}
              className={cn(
                "h-7 px-2 text-xs",
                allModuleSelected ? `${groupConfig.textColor} hover:${groupConfig.bgColor}` : "text-gray-500 hover:text-gray-700"
              )}
            >
              {allModuleSelected ? (
                <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Batalkan</>
              ) : (
                <><Circle className="h-3.5 w-3.5 mr-1" /> Semua</>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {modulePermissions.map(permission => {
              const actionConfig = actionTranslations[permission.action] || { 
                label: permission.action, 
                icon: <Shield className="h-3.5 w-3.5" />, 
                color: 'bg-gray-100 text-gray-700 border-gray-200' 
              };
              const isSelected = selectedPermissions.includes(permission.id);
              
              return (
                <button
                  key={permission.id}
                  type="button"
                  onClick={() => handlePermissionToggle(permission.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-150",
                    isSelected 
                      ? `${actionConfig.color} shadow-sm` 
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" /> : actionConfig.icon}
                  {actionConfig.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100/50">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl",
              mode === 'create' 
                ? "bg-gradient-to-br from-violet-500 to-purple-600" 
                : "bg-gradient-to-br from-blue-500 to-cyan-600"
            )}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {mode === 'create' ? 'Buat Peran Baru' : 'Edit Peran'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {mode === 'create' 
                  ? 'Tentukan nama dan izin untuk peran baru' 
                  : `Perbarui konfigurasi untuk "${role?.display_name}"`
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(95vh-130px)]">
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Role Details */}
            <div className="w-80 border-r bg-white p-6 space-y-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Nama Peran <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="contoh: content_manager"
                    required
                    disabled={role?.is_system_role}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400">Identifier unik untuk sistem</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display_name" className="text-sm font-semibold text-gray-700">
                    Nama Tampilan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="contoh: Content Manager"
                    required
                  />
                  <p className="text-xs text-gray-400">Nama yang ditampilkan ke pengguna</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Jelaskan tanggung jawab peran ini..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked === true }))}
                  />
                  <div>
                    <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                      Aktifkan Peran
                    </Label>
                    <p className="text-xs text-gray-400">Peran yang tidak aktif tidak dapat ditugaskan</p>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Izin</h4>
                <div className="space-y-2">
                  {Object.entries(permissionGroups).map(([key, group]) => {
                    const stats = getGroupStats(key);
                    const percentage = stats.total > 0 ? Math.round((stats.selected / stats.total) * 100) : 0;
                    const Icon = group.icon;
                    
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-lg", group.bgColor)}>
                          <Icon className={cn("h-3.5 w-3.5", group.textColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-600 truncate">{group.label}</span>
                            <span className={cn("font-semibold", stats.selected > 0 ? group.textColor : "text-gray-400")}>
                              {stats.selected}/{stats.total}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-300 bg-gradient-to-r", group.color)}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Dipilih</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    {totalStats.selected} / {totalStats.total}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Panel - Permissions */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {/* Permissions Header */}
              <div className="px-6 py-4 bg-white border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Konfigurasi Izin</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllPermissions}
                    className={cn(
                      "transition-colors",
                      isAllSelected ? "bg-violet-50 text-violet-700 border-violet-200" : ""
                    )}
                  >
                    {isAllSelected ? <X className="h-4 w-4 mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
                    {isAllSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari modul atau izin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Group Tabs */}
                {!searchTerm && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                    {Object.entries(permissionGroups).map(([key, group]) => {
                      const stats = getGroupStats(key);
                      const Icon = group.icon;
                      const isActive = activeGroup === key;
                      
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveGroup(key)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                            isActive 
                              ? `bg-gradient-to-r ${group.color} text-white shadow-md` 
                              : `${group.bgColor} ${group.textColor} hover:opacity-80`
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {group.label}
                          {stats.selected > 0 && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "ml-1 text-xs",
                                isActive ? "bg-white/20 text-white" : `${group.bgColor} ${group.textColor}`
                              )}
                            >
                              {stats.selected}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Permissions Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {searchTerm && filteredModules ? (
                    Object.keys(filteredModules).length > 0 ? (
                      Object.entries(filteredModules).map(([module, perms]) => {
                        const groupKey = Object.entries(permissionGroups).find(([_, g]) => 
                          g.modules.includes(module)
                        )?.[0] || 'master_data';
                        const groupConfig = permissionGroups[groupKey as keyof typeof permissionGroups];
                        return renderPermissionCard(module, perms, groupConfig);
                      })
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Tidak ada hasil untuk "{searchTerm}"</p>
                        <p className="text-sm mt-1">Coba kata kunci lain</p>
                      </div>
                    )
                  ) : (
                    <>
                      {/* Active Group Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {React.createElement(permissionGroups[activeGroup as keyof typeof permissionGroups].icon, {
                            className: cn("h-5 w-5", permissionGroups[activeGroup as keyof typeof permissionGroups].textColor)
                          })}
                          <h4 className="font-semibold text-gray-800">
                            {permissionGroups[activeGroup as keyof typeof permissionGroups].label}
                          </h4>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectAllGroup(activeGroup)}
                          className={cn(
                            "text-sm",
                            permissionGroups[activeGroup as keyof typeof permissionGroups].textColor
                          )}
                        >
                          {getGroupStats(activeGroup).selected === getGroupStats(activeGroup).total 
                            ? 'Batalkan Kategori' 
                            : 'Pilih Kategori'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {permissionGroups[activeGroup as keyof typeof permissionGroups].modules.map(module => {
                          const modulePermissions = getModulePermissionsWithDefaults(module);
                          const groupConfig = permissionGroups[activeGroup as keyof typeof permissionGroups];
                          return renderPermissionCard(module, modulePermissions, groupConfig);
                        })}
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-white flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedPermissions.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-emerald-700">{selectedPermissions.length}</span> izin dipilih
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.display_name}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 min-w-[120px]"
              >
                {loading ? (
                  <><LoadingSpinner size={16} /> <span className="ml-2">Menyimpan...</span></>
                ) : (
                  mode === 'create' ? 'Buat Peran' : 'Simpan Perubahan'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
