
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobOrderTable } from "@/components/JobOrderTable";
import { JobOrderFiltersComponent } from "@/components/JobOrderFilters";
import { GridControls } from "@/components/GridControls";
import { JobOrderCard } from "@/components/JobOrderCard";
import { type JobOrder } from '@/hooks/useJobOrder';
import { Skeleton } from "@/components/ui/skeleton";

interface JobOrderFiltersType {
  status: string | null;
  kumiai_id: string | null;
  jenis_kerja_id: string | null;
}

export type ViewMode = 'list' | 'grid';

interface JobOrderListProps {
  jobOrders: JobOrder[] | undefined;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (jobOrder: JobOrder) => void;
  onDelete: (id: string) => void;
  onView: (jobOrder: JobOrder) => void;
  onViewDetail?: (jobOrder: JobOrder) => void;
  onCreateNew: () => void;
  isDeleting: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  filters: JobOrderFiltersType;
  onFiltersChange: (filters: JobOrderFiltersType) => void;
  onClearFilters: () => void;
}

export function JobOrderList({
  jobOrders,
  isLoading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onView,
  onViewDetail,
  onCreateNew,
  isDeleting,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  filters,
  onFiltersChange,
  onClearFilters
}: JobOrderListProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const safeJobOrders = jobOrders || [];

  const filteredJobOrders = safeJobOrders.filter(jobOrder => {
    const matchesSearch = jobOrder.nama_job_order?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobOrder.kumiai?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobOrder.jenis_kerja?.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || jobOrder.status === filters.status;
    const matchesKumiai = !filters.kumiai_id || jobOrder.kumiai_id === filters.kumiai_id;
    const matchesJenisKerja = !filters.jenis_kerja_id || jobOrder.jenis_kerja_id === filters.jenis_kerja_id;

    return matchesSearch && matchesStatus && matchesKumiai && matchesJenisKerja;
  });

  const sortedJobOrders = [...filteredJobOrders].sort((a, b) => {
    const isAsc = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'nama_job_order') {
      return a.nama_job_order.localeCompare(b.nama_job_order) * isAsc;
    }

    if (sortField === 'kumiai') {
      const kumiaiA = a.kumiai?.nama || '';
      const kumiaiB = b.kumiai?.nama || '';
      return kumiaiA.localeCompare(kumiaiB) * isAsc;
    }

    if (sortField === 'jenis_kerja') {
      const jenisKerjaA = a.jenis_kerja?.nama || '';
      const jenisKerjaB = b.jenis_kerja?.nama || '';
      return jenisKerjaA.localeCompare(jenisKerjaB) * isAsc;
    }

    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari job order..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onCreateNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Job Order
          </Button>
        </div>
      </div>

      <JobOrderFiltersComponent
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />

      <GridControls
        viewMode={viewMode === 'list' ? 'table' : 'grid-2'}
        onViewModeChange={(mode) => onViewModeChange(mode === 'table' ? 'list' : 'grid')}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        sortOptions={[
          { value: 'nama_job_order', label: 'Nama Job Order' },
          { value: 'kumiai', label: 'Kumiai' },
          { value: 'jenis_kerja', label: 'Jenis Kerja' }
        ]}
        totalItems={filteredJobOrders.length}
      />

      {sortedJobOrders.length === 0 && !isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Belum ada job order yang tersedia</p>
        </div>
      ) : viewMode === 'list' ? (
        <JobOrderTable
          jobOrders={sortedJobOrders}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onViewDetail={onViewDetail}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedJobOrders.map((jobOrder) => (
            <JobOrderCard
              key={jobOrder.id}
              jobOrder={jobOrder}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onViewDetail={onViewDetail}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
