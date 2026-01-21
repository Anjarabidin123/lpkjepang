import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Users,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Upload,
  MoreHorizontal,
  RefreshCw,
  FileCheck,
  FileClock,
  FileX,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siswaMagangTable, siswaTable } from '@/lib/localStorage/tables';
import { useSiswaDocuments, useDocumentTemplates, useDocumentVariables, useDocumentMailMerge } from '@/hooks/useDocuments';
import { SiswaDocument, DOCUMENT_STATUSES, DocumentStatus, DOCUMENT_CATEGORIES } from '@/types/document';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface SiswaWithDocuments {
  id: string;
  siswa_magang_id: string;
  nama: string;
  nik?: string;
  foto_url?: string;
  documents: SiswaDocument[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    rejected: number;
    percentage: number;
  };
}

export function StudentDocumentTracker() {
  const { documents, loading, updateDocument, initializeDocumentsForSiswa, refetch } = useSiswaDocuments();
  const { templates } = useDocumentTemplates();
  const { variables } = useDocumentVariables();
  const { mergeDocument } = useDocumentMailMerge();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [siswaList, setSiswaList] = useState<SiswaWithDocuments[]>([]);
  const [loadingSiswa, setLoadingSiswa] = useState(true);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaWithDocuments | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<SiswaDocument | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const fetchSiswaList = useCallback(() => {
    try {
      setLoadingSiswa(true);
      
      const siswaMagangData = siswaMagangTable.getAll();
      
      const siswaWithDocs: SiswaWithDocuments[] = siswaMagangData.map((sm: any) => {
        const siswa = sm.siswa_id ? siswaTable.getById(sm.siswa_id) : null;
        const siswaDocs = documents.filter((d) => d.siswa_magang_id === sm.id);
        const completedCount = siswaDocs.filter((d) => d.status === 'verified').length;
        const pendingCount = siswaDocs.filter((d) => ['pending', 'draft', 'uploaded', 'review'].includes(d.status)).length;
        const rejectedCount = siswaDocs.filter((d) => d.status === 'rejected').length;
        const totalRequired = templates.filter((t) => t.is_required && t.is_active).length;

        return {
          id: siswa?.id || sm.id,
          siswa_magang_id: sm.id,
          nama: siswa?.nama || 'Unknown',
          nik: siswa?.nik,
          foto_url: siswa?.foto_url,
          documents: siswaDocs,
          stats: {
            total: Math.max(totalRequired, siswaDocs.length),
            completed: completedCount,
            pending: pendingCount,
            rejected: rejectedCount,
            percentage: totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0,
          },
        };
      });

      setSiswaList(siswaWithDocs);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Gagal memuat data siswa: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoadingSiswa(false);
    }
  }, [documents, templates, toast]);

  useEffect(() => {
    fetchSiswaList();
  }, [fetchSiswaList]);

  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const matchesSearch =
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nik?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'complete' && s.stats.percentage === 100) ||
        (filterStatus === 'incomplete' && s.stats.percentage < 100) ||
        (filterStatus === 'has_rejected' && s.stats.rejected > 0);
      return matchesSearch && matchesStatus;
    });
  }, [siswaList, searchTerm, filterStatus]);

  const overallStats = useMemo(() => {
    const totalSiswa = siswaList.length;
    const completeSiswa = siswaList.filter((s) => s.stats.percentage === 100).length;
    const incompleteSiswa = totalSiswa - completeSiswa;
    const hasRejected = siswaList.filter((s) => s.stats.rejected > 0).length;
    return { totalSiswa, completeSiswa, incompleteSiswa, hasRejected };
  }, [siswaList]);

  const handleInitializeDocuments = async (siswaMagangId: string) => {
    const success = await initializeDocumentsForSiswa(siswaMagangId);
    if (success) {
      fetchSiswaList();
    }
  };

  const handleUpdateStatus = async (documentId: string, newStatus: DocumentStatus) => {
    const success = await updateDocument(documentId, { 
      status: newStatus, 
      catatan: statusNote || undefined,
      verified_at: newStatus === 'verified' ? new Date().toISOString() : undefined,
    });
    if (success) {
      setDetailDialogOpen(false);
      setSelectedDocument(null);
      setStatusNote('');
      fetchSiswaList();
    }
  };

  const handlePreviewDocument = async (doc: SiswaDocument) => {
    if (!doc.document_template) return;
    
    setLoadingPreview(true);
    setPreviewDialogOpen(true);
    
    try {
      const content = await mergeDocument(
        doc.document_template.template_content,
        variables,
        doc.siswa_magang_id
      );
      setPreviewContent(content);
    } catch (error) {
      setPreviewContent('<p class="text-red-500">Gagal memuat preview dokumen</p>');
    } finally {
      setLoadingPreview(false);
    }
  };

  const getStatusConfig = (status: DocumentStatus) => {
    return DOCUMENT_STATUSES.find((s) => s.value === status) || DOCUMENT_STATUSES[0];
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'review':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'uploaded':
        return <Upload className="h-4 w-4 text-cyan-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading || loadingSiswa) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Siswa</p>
                <p className="text-2xl font-bold text-slate-700">{overallStats.totalSiswa}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-200/50">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Dokumen Lengkap</p>
                <p className="text-2xl font-bold text-emerald-700">{overallStats.completeSiswa}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-200/50">
                <FileCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Belum Lengkap</p>
                <p className="text-2xl font-bold text-amber-700">{overallStats.incompleteSiswa}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-200/50">
                <FileClock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Ada Ditolak</p>
                <p className="text-2xl font-bold text-red-700">{overallStats.hasRejected}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-200/50">
                <FileX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">Tracking Dokumen Siswa</CardTitle>
              <CardDescription>Monitor kelengkapan dokumen setiap siswa magang</CardDescription>
            </div>
            <Button variant="outline" onClick={() => { refetch(); fetchSiswaList(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau NIK siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="complete">Dokumen Lengkap</SelectItem>
                <SelectItem value="incomplete">Belum Lengkap</SelectItem>
                <SelectItem value="has_rejected">Ada Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredSiswa.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Tidak ada data siswa ditemukan</p>
                </div>
              ) : (
                filteredSiswa.map((siswa) => (
                  <Card
                    key={siswa.siswa_magang_id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md border',
                      selectedSiswa?.siswa_magang_id === siswa.siswa_magang_id
                        ? 'border-blue-300 bg-blue-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => setSelectedSiswa(selectedSiswa?.siswa_magang_id === siswa.siswa_magang_id ? null : siswa)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={siswa.foto_url} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                            {siswa.nama.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 truncate">{siswa.nama}</p>
                              {siswa.nik && <p className="text-sm text-gray-500">{siswa.nik}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  siswa.stats.percentage === 100
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : siswa.stats.rejected > 0
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                )}
                              >
                                {siswa.stats.percentage}% Lengkap
                              </Badge>
                              <ChevronRight
                                className={cn(
                                  'h-5 w-5 text-gray-400 transition-transform',
                                  selectedSiswa?.siswa_magang_id === siswa.siswa_magang_id && 'rotate-90'
                                )}
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress value={siswa.stats.percentage} className="h-2" />
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-emerald-600">{siswa.stats.completed} Selesai</span>
                            <span className="text-amber-600">{siswa.stats.pending} Pending</span>
                            {siswa.stats.rejected > 0 && (
                              <span className="text-red-600">{siswa.stats.rejected} Ditolak</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedSiswa?.siswa_magang_id === siswa.siswa_magang_id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-gray-700">Daftar Dokumen</h4>
                            {siswa.documents.length === 0 && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInitializeDocuments(siswa.siswa_magang_id);
                                }}
                              >
                                Inisialisasi Dokumen
                              </Button>
                            )}
                          </div>
                          {siswa.documents.length > 0 ? (
                            <div className="space-y-2">
                              {siswa.documents.map((doc) => {
                                const statusConfig = getStatusConfig(doc.status);
                                const catConfig = DOCUMENT_CATEGORIES.find(
                                  (c) => c.value === doc.document_template?.kategori
                                );
                                return (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center gap-3">
                                      {getStatusIcon(doc.status)}
                                      <div>
                                        <p className="font-medium text-sm text-gray-800">
                                          {catConfig?.icon} {doc.document_template?.nama || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500">{doc.document_template?.kode}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() => handlePreviewDocument(doc)}
                                          >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Preview
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedDocument(doc);
                                              setDetailDialogOpen(true);
                                            }}
                                          >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Update Status
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => handlePreviewDocument(doc)}>
                                            <Printer className="h-4 w-4 mr-2" />
                                            Cetak
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Belum ada dokumen. Klik "Inisialisasi Dokumen" untuk memulai.
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Dokumen</DialogTitle>
            <DialogDescription>
              {selectedDocument?.document_template?.nama}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status Saat Ini</Label>
              <Badge className={getStatusConfig(selectedDocument?.status || 'pending').color}>
                {getStatusConfig(selectedDocument?.status || 'pending').label}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Pilih Status Baru</Label>
              <div className="grid grid-cols-2 gap-2">
                {DOCUMENT_STATUSES.filter((s) => s.value !== selectedDocument?.status).map((status) => (
                  <Button
                    key={status.value}
                    variant="outline"
                    className={cn('justify-start', status.color)}
                    onClick={() => handleUpdateStatus(selectedDocument?.id || '', status.value)}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Tambahkan catatan..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview Dokumen</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {loadingPreview ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size={32} />
              </div>
            ) : (
              <div
                className="prose prose-sm max-w-none p-4 bg-white border rounded-lg"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Tutup
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Cetak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
