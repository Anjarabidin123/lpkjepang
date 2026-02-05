import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Variable,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Database,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentVariables } from '@/hooks/useDocuments';
import {
  DocumentVariable,
  CreateDocumentVariableData,
  VARIABLE_CATEGORIES,
  VARIABLE_FORMATS,
  VariableCategory,
  VariableFormatType,
} from '@/types/document';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DocumentVariableManager() {
  const { variables, variablesByCategory, loading, createVariable, updateVariable, deleteVariable, creating, updating } = useDocumentVariables();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<DocumentVariable | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<DocumentVariable | null>(null);
  const [formData, setFormData] = useState<CreateDocumentVariableData>({
    nama: '',
    display_name: '',
    kategori: 'siswa',
    source_table: '',
    source_field: '',
    format_type: 'text',
    default_value: '',
    is_active: true,
  });

  const categoryToTable: Record<VariableCategory, string> = {
    siswa: 'siswa',
    perusahaan: 'perusahaan',
    kumiai: 'kumiai',
    program: 'program',
    lpk: 'lpk_profile',
    job_order: 'job_order',
    sistem: '_system',
  };

  React.useEffect(() => {
    if (!editingVariable) {
      const table = categoryToTable[formData.kategori];
      // Try to extract field from nama if it starts with category name
      const prefix = `${formData.kategori}_`;
      const field = formData.nama.startsWith(prefix)
        ? formData.nama.substring(prefix.length)
        : formData.nama;

      setFormData(prev => ({
        ...prev,
        source_table: table || '',
        source_field: field || ''
      }));
    }
  }, [formData.nama, formData.kategori, editingVariable]);

  const filteredVariables = useMemo(() => {
    return variables.filter((v) => {
      const matchesSearch =
        v.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.display_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || v.kategori === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [variables, searchTerm, filterCategory]);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    VARIABLE_CATEGORIES.forEach((cat) => {
      byCategory[cat.value] = variables.filter((v) => v.kategori === cat.value).length;
    });
    return {
      total: variables.length,
      active: variables.filter((v) => v.is_active).length,
      byCategory,
    };
  }, [variables]);

  const handleOpenDialog = (variable?: DocumentVariable) => {
    if (variable) {
      setEditingVariable(variable);
      setFormData({
        nama: variable.nama,
        display_name: variable.display_name,
        kategori: variable.kategori,
        source_table: variable.source_table,
        source_field: variable.source_field,
        format_type: variable.format_type,
        default_value: variable.default_value || '',
        is_active: variable.is_active,
      });
    } else {
      setEditingVariable(null);
      setFormData({
        nama: '',
        display_name: '',
        kategori: 'siswa',
        source_table: '',
        source_field: '',
        format_type: 'text',
        default_value: '',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingVariable) {
      const success = await updateVariable(editingVariable.id, formData);
      if (success) setDialogOpen(false);
    } else {
      const success = await createVariable(formData);
      if (success) setDialogOpen(false);
    }
  };

  const handleDelete = (variable: DocumentVariable) => {
    setVariableToDelete(variable);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (variableToDelete) {
      await deleteVariable(variableToDelete.id);
      setDeleteDialogOpen(false);
      setVariableToDelete(null);
    }
  };

  const handleToggleStatus = async (variable: DocumentVariable) => {
    await updateVariable(variable.id, { is_active: !variable.is_active });
  };

  const getCategoryLabel = (kategori: string) => {
    return VARIABLE_CATEGORIES.find((c) => c.value === kategori)?.label || kategori;
  };

  const getFormatLabel = (format: string) => {
    return VARIABLE_FORMATS.find((f) => f.value === format)?.label || format;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 font-medium">Total Variabel</p>
                <p className="text-2xl font-bold text-violet-700">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-200/50">
                <Variable className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Aktif</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-200/50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Data Siswa</p>
                <p className="text-2xl font-bold text-blue-700">{stats.byCategory['siswa'] || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-200/50">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Sistem</p>
                <p className="text-2xl font-bold text-amber-700">{stats.byCategory['sistem'] || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-200/50">
                <Code2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Daftar Variabel Mail Merge</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-violet-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Variabel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari variabel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {VARIABLE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variabel</TableHead>
                  <TableHead>Nama Tampilan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      <Variable className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Tidak ada variabel ditemukan</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVariables.map((variable) => (
                    <TableRow key={variable.id} className="group">
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-violet-700">
                          {`{{${variable.nama}}}`}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">{variable.display_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getCategoryLabel(variable.kategori)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getFormatLabel(variable.format_type)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={variable.is_active ? 'default' : 'secondary'}
                          className={cn(
                            variable.is_active
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500'
                          )}
                        >
                          {variable.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(variable)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(variable)}>
                              {variable.is_active ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aktifkan
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(variable)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingVariable ? 'Edit Variabel' : 'Tambah Variabel Baru'}</DialogTitle>
            <DialogDescription>
              {editingVariable
                ? 'Perbarui konfigurasi variabel mail merge'
                : 'Buat variabel baru untuk digunakan dalam template dokumen'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Variabel <span className="text-red-500">*</span></Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  placeholder="siswa_nama"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">Gunakan format: {`{{${formData.nama || 'variabel'}}}`}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Nama Tampilan <span className="text-red-500">*</span></Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Nama Lengkap Siswa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, kategori: v as VariableCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIABLE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format_type">Format</Label>
                <Select
                  value={formData.format_type}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, format_type: v as VariableFormatType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIABLE_FORMATS.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        <div className="flex flex-col">
                          <span>{fmt.label}</span>
                          <span className="text-xs text-gray-400">{fmt.example}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hidden source mapping - handled automatically */}
            <Input type="hidden" value={formData.source_table} />
            <Input type="hidden" value={formData.source_field} />

            <div className="space-y-2">
              <Label htmlFor="default_value">Nilai Default (Opsional)</Label>
              <Input
                id="default_value"
                value={formData.default_value}
                onChange={(e) => setFormData((prev) => ({ ...prev, default_value: e.target.value }))}
                placeholder="Nilai jika data kosong"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={creating || updating || !formData.nama || !formData.display_name || !formData.source_table || !formData.source_field}
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              {(creating || updating) ? (
                <>
                  <LoadingSpinner size={16} />
                  <span className="ml-2">Menyimpan...</span>
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Variabel</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus variabel "{variableToDelete?.display_name}"? Template yang menggunakan variabel ini akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
