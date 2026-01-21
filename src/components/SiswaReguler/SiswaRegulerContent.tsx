
import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, School as SchoolIcon, Work as WorkIcon } from '@mui/icons-material';
import { useSiswaMagang } from '@/hooks/useSiswaMagang';
import { useSiswa } from '@/hooks/useSiswa';
import { useProgram } from '@/hooks/useProgram';
import { useKumiai } from '@/hooks/useKumiai';
import { SiswaRegulerViewRenderer } from './SiswaRegulerViewRenderer';
import { SiswaRegulerInlineDetail } from './SiswaRegulerInlineDetail';
import { SiswaMagangModal } from '@/components/SiswaMagang/SiswaMagangModal';
import { SiswaMagangFilters, FilterOptions } from '@/components/SiswaMagang/SiswaMagangFilters';
import { useGridView } from '@/hooks/useGridView';
import { useSiswaColumnVisibility } from '@/hooks/useSiswaColumnVisibility';
import { useSiswaMagangStats } from '@/hooks/useSiswaMagangStats';
import { useInlineEdit } from '@/hooks/useInlineEdit';
import { GridControls } from '@/components/GridControls';
import { ExportImportActions } from '@/components/ExportImport/ExportImportActions';
import { siswaMagangExportColumns } from '@/components/ExportImport/siswaMagangColumns';
import { importService } from '@/services/importService';
import { toast } from 'sonner';
import type { SiswaMagang, CreateSiswaMagangData } from '@/types/siswaMagang';

