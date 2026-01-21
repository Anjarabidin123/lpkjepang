
import { useState, useCallback } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'avatar', label: 'Avatar', visible: true },
  { key: 'nama', label: 'Nama', visible: true },
  { key: 'kumiai', label: 'Kumiai', visible: true },
  { key: 'perusahaan', label: 'Perusahaan', visible: true },
  { key: 'program', label: 'Program', visible: true },
  { key: 'jenis_kerja', label: 'Jenis Kerja', visible: true },
  { key: 'posisi_kerja', label: 'Posisi Kerja', visible: true },
  { key: 'lpk_mitra', label: 'LPK Mitra', visible: true },
  { key: 'lokasi', label: 'Lokasi', visible: true },
  { key: 'mulai_kerja', label: 'Mulai Kerja', visible: true },
  { key: 'pulang_kerja', label: 'Tanggal Pulang', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'aksi', label: 'Aksi', visible: true },
];

export function useColumnVisibility(tableKey?: string) {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Use default columns for siswa-magang table
    return DEFAULT_COLUMNS.map(col => ({ ...col }));
  });

  const toggleColumn = useCallback((key: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const setColumnVisibility = useCallback((key: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible } : col
      )
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setColumns(DEFAULT_COLUMNS.map(col => ({ ...col })));
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
