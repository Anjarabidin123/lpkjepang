
import React, { useState } from "react";
import { Plus, Building2, Eye, Edit, Trash2 } from "lucide-react";
import { useKumiai, type Kumiai as KumiaiType } from "@/hooks/useKumiai";
import { KumiaiInlineForm } from "@/components/KumiaiInlineForm";
import { KumiaiInlineDetail } from "@/components/KumiaiInlineDetail";
import { KumiaiCardRenderer } from "@/components/KumiaiCardRenderer";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GridControls } from "@/components/GridControls";
import { GridView } from "@/components/GridView";
import { useGridView } from "@/hooks/useGridView";
import { ErrorBoundary, DataErrorFallback } from "@/components/ErrorBoundary";
import { ModulePageLayout, ModuleStatCard } from "@/components/layout/ModulePageLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function KumiaiContent() {
  const { kumiai, isLoading, deleteKumiai, isDeleting, error, refetch } = useKumiai();
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
  } = useInlineEdit<KumiaiType>();
  const { viewMode, setViewMode, sortField, sortDirection, handleSortChange, sortData } = useGridView();

  if (error && !isLoading) {
    return <DataErrorFallback error={error} retry={() => refetch()} />;
  }

  const sortOptions = [
    { value: 'nama', label: 'Nama' },
    { value: 'kode', label: 'Kode' },
    { value: 'jumlah_perusahaan', label: 'Perusahaan' },
  ];

  const filteredKumiai = (kumiai || []).filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedKumiai = sortData(filteredKumiai);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (isCreating || isEditing) {
    return (
      <KumiaiInlineForm
        kumiai={editingItem || undefined}
        onCancel={cancelEdit}
        onSuccess={() => cancelEdit()}
      />
    );
  }

  if (isViewing && viewingItem) {
    return (
      <KumiaiInlineDetail
        kumiai={viewingItem}
        onEdit={() => startEdit(viewingItem)}
        onBack={cancelEdit}
      />
    );
  }

  const totalKumiai = kumiai?.length || 0;
  const totalPerusahaan = kumiai?.reduce((sum, k) => sum + (k.jumlah_perusahaan || 0), 0) || 0;
  const avgPerusahaan = totalKumiai > 0 ? Math.round(totalPerusahaan / totalKumiai) : 0;

  return (
    <ModulePageLayout
      title="Data Kumiai"
      subtitle="Kelola data kumiai dan perusahaan mitra"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      actions={
        <Button size="sm" onClick={startCreate} className="h-8">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Kumiai
        </Button>
      }
      stats={
        <>
          <ModuleStatCard label="Total Kumiai" value={totalKumiai} icon={<Building2 className="w-4 h-4" />} color="primary" />
          <ModuleStatCard label="Total Perusahaan" value={totalPerusahaan} icon={<Building2 className="w-4 h-4" />} color="success" />
          <ModuleStatCard label="Rata-rata Mitra" value={`${avgPerusahaan}/Kumiai`} icon={<Building2 className="w-4 h-4" />} color="purple" />
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
          totalItems={sortedKumiai.length}
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
                  <TableHead>Nama Kumiai</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKumiai.map((item) => (
                  <TableRow key={item.id} className="group transition-colors">
                    <TableCell className="font-mono text-xs font-semibold">{item.kode}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.nama}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{item.alamat}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {item.jumlah_perusahaan || 0} Mitra
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{item.pic_nama || '-'}</span>
                        <span className="text-[10px] text-slate-500">{item.pic_telepon || '-'}</span>
                      </div>
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
                              <AlertDialogTitle>Hapus Kumiai</AlertDialogTitle>
                              <AlertDialogDescription>
                                Yakin ingin menghapus "{item.nama}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteKumiai(item.id)} className="bg-destructive text-destructive-foreground">
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
                items={sortedKumiai}
                renderCard={(item) => (
                  <KumiaiCardRenderer
                    key={item.id}
                    item={item}
                    onEdit={startEdit}
                    onView={startView}
                    onDelete={deleteKumiai}
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

export default function Kumiai() {
  return (
    <ErrorBoundary>
      <KumiaiContent />
    </ErrorBoundary>
  );
}
