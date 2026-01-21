
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Settings, Eye, EyeOff } from 'lucide-react';
import { AppModule } from '@/types/permissions';

interface ModuleConfig {
  key: AppModule;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  visible: boolean;
  order: number;
}

const DEFAULT_MODULES: ModuleConfig[] = [
  { 
    key: 'dashboard', 
    label: 'Dashboard', 
    description: 'Main dashboard and system overview', 
    icon: 'Home',
    enabled: true,
    visible: true,
    order: 1
  },
  { 
    key: 'siswa', 
    label: 'Siswa', 
    description: 'Student data and information management', 
    icon: 'GraduationCap',
    enabled: true,
    visible: true,
    order: 2
  },
  { 
    key: 'kumiai', 
    label: 'Kumiai', 
    description: 'Kumiai organization management', 
    icon: 'Building2',
    enabled: true,
    visible: true,
    order: 3
  },
  { 
    key: 'perusahaan', 
    label: 'Perusahaan', 
    description: 'Company and business management', 
    icon: 'Briefcase',
    enabled: true,
    visible: true,
    order: 4
  },
  { 
    key: 'program', 
    label: 'Program', 
    description: 'Training and education program management', 
    icon: 'ClipboardList',
    enabled: true,
    visible: true,
    order: 5
  },
  { 
    key: 'jenis_kerja', 
    label: 'Jenis Kerja', 
    description: 'Job type and category management', 
    icon: 'Users',
    enabled: true,
    visible: true,
    order: 6
  },
  { 
    key: 'posisi_kerja', 
    label: 'Posisi Kerja', 
    description: 'Job position and vacancy management', 
    icon: 'MapPin',
    enabled: true,
    visible: true,
    order: 7
  },
  { 
    key: 'user_management', 
    label: 'User Management', 
    description: 'User accounts and permission management', 
    icon: 'UserCog',
    enabled: true,
    visible: true,
    order: 8
  },
];

export function ModuleControlSettings() {
  const [modules, setModules] = useState<ModuleConfig[]>(DEFAULT_MODULES);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateModule = (key: AppModule, updates: Partial<ModuleConfig>) => {
    setModules(prev => prev.map(module => 
      module.key === key ? { ...module, ...updates } : module
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasChanges(false);
    setIsSaving(false);
  };

  const getStatusBadge = (module: ModuleConfig) => {
    if (!module.enabled) {
      return <Badge variant="destructive">Disabled</Badge>;
    }
    if (!module.visible) {
      return <Badge variant="secondary">Hidden</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Module Configuration</h3>
          <p className="text-sm text-gray-600">Control the visibility and availability of system modules</p>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {modules
          .sort((a, b) => a.order - b.order)
          .map((module) => (
          <Card key={module.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{module.label}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(module)}
                  <div className="text-sm text-gray-500">
                    Order: {module.order}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Module Name</label>
                  <Input
                    value={module.label}
                    onChange={(e) => updateModule(module.key, { label: e.target.value })}
                    placeholder="Module name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input
                    type="number"
                    value={module.order}
                    onChange={(e) => updateModule(module.key, { order: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Module Status</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Enabled</span>
                      </div>
                      <Switch
                        checked={module.enabled}
                        onCheckedChange={(checked) => updateModule(module.key, { enabled: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {module.visible ? (
                          <Eye className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm">Visible</span>
                      </div>
                      <Switch
                        checked={module.visible}
                        onCheckedChange={(checked) => updateModule(module.key, { visible: checked })}
                        disabled={!module.enabled}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={module.description}
                    onChange={(e) => updateModule(module.key, { description: e.target.value })}
                    placeholder="Module description"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
          <CardDescription>Overview of current module configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {modules.filter(m => m.enabled && m.visible).length}
              </div>
              <div className="text-sm text-green-700">Active Modules</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {modules.filter(m => m.enabled && !m.visible).length}
              </div>
              <div className="text-sm text-yellow-700">Hidden Modules</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {modules.filter(m => !m.enabled).length}
              </div>
              <div className="text-sm text-red-700">Disabled Modules</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {modules.length}
              </div>
              <div className="text-sm text-blue-700">Total Modules</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
