
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  DocumentTemplate,
  DocumentVariable,
  SiswaDocument,
  CreateSiswaDocumentData,
  UpdateSiswaDocumentData,
  DocumentCategory,
  VariableCategory,
  VariableFormatType,
  CreateDocumentTemplateData,
  UpdateDocumentTemplateData,
} from '@/types/document';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

// --- Templates ---
export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authFetch(endpoints.documentTemplates);
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat template dokumen',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createTemplate = async (data: CreateDocumentTemplateData): Promise<boolean> => {
    try {
      setCreating(true);
      const response = await authFetch(endpoints.documentTemplates, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }

      toast({ title: 'Berhasil', description: 'Template dokumen berhasil dibuat' });
      await fetchTemplates();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal membuat template: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateTemplate = async (id: string, data: UpdateDocumentTemplateData): Promise<boolean> => {
    try {
      setUpdating(true);
      const response = await authFetch(`${endpoints.documentTemplates}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update template');

      toast({ title: 'Berhasil', description: 'Template dokumen berhasil diperbarui' });
      await fetchTemplates();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memperbarui template: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const response = await authFetch(`${endpoints.documentTemplates}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');

      toast({ title: 'Berhasil', description: 'Template dokumen berhasil dihapus' });
      await fetchTemplates();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal menghapus template: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const templatesByCategory = useMemo(() => {
    const grouped = {
      visa: [],
      kontrak: [],
      administrasi: [],
      kesehatan: [],
      pendidikan: [],
      keuangan: [],
      lainnya: [],
    } as Record<DocumentCategory, DocumentTemplate[]>;

    templates.forEach((t) => {
      // Ensure the category exists in the grouped object, fallback to 'lainnya'
      const key = (t.kategori in grouped) ? (t.kategori as DocumentCategory) : 'lainnya';
      grouped[key].push(t);
    });

    return grouped;
  }, [templates]);

  return {
    templates,
    templatesByCategory,
    loading,
    creating,
    updating,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
}

// --- Variables (Placeholder / Future API) ---
export function useDocumentVariables() {
  const [variables, setVariables] = useState<DocumentVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchVariables = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authFetch(endpoints.documentVariables);
      if (!response.ok) throw new Error('Failed to fetch variables');
      const data = await response.json();
      setVariables(data);
    } catch (error: any) {
      console.error('Error fetching variables:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat variabel dokumen',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createVariable = async (data: CreateDocumentVariableData): Promise<boolean> => {
    try {
      setCreating(true);
      const response = await authFetch(endpoints.documentVariables, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create variable');
      }

      toast({ title: 'Berhasil', description: 'Variabel dokumen berhasil dibuat' });
      await fetchVariables();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal membuat variabel: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateVariable = async (id: string, data: UpdateDocumentVariableData): Promise<boolean> => {
    try {
      setUpdating(true);
      const response = await authFetch(`${endpoints.documentVariables}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update variable');

      toast({ title: 'Berhasil', description: 'Variabel dokumen berhasil diperbarui' });
      await fetchVariables();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memperbarui variabel: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteVariable = async (id: string): Promise<boolean> => {
    try {
      const response = await authFetch(`${endpoints.documentVariables}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete variable');

      toast({ title: 'Berhasil', description: 'Variabel dokumen berhasil dihapus' });
      await fetchVariables();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal menghapus variabel: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const variablesByCategory = useMemo(() => {
    const grouped = {
      siswa: [], perusahaan: [], kumiai: [], program: [], lpk: [], job_order: [], sistem: [],
    } as Record<VariableCategory, DocumentVariable[]>;

    variables.forEach((v) => {
      if (v.kategori in grouped) {
        grouped[v.kategori as VariableCategory].push(v);
      }
    });

    return grouped;
  }, [variables]);

  return {
    variables,
    variablesByCategory,
    loading,
    creating,
    updating,
    createVariable,
    updateVariable,
    deleteVariable,
    refetch: fetchVariables,
  };
}

// --- SISWA DOCUMENTS (REAL API) ---
export function useSiswaDocuments(siswa_magang_id?: string) {
  const [documents, setDocuments] = useState<SiswaDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      let url = endpoints.siswaDocuments;
      if (siswa_magang_id) {
        url += `?siswa_magang_id=${siswa_magang_id}`;
      }

      const response = await authFetch(url);
      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();

      // Transform logic if needed
      const mappedData = data.map((d: any) => ({
        ...d,
        document_template: d.template || null // Mapping relation
      }));

      setDocuments(mappedData as SiswaDocument[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memuat dokumen siswa: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [siswa_magang_id, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (data: any): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('siswa_magang_id', data.siswa_magang_id);
      if (data.nama) formData.append('nama', data.nama);
      if (data.keterangan) formData.append('keterangan', data.keterangan);
      if (data.document_template_id) formData.append('document_template_id', data.document_template_id);

      // Critical: File Handling
      if (data.file) {
        formData.append('document', data.file);
      } else {
        // If no file?
        console.warn("No file provided for upload");
      }

      const response = await authFetch(endpoints.siswaDocuments, {
        method: 'POST',
        body: formData, // No Content-Type header needed for FormData
      });

      if (!response.ok) throw new Error('Upload failed');

      toast({ title: 'Berhasil', description: 'Dokumen siswa berhasil diupload' });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: `Gagal upload dokumen: ${error.message}`, variant: 'destructive' });
      return false;
    }
  };

  const updateDocument = async (id: string, data: UpdateSiswaDocumentData): Promise<boolean> => {
    try {
      setUpdating(true);
      const response = await authFetch(`${endpoints.siswaDocuments}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Update failed');

      toast({ title: 'Berhasil', description: 'Status dokumen berhasil diperbarui' });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: `Gagal update dokumen: ${error.message}`, variant: 'destructive' });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const response = await authFetch(`${endpoints.siswaDocuments}/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Deletion failed');

      toast({ title: 'Berhasil', description: 'Dokumen siswa berhasil dihapus' });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: `Gagal hapus dokumen: ${error.message}`, variant: 'destructive' });
      return false;
    }
  };

  const initializeDocumentsForSiswa = async (siswaMagangId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authFetch(`${endpoints.siswaDocuments}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siswa_magang_id: siswaMagangId })
      });

      if (!response.ok) throw new Error('Initialization failed');

      const result = await response.json();
      toast({
        title: 'Berhasil',
        description: `Berhasil menginisialisasi ${result.created} dokumen wajib.`
      });

      await fetchDocuments();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal inisialisasi: ${error.message}`,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents, loading, updating,
    createDocument, updateDocument, deleteDocument, initializeDocumentsForSiswa,
    refetch: fetchDocuments,
  };
}

// --- Mail Merge ---
// --- Mail Merge ---
export function useDocumentMailMerge() {
  const { toast } = useToast();

  const formatValue = (value: any, formatType: VariableFormatType): string => {
    if (value === null || value === undefined) return '-';

    switch (formatType) {
      case 'date':
        return new Date(value).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      case 'currency':
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency', currency: 'JPY', minimumFractionDigits: 0
        }).format(Number(value));
      case 'currency_idr':
        return new Intl.NumberFormat('id-ID', {
          style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(Number(value));
      default:
        return String(value);
    }
  };

  const mergeDocument = async (templateContent: string, variables: DocumentVariable[], siswaMagangId: string): Promise<string> => {
    if (!templateContent) return '';
    if (!siswaMagangId) return templateContent;

    try {
      // 1. Fetch complete data for the student
      const response = await authFetch(`${endpoints.siswaMagang}/${siswaMagangId}`);
      if (!response.ok) throw new Error('Gagal mengambil data siswa');
      const data = await response.json();

      let mergedContent = templateContent;

      // 2. Iterate directly over variables to replace them
      // We do this to ensure we cover all configured variables
      variables.forEach(variable => {
        let rawValue: any = null;

        // Resolve value based on source_table and source_field
        // Mapping tables to API response structure
        const tableMap: Record<string, any> = {
          'siswa': data.siswa,
          'perusahaan': data.perusahaan,
          'kumiai': data.kumiai,
          'lpk_mitra': data.lpk_mitra, // or lpkMitra depending on API casing (snake_case from Laravel usually)
          'program': data.program,
          'jenis_kerja': data.jenis_kerja,
          'posisi_kerja': data.posisi_kerja,
          'job_order': data.job_order, // Might need separate fetch if not included
          'siswa_magang': data, // root object
          '_system': null // System variables like Date
        };

        if (variable.kategori === 'sistem') {
          if (variable.nama === 'tanggal_hari_ini') rawValue = new Date();
          // Add more system variables here
        } else {
          // Find the source object
          // Handle loose mapping for table names if needed
          const sourceObj = tableMap[variable.source_table || 'siswa_magang'] || data[variable.source_table];

          if (sourceObj) {
            rawValue = sourceObj[variable.source_field];
          }
        }

        // Apply formatting and default value
        const formattedValue = rawValue ? formatValue(rawValue, variable.format_type as VariableFormatType) : (variable.default_value || '[-]');

        // Regex to replace all occurrences globally
        // Escaping curly braces for safety
        const placeholder = `{{${variable.nama}}}`;
        // Create regex with escaping special chars
        const regex = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');

        mergedContent = mergedContent.replace(regex, formattedValue);
      });

      return mergedContent;

    } catch (error: any) {
      console.error("Merge error:", error);
      toast({
        title: "Gagal Preview",
        description: "Terjadi kesalahan saat menggabungkan data: " + error.message,
        variant: "destructive"
      });
      return templateContent; // Return original on error
    }
  };

  return { formatValue, mergeDocument };
}
