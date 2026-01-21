
import React, { useState } from "react";
import { Plus, Briefcase, Eye, Edit, Trash2 } from "lucide-react";
import { usePerusahaan } from "@/hooks/usePerusahaan";
import { PerusahaanInlineForm } from "@/components/PerusahaanInlineForm";
import { PerusahaanDetail } from "@/components/PerusahaanDetail";
import { PerusahaanCardRenderer } from "@/components/PerusahaanCardRenderer";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GridControls } from "@/components/GridControls";
import { GridView } from "@/components/GridView";
import { useGridView } from "@/hooks/useGridView";
import { ErrorBoundary, DataErrorFallback } from "@/components/ErrorBoundary";
import { ModulePageLayout, ModuleStatCard } from "@/components/layout/ModulePageLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PerusahaanItem = {
  id: string;
  nama: string;
  kode: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  bidang_usaha: string | null;
  kapasitas: number | null;
  status: "Aktif" | "Nonaktif";
  kumiai_id: string | null;
  kumiai: { id: string; nama: string; kode: string; } | null;
};

function PerusahaanContent() {
  const { perusahaan, isLoading, deletePerusahaan, isDeleting, error, refetch } = usePerusahaan();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    editingItem,
    isCreating,
    viewingItem,
    startEdit,
    startCreate,
    startView,
    cancelEdit,
    isEditing,
    isViewing,
  } = useInlineEdit<PerusahaanItem>();
  const { viewMode, setViewMode, sortField, sortDirection, handleSortChange, sortData } = useGridView();

  if (error && !isLoading) {
    return <DataErrorFallback error={error} retry={() => refetch()} />;
  }

  const sortOptions = [
    { value: 'nama', label: 'Nama' },
    { value: 'kode', label: 'Kode' },
    { value: 'kapasitas', label: 'Kapasitas' },
  ];

  const filteredPerusahaan = (perusahaan || []).filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPerusahaan = sortData(filteredPerusahaan.map(p => ({ ...p, status: "Aktif" as const })) as PerusahaanItem[]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (isCreating || isEditing) {
    return (
      <PerusahaanInlineForm
        perusahaan={editingItem || undefined}
        onCancel={cancelEdit}
        onSuccess={() => cancelEdit()}
      />
    );
  }

  if (isViewing && viewingItem) {
    return (
      <PerusahaanDetail
        perusahaan={viewingItem}
        onEdit={() => startEdit(viewingItem)}
        onBack={cancelEdit}
      />
    );
  }

  const totalPerusahaan = perusahaan?.length || 0;
  const totalKapasitas = perusahaan?.reduce((sum, p) => sum + (p.kapasitas || 0), 0) || 0;
  const bidangUsaha = new Set(perusahaan?.map(p => p.bidang_usaha).filter(Boolean)).size;

  return (
    <ModulePageLayout
      title="Data Perusahaan"
      subtitle="Kelola data perusahaan mitra kerja"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      actions={
        <Button size="sm" onClick={startCreate} className="h-8">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Perusahaan
        </Button>
      }
      stats={
        <>
          <ModuleStatCard label="Total Perusahaan" value={totalPerusahaan} icon={<Briefcase className="w-4 h-4" />} color="primary" />
          <ModuleStatCard label="Total Kapasitas" value={totalKapasitas} icon={<Briefcase className="w-4 h-4" />} color="success" />
          <ModuleStatCard label="Bidang Usaha" value={bidangUsaha} icon={<Briefcase className="w-4 h-4" />} color="purple" />
        </>
      }
      filters={
        <GridControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
          totalItems={sortedPerusahaan.length}
        />
      }
    >
      <div className="p-0 overflow-x-auto">
        <ErrorBoundary fallback={({ error, retry }) => <DataErrorFallback error={error} retry={retry} />}>
          {viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Kode</TableHead>
                  <TableHead>Nama Perusahaan</TableHead>
                  <TableHead>Kumiai</TableHead>
                  <TableHead>Bidang Usaha</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPerusahaan.map((item) => (
                  <TableRow key={item.id} className="group transition-colors">
                    <TableCell className="font-mono text-xs font-semibold">{item.kode}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.nama}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{item.alamat}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium">{item.kumiai?.nama || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                        {item.bidang_usaha || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold tabular-nums">{item.kapasitas || 0}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startView(item)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Perusahaan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Yakin ingin menghapus "{item.nama}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePerusahaan(item.id)} className="bg-destructive text-destructive-foreground">
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4">
              <GridView
                viewMode={viewMode}
                items={sortedPerusahaan}
                renderCard={(item) => (
                  <PerusahaanCardRenderer
                    key={item.id}
                    item={item}
                    onEdit={startEdit}
                    onView={startView}
                    onDelete={deletePerusahaan}
                  />
                )}
              />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </ModulePageLayout>
  );
}

export default function Perusahaan() {
  return (
    <ErrorBoundary>
      <PerusahaanContent />
    </ErrorBoundary>
  );
}
