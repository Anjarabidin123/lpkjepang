
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { useJobOrder } from '@/hooks/useJobOrder';
import { useInlineEdit } from '@/hooks/useInlineEdit';
import { JobOrderInlineForm } from '@/components/JobOrderInlineForm';
import { JobOrderInlineDetail } from '@/components/JobOrderInlineDetail';
import { JobOrderStatsCompact } from '@/components/JobOrderStatsCompact';
import { JobOrderList, ViewMode } from '@/components/JobOrderList';
import { JobOrderErrorState } from '@/components/JobOrderErrorState';
import { JobOrder as JobOrderType } from '@/types/jobOrder';
import { ModulePageLayout } from '@/components/layout/ModulePageLayout';
import { Button } from '@/components/ui/button';
import { JobOrderFiltersComponent } from '@/components/JobOrderFilters';

interface JobOrderFilters {
  status: string | null;
  kumiai_id: string | null;
  jenis_kerja_id: string | null;
}

export default function JobOrder() {
  const navigate = useNavigate();
  const { jobOrders, isLoading, error, deleteJobOrder, isDeleting, refetch } = useJobOrder();
  const { editingItem, isCreating, viewingItem, startEdit, startCreate, startView, cancelEdit } = useInlineEdit<JobOrderType>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortField, setSortField] = useState('nama_job_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<JobOrderFilters>({
    status: null,
    kumiai_id: null,
    jenis_kerja_id: null,
  });

  const handleEdit = (jobOrder: JobOrderType) => startEdit(jobOrder);
  const handleView = (jobOrder: JobOrderType) => startView(jobOrder);
  const handleViewDetail = (jobOrder: JobOrderType) => navigate(`/job-order/${jobOrder.id}`);
  const handleDelete = (id: string) => deleteJobOrder(id);
  const handleFormSuccess = () => cancelEdit();
  const handleFormCancel = () => cancelEdit();
  const handleCreateNew = () => startCreate();
  const handleRetry = () => refetch();
  const handleClearFilters = () => setFilters({ status: null, kumiai_id: null, jenis_kerja_id: null });

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (error && !isLoading) {
    return <JobOrderErrorState error={error} onRetry={handleRetry} />;
  }

  if (isCreating || editingItem) {
    return (
      <JobOrderInlineForm
        jobOrder={editingItem}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <ModulePageLayout
      title="Job Orders"
      subtitle="Manajemen lowongan kerja dan permintaan kumiai"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari job order, kumiai, atau jenis kerja..."
      actions={
        <Button size="sm" onClick={handleCreateNew} className="h-8">
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Job Order
        </Button>
      }
      stats={<JobOrderStatsCompact jobOrders={jobOrders} isLoading={isLoading} />}
      filters={
        <JobOrderFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />
      }
    >
      <div className="flex flex-col gap-4 p-0">
        {viewingItem && (
          <div className="px-4 pt-4">
            <JobOrderInlineDetail
              jobOrder={viewingItem}
              onEdit={() => startEdit(viewingItem)}
              onClose={cancelEdit}
            />
          </div>
        )}

        <JobOrderList
          jobOrders={jobOrders}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onViewDetail={handleViewDetail}
          onCreateNew={handleCreateNew}
          isDeleting={isDeleting}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />
      </div>
    </ModulePageLayout>
  );
}
