import React, { useState } from "react";
import { Plus, Users, UserCheck, UserPlus, Search } from "lucide-react";
import { useSiswa } from "@/hooks/useSiswa";
import type { Siswa as SiswaType } from "@/hooks/useSiswa";
import { SiswaInlineForm } from "@/components/SiswaInlineForm";
import { SiswaDetail } from "@/components/SiswaDetail";
import { SiswaCardRenderer } from "@/components/SiswaCardRenderer";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { GridControls } from "@/components/GridControls";
import { GridView } from "@/components/GridView";
import { useGridView } from "@/hooks/useGridView";
import { ErrorBoundary, DataErrorFallback } from "@/components/ErrorBoundary";
import { useDemografiProvinces } from "@/hooks/useDemografiProvinces";
import { useDemografiRegencies } from "@/hooks/useDemografiRegencies";
import { ExportImportActions } from "@/components/ExportImport/ExportImportActions";
import { siswaExportColumns } from "@/components/ExportImport/siswaColumns";
import { importService } from "@/services/importService";
import { toast } from 'sonner';
import { useSiswaRegularColumnVisibility } from "@/hooks/useSiswaRegularColumnVisibility";
import { SiswaRegularColumnVisibilityControl } from "@/components/SiswaRegularColumnVisibilityControl";
import { SiswaRegularTable } from "@/components/SiswaRegularTable";
import { ModulePageLayout, ModuleStatCard } from "@/components/layout/ModulePageLayout";
import { Button } from "@/components/ui/button";

function SiswaContent() {
  const { siswa, isLoading, deleteSiswa, isDeleting, error, refetch } = useSiswa();
  const { provinces } = useDemografiProvinces();
  const { regencies } = useDemografiRegencies();
  const { columns, visibleColumns, toggleColumn } = useSiswaRegularColumnVisibility();
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
  } = useInlineEdit<SiswaType>();
  const { viewMode, setViewMode, sortField, sortDirection, handleSortChange, sortData } = useGridView();

  const handleImport = async (data: Partial<SiswaType>[]) => {
    try {
      const result = await importService.importSiswa(data);
      if (result.success > 0) {
        await refetch();
        toast.success(`Berhasil mengimpor ${result.success} data siswa`);
      }
      if (result.failed > 0) {
        toast.error(`${result.failed} data gagal diimpor.`);
      }
    } catch (error) {
      toast.error('Gagal mengimpor data siswa');
    }
  };

  const getProvinceName = (provinceId: string | null) => {
    if (!provinceId) return '-';
    const province = provinces?.find(p => p.id === provinceId);
    return province ? province.nama : '-';
  };

  const getRegencyName = (regencyId: string | null) => {
    if (!regencyId) return '-';
    const regency = regencies?.find(r => r.id === regencyId);
    return regency ? regency.nama : '-';
  };

  if (error && !isLoading) {
    return <DataErrorFallback error={error} retry={() => refetch()} />;
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      "Proses": "bg-yellow-500/10 text-yellow-600",
      "Diterima": "bg-green-500/10 text-green-600",
      "Ditolak": "bg-destructive/10 text-destructive",
      "Aktif": "bg-primary/10 text-primary"
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const sortOptions = [
    { value: 'nama', label: 'Nama' },
    { value: 'nik', label: 'NIK' },
    { value: 'status', label: 'Status' },
    { value: 'tanggal_daftar', label: 'Tanggal Daftar' },
    { value: 'umur', label: 'Umur' }
  ];

  const filteredSiswa = (siswa || []).filter(s => {
    const search = searchTerm.toLowerCase();
    return (
      (s.nama || "").toLowerCase().includes(search) ||
      (s.nik || "").includes(searchTerm)
    );
  });

  const sortedSiswa = sortData(filteredSiswa);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  const totalSiswa = siswa?.length || 0;
  const siswaAktif = siswa?.filter(s => s.is_available).length || 0;
  const siswaDiterima = siswa?.filter(s => s.status === 'Diterima').length || 0;
  const siswaProses = siswa?.filter(s => s.status === 'Proses').length || 0;

  if (isCreating || isEditing) {
    return (
      <SiswaInlineForm
        siswa={editingItem || undefined}
        onCancel={cancelEdit}
        onSuccess={() => cancelEdit()}
      />
    );
  }

  if (viewingItem) {
    return (
      <SiswaDetail
        siswa={viewingItem}
        onBack={cancelEdit}
        onEdit={(item) => startEdit(item)}
      />
    );
  }


  return (
    <ModulePageLayout
      title="Data Siswa"
      subtitle="Kelola data siswa pemagangan"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      actions={
        <>
          <ExportImportActions
            data={siswa || []}
            columns={siswaExportColumns}
            filename="data_siswa"
            onImport={handleImport}
          />
          <Button size="sm" onClick={startCreate} className="h-8">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Siswa
          </Button>
        </>
      }
      stats={
        <>
          <ModuleStatCard label="Total Siswa" value={totalSiswa} icon={<Users className="w-4 h-4" />} color="primary" />
          <ModuleStatCard label="Siswa Aktif" value={siswaAktif} icon={<UserCheck className="w-4 h-4" />} color="success" />
          <ModuleStatCard label="Dalam Proses" value={siswaProses} icon={<UserPlus className="w-4 h-4" />} color="warning" />
          <ModuleStatCard label="Siswa Diterima" value={siswaDiterima} icon={<Users className="w-4 h-4" />} color="purple" />
        </>
      }
      filters={
        <div className="flex items-center gap-2">
          <GridControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            sortOptions={sortOptions}
            totalItems={sortedSiswa.length}
            showColumnControl={false}
          />
          {viewMode === 'table' && (
            <SiswaRegularColumnVisibilityControl
              columns={columns}
              onToggleColumn={toggleColumn}
            />
          )}
        </div>
      }
    >
      <div className="p-0 overflow-x-auto">
        <ErrorBoundary fallback={({ error, retry }) => <DataErrorFallback error={error} retry={retry} />}>
          {viewMode === 'table' ? (
            <SiswaRegularTable
              siswa={sortedSiswa}
              visibleColumns={visibleColumns}
              onEdit={startEdit}
              onView={startView}
              onDelete={deleteSiswa}
              isDeleting={isDeleting}
              getProvinceName={getProvinceName}
              getRegencyName={getRegencyName}
              getStatusBadge={getStatusBadge}
            />
          ) : (
            <div className="p-4">
              <GridView
                viewMode={viewMode}
                items={sortedSiswa}
                renderCard={(item) => (
                  <SiswaCardRenderer
                    key={item.id}
                    item={item}
                    onEdit={startEdit}
                    onView={startView}
                    onDelete={deleteSiswa}
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

export default function Siswa() {
  return (
    <ErrorBoundary>
      <SiswaContent />
    </ErrorBoundary>
  );
}
