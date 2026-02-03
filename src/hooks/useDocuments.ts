
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
} from '@/types/document';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

// --- Templates (Placeholder / Future API) ---
export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const loading = false;

  const fetchTemplates = useCallback(async () => {
    // TODO: Implement API for templates
    setTemplates([]);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const templatesByCategory = useMemo(() => {
    return {
      visa: [], kontrak: [], administrasi: [], kesehatan: [], pendidikan: [], keuangan: [], lainnya: [],
    } as Record<DocumentCategory, DocumentTemplate[]>;
  }, [templates]);

  return {
    templates, templatesByCategory, loading, creating: false, updating: false,
    createTemplate: async () => true,
    updateTemplate: async () => true,
    deleteTemplate: async () => true,
    refetch: fetchTemplates,
  };
}

// --- Variables (Placeholder / Future API) ---
export function useDocumentVariables() {
  const [variables, setVariables] = useState<DocumentVariable[]>([]);
  const loading = false;

  const fetchVariables = useCallback(async () => {
    // TODO: Implement API for variables
    setVariables([]);
  }, []);

  useEffect(() => { fetchVariables(); }, [fetchVariables]);

  const variablesByCategory = useMemo(() => {
    return {
      siswa: [], perusahaan: [], kumiai: [], program: [], lpk: [], job_order: [], sistem: [],
    } as Record<VariableCategory, DocumentVariable[]>;
  }, [variables]);

  return {
    variables, variablesByCategory, loading, creating: false, updating: false,
    createVariable: async () => true,
    updateVariable: async () => true,
    deleteVariable: async () => true,
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

      // Transform logic if needed, currently direct mapping usually works
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
    // Note: 'data' here might be FormData if we changed the UI to support file upload.
    // If the UI is still passing logic/objects, we need to adapt.
    // Assuming UI passes: { siswa_magang_id, nama, file: FileObj, keterangan }
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
    // TODO: Implement initialization logic (copy templates to siswa doc records)
    return true;
  };

  return {
    documents, loading, updating,
    createDocument, updateDocument, deleteDocument, initializeDocumentsForSiswa,
    refetch: fetchDocuments,
  };
}

// --- Mail Merge ---
export function useDocumentMailMerge() {
  const formatValue = (value: any, formatType: VariableFormatType): string => {
    return String(value); // Simplified for now
  };
  const mergeDocument = async (templateContent: string, variables: DocumentVariable[], siswaMagangId: string): Promise<string> => {
    return templateContent; // Simplified
  };
  return { formatValue, mergeDocument };
}
