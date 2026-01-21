import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  FileText,
  Save,
  X,
  Variable,
  ChevronDown,
  ChevronUp,
  Eye,
  Code,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentVariables } from '@/hooks/useDocuments';
import {
  DocumentTemplate,
  CreateDocumentTemplateData,
  UpdateDocumentTemplateData,
  DOCUMENT_CATEGORIES,
  VARIABLE_CATEGORIES,
  DocumentVariable,
} from '@/types/document';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';

interface DocumentTemplateFormProps {
  template?: DocumentTemplate | null;
  onSave: (data: CreateDocumentTemplateData | UpdateDocumentTemplateData) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
}

export function DocumentTemplateForm({ template, onSave, onCancel, loading }: DocumentTemplateFormProps) {
  const { variables, variablesByCategory, loading: loadingVariables } = useDocumentVariables();
  const [formData, setFormData] = useState<CreateDocumentTemplateData>({
    kode: '',
    nama: '',
    kategori: 'administrasi',
    deskripsi: '',
    template_content: '',
    is_required: true,
    is_active: true,
    urutan: 0,
  });
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['siswa']);
  const editorRef = useRef<RichTextEditorRef>(null);

  useEffect(() => {
    if (template) {
      setFormData({
        kode: template.kode,
        nama: template.nama,
        kategori: template.kategori,
        deskripsi: template.deskripsi || '',
        template_content: template.template_content,
        is_required: template.is_required,
        is_active: template.is_active,
        urutan: template.urutan,
      });
    }
  }, [template]);

  const handleInsertVariable = (variable: DocumentVariable) => {
    if (editorRef.current) {
      editorRef.current.insertVariable(variable.nama);
    } else {
      setFormData((prev) => ({
        ...prev,
        template_content: prev.template_content + `{{${variable.nama}}}`,
      }));
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const renderPreview = () => {
    let content = formData.template_content;
    variables.forEach((v) => {
      const placeholder = `{{${v.nama}}}`;
      const replacement = `<span class="bg-amber-100 text-amber-800 px-1 rounded font-mono text-sm">${v.display_name}</span>`;
      content = content.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), replacement);
    });
    return content;
  };

  return (
    <Card className="border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                {template ? 'Edit Template Dokumen' : 'Buat Template Dokumen Baru'}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">
                {template ? `Perbarui konfigurasi untuk "${template.nama}"` : 'Buat template dokumen dengan variabel mail merge'}
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
              <h3 className="font-semibold text-gray-800 mb-4">Detail Template</h3>

              <div className="space-y-2">
                <Label htmlFor="kode">Kode Template <span className="text-red-500">*</span></Label>
                <Input
                  id="kode"
                  value={formData.kode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kode: e.target.value.toUpperCase() }))}
                  placeholder="DOC-VISA-001"
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama">Nama Template <span className="text-red-500">*</span></Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                  placeholder="Formulir Aplikasi Visa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(v) => setFormData((prev) => ({ ...prev, kategori: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))}
                  placeholder="Deskripsi template dokumen..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urutan">Urutan</Label>
                <Input
                  id="urutan"
                  type="number"
                  value={formData.urutan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, urutan: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_required: checked === true }))}
                />
                <Label htmlFor="is_required" className="cursor-pointer">Dokumen Wajib</Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked === true }))}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Aktif</Label>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Konten Template</h3>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Variable className="h-4 w-4" />
                          Sisipkan Variabel
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-3 border-b bg-gray-50">
                          <h4 className="font-semibold text-sm">Variabel Tersedia</h4>
                          <p className="text-xs text-gray-500 mt-1">Klik untuk menyisipkan ke template</p>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="p-2">
                            {VARIABLE_CATEGORIES.map((cat) => {
                              const catVariables = variablesByCategory[cat.value] || [];
                              if (catVariables.length === 0) return null;
                              const isExpanded = expandedCategories.includes(cat.value);
                              return (
                                <Collapsible key={cat.value} open={isExpanded} onOpenChange={() => toggleCategory(cat.value)}>
                                  <CollapsibleTrigger asChild>
                                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-sm font-medium">
                                      {cat.label}
                                      <Badge variant="secondary" className="ml-2">
                                        {catVariables.length}
                                      </Badge>
                                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="pl-2 pb-2 space-y-1">
                                      {catVariables.map((v) => (
                                        <button
                                          key={v.id}
                                          type="button"
                                          onClick={() => handleInsertVariable(v)}
                                          className="w-full text-left p-2 rounded hover:bg-blue-50 text-sm group"
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-gray-700 group-hover:text-blue-700">{v.display_name}</span>
                                            <Plus className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                                          </div>
                                          <code className="text-xs text-gray-400 font-mono">{`{{${v.nama}}}`}</code>
                                        </button>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>

                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setViewMode('edit')}
                        className={cn(
                          'px-3 py-1.5 text-sm font-medium flex items-center gap-1.5',
                          viewMode === 'edit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <Code className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={cn(
                          'px-3 py-1.5 text-sm font-medium flex items-center gap-1.5',
                          viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>

                <div className="flex-1 p-4">
                  {viewMode === 'edit' ? (
                    <RichTextEditor
                      ref={editorRef}
                      content={formData.template_content}
                      onChange={(html) => setFormData((prev) => ({ ...prev, template_content: html }))}
                      className="min-h-[400px]"
                    />
                  ) : (
                    <div className="h-[400px] border rounded-lg p-4 overflow-auto bg-white">
                      <style dangerouslySetInnerHTML={{ __html: `
                        .preview-content table {
                          border-collapse: collapse;
                          width: 100%;
                          margin-bottom: 1rem;
                        }
                        .preview-content td, .preview-content th {
                          border: 1px solid #ced4da;
                          padding: 8px;
                          vertical-align: top;
                        }
                        .preview-content th {
                          background-color: #f8f9fa;
                          font-weight: bold;
                        }
                      ` }} />
                      <div
                        className="prose prose-sm max-w-none preview-content"
                        dangerouslySetInnerHTML={{ __html: renderPreview() }}
                      />
                    </div>
                  )}
                </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {formData.template_content && (
                <span>
                  {(formData.template_content.match(/\{\{[^}]+\}\}/g) || []).length} variabel digunakan
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.kode || !formData.nama}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span className="ml-2">Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
