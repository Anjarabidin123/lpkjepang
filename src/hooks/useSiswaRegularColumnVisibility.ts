import { useState, useCallback } from 'react';

export interface SiswaRegularColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

const DEFAULT_SISWA_REGULAR_COLUMNS: SiswaRegularColumnConfig[] = [
  { key: 'foto', label: 'Foto', visible: true },
  { key: 'nik', label: 'NIK', visible: true },
  { key: 'nama', label: 'Nama', visible: true },
  { key: 'umur', label: 'Umur', visible: true },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', visible: true },
  { key: 'telepon', label: 'Telepon', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'fisik', label: 'Tinggi/Berat', visible: true },
  { key: 'provinsi', label: 'Provinsi', visible: true },
  { key: 'kabupaten', label: 'Kabupaten/Kota', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'ketersediaan', label: 'Ketersediaan', visible: true },
  { key: 'aksi', label: 'Aksi', visible: true },
];

export function useSiswaRegularColumnVisibility() {
  const [columns, setColumns] = useState<SiswaRegularColumnConfig[]>(() => {
    return DEFAULT_SISWA_REGULAR_COLUMNS.map(col => ({ ...col }));
  });

  const toggleColumn = useCallback((key: string) => {
    console.log('Toggling regular siswa column:', key);
    setColumns(prev => {
      const newColumns = prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      );
      console.log('Updated regular siswa columns:', newColumns);
      return newColumns;
    });
  }, []);

  const setColumnVisibility = useCallback((key: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible } : col
      )
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setColumns(DEFAULT_SISWA_REGULAR_COLUMNS.map(col => ({ ...col })));
  }, []);

  const visibleColumns = columns.filter(col => col.visible);
  const hiddenColumns = columns.filter(col => !col.visible);

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    toggleColumn,
    setColumnVisibility,
    resetToDefaults
  };
}