export function SiswaRegulerContent() {
  const { siswaMagang, isLoading, error, refetch } = useSiswaMagang();
  const { siswa } = useSiswa();
  const { program } = useProgram();
  const { kumiai } = useKumiai();
  const { viewMode, setViewMode, sortField, sortDirection, handleSortChange, sortData } = useGridView();
  const { columns, visibleColumns, toggleColumn } = useSiswaColumnVisibility();
  
  // Inline edit state management
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
  } = useInlineEdit<SiswaMagang>();
  
  // Modal state management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SiswaMagang | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statusFilter: '',
    programFilter: '',
    kumiaiFilter: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const stats = useSiswaMagangStats(siswaMagang);

  const handleImport = async (data: Partial<CreateSiswaMagangData>[]) => {
    try {
      const result = await importService.importSiswaMagang(data);
      
      if (result.success > 0) {
        await refetch();
        toast.success(`Berhasil mengimpor ${result.success} data siswa magang`);
      }
      
      if (result.failed > 0) {
        console.error('Import errors:', result.errors);
        toast.error(`${result.failed} data gagal diimpor. Periksa console untuk detail error.`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Gagal mengimpor data siswa magang');
    }
  };

  // Enhanced filter and sort data with better performance
    const filteredAndSortedData = useMemo(() => {
      console.log('Filtering and sorting data...', { filters, sortField, sortDirection });
      
      let filtered = siswaMagang || [];

      // Apply search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          (item.siswa?.nama || '').toLowerCase().includes(searchLower) ||
          (item.lokasi || '').toLowerCase().includes(searchLower) ||
          (item.siswa?.nik || '').toLowerCase().includes(searchLower) ||
          (item.kumiai?.nama || '').toLowerCase().includes(searchLower) ||
          (item.perusahaan?.nama || '').toLowerCase().includes(searchLower)
        );
      }

    // Apply status filter
    if (filters.statusFilter) {
      filtered = filtered.filter(item => item.status_magang === filters.statusFilter);
    }

    // Apply program filter
    if (filters.programFilter) {
      filtered = filtered.filter(item => item.program_id === filters.programFilter);
    }

    // Apply kumiai filter
    if (filters.kumiaiFilter) {
      filtered = filtered.filter(item => item.kumiai_id === filters.kumiaiFilter);
    }

    // Apply sorting using the grid view hook
    const sorted = sortData(filtered);
    console.log('Filtered and sorted data:', sorted.length, 'items');
    
    return sorted;
  }, [siswaMagang, filters, sortData]);

  // Modal event handlers
  const handleCreateNew = () => {
    console.log('Opening create modal');
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (item: SiswaMagang) => {
    console.log('Opening edit modal for item:', item.id);
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleView = (item: SiswaMagang) => {
    console.log('Opening detail view for item:', item.id);
    startView(item);
  };

  const handleDelete = async (id: string) => {
    console.log('Delete action for id:', id);
    // Delete functionality can be implemented here
  };

  const handleModalSuccess = () => {
    console.log('Modal operation successful, refreshing data');
    setIsFormModalOpen(false);
    setSelectedItem(null);
    // Refresh data
    refetch();
  };

  const handleCloseFormModal = () => {
    console.log('Closing form modal');
    setIsFormModalOpen(false);
    setSelectedItem(null);
  };

  const handleEditFromDetail = () => {
    console.log('Opening edit modal from detail view');
    setSelectedItem(viewingItem);
    setIsFormModalOpen(true);
  };

  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  // Sort options for the grid controls
  const sortOptions = [
    { value: 'siswa.nama', label: 'Nama Siswa' },
    { value: 'kumiai.nama', label: 'Kumiai' },
    { value: 'perusahaan.nama', label: 'Perusahaan' },
    { value: 'program.nama', label: 'Program' },
    { value: 'lokasi', label: 'Lokasi' },
    { value: 'tanggal_mulai_kerja', label: 'Tanggal Mulai' },
    { value: 'tanggal_pulang_kerja', label: 'Tanggal Pulang' },
    { value: 'status_magang', label: 'Status' },
    { value: 'gaji', label: 'Gaji' }
  ];

  // Enhanced loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <Typography sx={{ ml: 2 }}>Memuat data siswa...</Typography>
      </Box>
    );
  }

  // Enhanced error state with retry capability
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          Error memuat data: {error.message}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Terjadi kesalahan saat memuat data siswa magang. Silakan coba lagi.
        </Typography>
        <Button 
          onClick={handleRefresh} 
          variant="contained" 
          color="primary"
          sx={{ mr: 2 }}
        >
          Coba Lagi
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outlined"
        >
          Refresh Halaman
        </Button>
      </Box>
    );
  }

  console.log('SiswaRegulerContent - Current visible columns:', visibleColumns.map(col => `${col.key}:${col.visible}`));

  // Show inline detail when viewing
  if (isViewing && viewingItem) {
    return (
      <div className="space-y-6">
        <SiswaRegulerInlineDetail
          siswaMagang={viewingItem}
          onBack={cancelEdit}
          onEdit={handleEditFromDetail}
        />
      </div>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Siswa Magang</Typography>
        <div className="flex gap-2">
          <ExportImportActions
            data={siswaMagang || []}
            columns={siswaMagangExportColumns}
            filename="data_siswa_magang"
            onImport={handleImport}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            size="large" 
            onClick={handleCreateNew}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Tambah Siswa Magang
          </Button>
        </div>
      </Box>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Siswa Magang</Typography>
            </Box>
            <Typography variant="h3" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Siswa magang terdaftar
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">Aktif Magang</Typography>
            </Box>
            <Typography variant="h3" color="secondary">
              {stats.aktif}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sedang dalam program magang
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Selesai</Typography>
            </Box>
            <Typography variant="h3" sx={{ color: 'success.main' }}>
              {stats.selesai}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Telah menyelesaikan program
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="mb-6">
        <SiswaMagangFilters
          filters={filters}
          onFiltersChange={setFilters}
          programs={program || []}
          kumiai={kumiai || []}
        />
      </div>

      {/* Grid Controls - positioned above the data */}
      <GridControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        sortOptions={sortOptions}
        totalItems={filteredAndSortedData.length}
        columns={columns}
        onToggleColumn={toggleColumn}
      />

      {/* Enhanced Data Table/Grid */}
      <div className="mt-4">
        <Typography variant="h5" sx={{ mb: 3 }}>
          Daftar Siswa Magang ({filteredAndSortedData.length} siswa)
        </Typography>
        
        <SiswaRegulerViewRenderer 
          viewMode={viewMode}
          sortedSiswaMagang={filteredAndSortedData}
          searchTerm={filters.searchTerm}
          isCreating={false}
          editingItem={null}
          isDeleting={false}
          isEditing={false}
          visibleColumns={visibleColumns}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onSave={() => {}}
          onCancel={() => {}}
          InlineForm={() => null}
        />
      </div>

      {/* Form Modal for Create/Edit */}
      <SiswaMagangModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        siswaMagang={selectedItem}
        onSuccess={handleModalSuccess}
      />

    </Box>
  );
}
