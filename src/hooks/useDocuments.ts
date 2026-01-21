import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  documentTemplatesTable,
  documentVariablesTable,
  siswaDocumentsTable,
  siswaMagangTable,
  siswaTable,
  perusahaanTable,
  kumiaiTable,
  programTable,
  profilLpkTable,
} from '@/lib/localStorage/tables';
import {
  DocumentTemplate,
  DocumentVariable,
  SiswaDocument,
  CreateDocumentTemplateData,
  UpdateDocumentTemplateData,
  CreateDocumentVariableData,
  UpdateDocumentVariableData,
  CreateSiswaDocumentData,
  UpdateSiswaDocumentData,
  DocumentCategory,
  VariableCategory,
  VariableFormatType,
} from '@/types/document';

export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = useCallback(() => {
    try {
      setLoading(true);
      const data = documentTemplatesTable.getAll();
      const sortedData = data.sort((a, b) => {
        if (a.urutan !== b.urutan) return a.urutan - b.urutan;
        return a.nama.localeCompare(b.nama);
      });
      setTemplates(sortedData as DocumentTemplate[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memuat template dokumen: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (data: CreateDocumentTemplateData): Promise<boolean> => {
    try {
      setCreating(true);
      documentTemplatesTable.create({
        ...data,
        is_required: data.is_required ?? true,
        is_active: data.is_active ?? true,
        urutan: data.urutan ?? 0,
      });

      toast({
        title: 'Berhasil',
        description: 'Template dokumen berhasil dibuat',
      });
      fetchTemplates();
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
      documentTemplatesTable.update(id, data);

      toast({
        title: 'Berhasil',
        description: 'Template dokumen berhasil diperbarui',
      });
      fetchTemplates();
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
      documentTemplatesTable.delete(id);

      toast({
        title: 'Berhasil',
        description: 'Template dokumen berhasil dihapus',
      });
      fetchTemplates();
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

  const templatesByCategory = useMemo(() => {
    const grouped: Record<DocumentCategory, DocumentTemplate[]> = {
      visa: [],
      kontrak: [],
      administrasi: [],
      kesehatan: [],
      pendidikan: [],
      keuangan: [],
      lainnya: [],
    };
    templates.forEach((t) => {
      const cat = t.kategori as DocumentCategory;
      if (grouped[cat]) {
        grouped[cat].push(t);
      } else {
        grouped.lainnya.push(t);
      }
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

export function useDocumentVariables() {
  const [variables, setVariables] = useState<DocumentVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchVariables = useCallback(() => {
    try {
      setLoading(true);
      const data = documentVariablesTable.getAll();
      const sortedData = data.sort((a, b) => {
        if (a.kategori !== b.kategori) return a.kategori.localeCompare(b.kategori);
        return a.display_name.localeCompare(b.display_name);
      });
      setVariables(sortedData as DocumentVariable[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memuat variabel: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const createVariable = async (data: CreateDocumentVariableData): Promise<boolean> => {
    try {
      setCreating(true);
      documentVariablesTable.create({
        ...data,
        format_type: data.format_type ?? 'text',
        is_active: data.is_active ?? true,
      });

      toast({
        title: 'Berhasil',
        description: 'Variabel berhasil dibuat',
      });
      fetchVariables();
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
      documentVariablesTable.update(id, data);

      toast({
        title: 'Berhasil',
        description: 'Variabel berhasil diperbarui',
      });
      fetchVariables();
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
      documentVariablesTable.delete(id);

      toast({
        title: 'Berhasil',
        description: 'Variabel berhasil dihapus',
      });
      fetchVariables();
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

  const variablesByCategory = useMemo(() => {
    const grouped: Record<VariableCategory, DocumentVariable[]> = {
      siswa: [],
      perusahaan: [],
      kumiai: [],
      program: [],
      lpk: [],
      job_order: [],
      sistem: [],
    };
    variables.forEach((v) => {
      const cat = v.kategori as VariableCategory;
      if (grouped[cat]) {
        grouped[cat].push(v);
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

export function useSiswaDocuments(siswa_magang_id?: string) {
  const [documents, setDocuments] = useState<SiswaDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = useCallback(() => {
    try {
      setLoading(true);
      let data = siswaDocumentsTable.getAll();

      if (siswa_magang_id) {
        data = data.filter((d: any) => d.siswa_magang_id === siswa_magang_id);
      }

      const enrichedData = data.map((doc: any) => {
        const template = documentTemplatesTable.getById(doc.document_template_id);
        const siswaMagang = siswaMagangTable.getById(doc.siswa_magang_id);
        const siswa = siswaMagang ? siswaTable.getById(siswaMagang.siswa_id) : null;

        return {
          ...doc,
          document_template: template,
          siswa_magang: siswaMagang ? {
            id: siswaMagang.id,
            siswa: siswa ? {
              id: siswa.id,
              nama: siswa.nama,
              nik: siswa.nik,
              foto_url: siswa.foto_url,
            } : null,
          } : null,
        };
      });

      setDocuments(enrichedData as SiswaDocument[]);
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

  const createDocument = async (data: CreateSiswaDocumentData): Promise<boolean> => {
    try {
      siswaDocumentsTable.create({
        ...data,
        status: data.status ?? 'pending',
      });

      toast({
        title: 'Berhasil',
        description: 'Dokumen siswa berhasil dibuat',
      });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal membuat dokumen: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateDocument = async (id: string, data: UpdateSiswaDocumentData): Promise<boolean> => {
    try {
      setUpdating(true);
      siswaDocumentsTable.update(id, data);

      toast({
        title: 'Berhasil',
        description: 'Status dokumen berhasil diperbarui',
      });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memperbarui dokumen: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      siswaDocumentsTable.delete(id);

      toast({
        title: 'Berhasil',
        description: 'Dokumen siswa berhasil dihapus',
      });
      fetchDocuments();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal menghapus dokumen: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  const initializeDocumentsForSiswa = async (siswaMagangId: string): Promise<boolean> => {
    try {
      const requiredTemplates = documentTemplatesTable.getAll().filter(
        (t: any) => t.is_active && t.is_required
      );

      if (!requiredTemplates || requiredTemplates.length === 0) return true;

      const existingDocs = siswaDocumentsTable.getAll().filter(
        (d: any) => d.siswa_magang_id === siswaMagangId
      );
      const existingTemplateIds = new Set(existingDocs.map((d: any) => d.document_template_id));

      requiredTemplates.forEach((template: any) => {
        if (!existingTemplateIds.has(template.id)) {
          siswaDocumentsTable.create({
            siswa_magang_id: siswaMagangId,
            document_template_id: template.id,
            status: 'pending',
          });
        }
      });

      fetchDocuments();
      toast({
        title: 'Berhasil',
        description: 'Dokumen siswa berhasil diinisialisasi',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal inisialisasi dokumen: ${error.message}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    documents,
    loading,
    updating,
    createDocument,
    updateDocument,
    deleteDocument,
    initializeDocumentsForSiswa,
    refetch: fetchDocuments,
  };
}

export function useDocumentMailMerge() {
  const formatValue = (value: any, formatType: VariableFormatType): string => {
    if (value === null || value === undefined) return '';

    switch (formatType) {
      case 'date': {
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      case 'date_jp': {
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      }
      case 'currency': {
        const num = Number(value);
        if (isNaN(num)) return String(value);
        return `Rp ${num.toLocaleString('id-ID')}`;
      }
      case 'currency_jp': {
        const num = Number(value);
        if (isNaN(num)) return String(value);
        return `¥${num.toLocaleString('ja-JP')}`;
      }
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'number': {
        const num = Number(value);
        if (isNaN(num)) return String(value);
        return num.toLocaleString('id-ID');
      }
      case 'phone': {
        const phone = String(value).replace(/\D/g, '');
        if (phone.startsWith('62')) {
          return `+${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 9)}-${phone.slice(9)}`;
        }
        return value;
      }
      default:
        return String(value);
    }
  };

  const getSystemValue = (field: string): string => {
    const now = new Date();
    switch (field) {
      case 'current_date':
        return now.toISOString();
      case 'current_year':
        return now.getFullYear().toString();
      default:
        return '';
    }
  };

  const mergeDocument = async (
    templateContent: string,
    variables: DocumentVariable[],
    siswaMagangId: string
  ): Promise<string> => {
    try {
      const siswaMagang = siswaMagangTable.getById(siswaMagangId);
      if (!siswaMagang) {
        console.error('Siswa magang not found');
        return templateContent;
      }

      const siswa = siswaMagang.siswa_id ? siswaTable.getById(siswaMagang.siswa_id) : null;
      const perusahaan = siswaMagang.perusahaan_id ? perusahaanTable.getById(siswaMagang.perusahaan_id) : null;
      const kumiai = siswaMagang.kumiai_id ? kumiaiTable.getById(siswaMagang.kumiai_id) : null;
      const program = siswaMagang.program_id ? programTable.getById(siswaMagang.program_id) : null;
      const lpkProfile = profilLpkTable.getAll()[0] || null;

      const dataContext: Record<string, any> = {
        siswa: siswa || {},
        perusahaan: perusahaan || {},
        kumiai: kumiai || {},
        program: program || {},
        lpk_profile: lpkProfile || {},
        _system: {},
      };

      let result = templateContent;

      variables.forEach((variable) => {
        const placeholder = `{{${variable.nama}}}`;
        let value: any;

        if (variable.source_table === '_system') {
          value = getSystemValue(variable.source_field);
        } else {
          const tableData = dataContext[variable.source_table];
          value = tableData?.[variable.source_field] || variable.default_value || '';
        }

        const formattedValue = formatValue(value, variable.format_type);
        result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), formattedValue);
      });

      return result;
    } catch (error: any) {
      console.error('Error merging document:', error);
      return templateContent;
    }
  };

  return {
    formatValue,
    mergeDocument,
  };
}
