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
  DropdownMenuSeparator,
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
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentTemplates } from '@/hooks/useDocuments';
import { DocumentTemplate, DOCUMENT_CATEGORIES, DocumentCategory } from '@/types/document';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DocumentTemplateForm } from './DocumentTemplateForm';
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

interface DocumentTemplateListProps {
  onPreview?: (template: DocumentTemplate) => void;
}

export function DocumentTemplateList({ onPreview }: DocumentTemplateListProps) {
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate, creating, updating } = useDocumentTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.deskripsi?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || t.kategori === filterCategory;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && t.is_active) ||
        (filterStatus === 'inactive' && !t.is_active);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [templates, searchTerm, filterCategory, filterStatus]);

  const stats = useMemo(() => ({
    total: templates.length,
    active: templates.filter((t) => t.is_active).length,
    required: templates.filter((t) => t.is_required).length,
  }), [templates]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDuplicate = async (template: DocumentTemplate) => {
    await createTemplate({
      kode: `${template.kode}_COPY`,
      nama: `${template.nama} (Copy)`,
      kategori: template.kategori,
      deskripsi: template.deskripsi,
      template_content: template.template_content,
      is_required: template.is_required,
      is_active: false,
      urutan: template.urutan + 1,
    });
  };

  const handleDelete = (template: DocumentTemplate) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete.id);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleToggleStatus = async (template: DocumentTemplate) => {
    await updateTemplate(template.id, { is_active: !template.is_active });
  };

  const getCategoryConfig = (kategori: string) => {
    return DOCUMENT_CATEGORIES.find((c) => c.value === kategori) || DOCUMENT_CATEGORIES[6];
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
      {showForm ? (
        <DocumentTemplateForm
          template={editingTemplate}
          onSave={async (data) => {
            if (editingTemplate) {
              const success = await updateTemplate(editingTemplate.id, data);
              if (success) setShowForm(false);
              return success;
            } else {
              const success = await createTemplate(data as any);
              if (success) setShowForm(false);
              return success;
            }
          }}
          onCancel={() => setShowForm(false)}
          loading={creating || updating}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Template</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-200/50">
                    <FileText className="h-6 w-6 text-blue-600" />
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
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Wajib</p>
                    <p className="text-2xl font-bold text-amber-700">{stats.required}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-200/50">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-lg font-semibold">Daftar Template Dokumen</CardTitle>
                <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Kode</TableHead>
                      <TableHead>Nama Template</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-center">Wajib</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Tidak ada template ditemukan</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => {
                        const catConfig = getCategoryConfig(template.kategori);
                        return (
                          <TableRow key={template.id} className="group">
                            <TableCell className="font-mono text-sm text-gray-600">
                              {template.kode}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-gray-900">{template.nama}</p>
                                {template.deskripsi && (
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {template.deskripsi}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="gap-1">
                                <span>{catConfig.icon}</span>
                                {catConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {template.is_required ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={template.is_active ? 'default' : 'secondary'}
                                className={cn(
                                  template.is_active
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-gray-100 text-gray-500'
                                )}
                              >
                                {template.is_active ? 'Aktif' : 'Tidak Aktif'}
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
                                  {onPreview && (
                                    <DropdownMenuItem onClick={() => onPreview(template)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Preview
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleEdit(template)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplikat
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleStatus(template)}>
                                    {template.is_active ? (
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
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(template)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus template "{templateToDelete?.nama}"? Tindakan ini
              tidak dapat dibatalkan.
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
