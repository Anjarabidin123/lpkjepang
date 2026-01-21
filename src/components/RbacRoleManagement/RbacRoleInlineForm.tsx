import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  Users,
  Briefcase,
  CreditCard,
  ChevronRight,
  Search,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RbacRoleInlineFormProps {
  mode: 'create' | 'edit';
  role?: Role | null;
  permissions: Permission[];
  permissionsByModule: Record<string, Permission[]>;
  onSave: (data: CreateRoleData | { roleId: string; updates: UpdateRoleData }) => Promise<boolean>;
  onCancel: () => void;
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

export function RbacRoleInlineForm({
  mode,
  role,
  permissions,
  permissionsByModule,
  onSave,
  onCancel,
  loading
}: RbacRoleInlineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    is_active: true
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['master_data']);

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
  }, [mode, role]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      const createData: CreateRoleData = {
        ...formData,
        permission_ids: selectedPermissions
      };
      const success = await onSave(createData);
      if (success) {
        onCancel();
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
        onCancel();
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

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  const renderPermissionCard = (module: string, modulePermissions: Permission[], groupConfig: typeof permissionGroups[keyof typeof permissionGroups]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const selectedCount = modulePermissionIds.filter(id => selectedPermissions.includes(id)).length;
    const allModuleSelected = selectedCount === modulePermissionIds.length && modulePermissionIds.length > 0;
    
    return (
      <div key={module} className={cn(
        "border rounded-lg p-3 transition-all duration-200",
        allModuleSelected ? `${groupConfig.borderColor} ${groupConfig.bgColor}` : "border-gray-200 hover:border-gray-300 bg-white"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">
              {moduleTranslations[module] || module.replace(/_/g, ' ')}
            </span>
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
              "h-6 px-2 text-xs",
              allModuleSelected ? `${groupConfig.textColor}` : "text-gray-500"
            )}
          >
            {allModuleSelected ? 'Batal' : 'Semua'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {modulePermissions.map(permission => {
            const actionConfig = actionTranslations[permission.action] || { 
              label: permission.action, 
              icon: <Shield className="h-3 w-3" />, 
              color: 'bg-gray-100 text-gray-700 border-gray-200' 
            };
            const isSelected = selectedPermissions.includes(permission.id);
            
            return (
              <button
                key={permission.id}
                type="button"
                onClick={() => handlePermissionToggle(permission.id)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium transition-all duration-150",
                  isSelected 
                    ? `${actionConfig.color} shadow-sm` 
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                {isSelected ? <Check className="h-3 w-3" /> : actionConfig.icon}
                {actionConfig.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 border-violet-200 shadow-lg mb-6">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl",
              mode === 'create' 
                ? "bg-gradient-to-br from-violet-500 to-purple-600" 
                : "bg-gradient-to-br from-blue-500 to-cyan-600"
            )}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {mode === 'create' ? 'Buat Peran Baru' : 'Edit Peran'}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'create' 
                  ? 'Tentukan nama dan izin untuk peran baru' 
                  : `Perbarui konfigurasi untuk "${role?.display_name}"`
                }
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">Detail Peran</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-sm font-medium text-gray-700">
                  Nama Tampilan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="contoh: Content Manager"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
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
                <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                  Aktifkan Peran
                </Label>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Total Izin Dipilih</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    {totalStats.selected} / {totalStats.total}
                  </Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${totalStats.total > 0 ? (totalStats.selected / totalStats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Konfigurasi Izin</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari modul..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {Object.entries(permissionGroups).map(([groupKey, group]) => {
                    const stats = getGroupStats(groupKey);
                    const Icon = group.icon;
                    const isExpanded = expandedGroups.includes(groupKey);
                    const allGroupSelected = stats.selected === stats.total && stats.total > 0;
                    
                    const modulesToShow = searchTerm 
                      ? group.modules.filter(m => 
                          (moduleTranslations[m] || m).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                      : group.modules;
                    
                    if (searchTerm && modulesToShow.length === 0) return null;

                    return (
                      <Collapsible 
                        key={groupKey} 
                        open={isExpanded || !!searchTerm}
                        onOpenChange={() => !searchTerm && toggleGroup(groupKey)}
                      >
                        <div className={cn(
                          "border rounded-lg overflow-hidden transition-all",
                          isExpanded || searchTerm ? group.borderColor : "border-gray-200"
                        )}>
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-full flex items-center justify-between p-3 transition-colors",
                                isExpanded || searchTerm ? group.bgColor : "bg-gray-50 hover:bg-gray-100"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn("p-1.5 rounded-lg", group.bgColor)}>
                                  <Icon className={cn("h-4 w-4", group.textColor)} />
                                </div>
                                <span className="font-semibold text-gray-800">{group.label}</span>
                                {stats.selected > 0 && (
                                  <Badge variant="secondary" className={cn("text-xs", group.bgColor, group.textColor)}>
                                    {stats.selected}/{stats.total}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAllGroup(groupKey);
                                  }}
                                  className={cn("h-7 text-xs", group.textColor)}
                                >
                                  {allGroupSelected ? 'Batalkan' : 'Pilih Semua'}
                                </Button>
                                {!searchTerm && (
                                  isExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-3 pt-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {modulesToShow.map(module => {
                                const modulePermissions = getModulePermissionsWithDefaults(module);
                                return renderPermissionCard(module, modulePermissions, group);
                              })}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
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
                onClick={onCancel}
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
      </CardContent>
    </Card>
  );
}
