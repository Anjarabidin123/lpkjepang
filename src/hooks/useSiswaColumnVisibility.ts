
import { useState, useCallback } from 'react';

export interface SiswaColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

const DEFAULT_SISWA_COLUMNS: SiswaColumnConfig[] = [
  { key: 'avatar', label: 'Avatar', visible: true },
  { key: 'nama', label: 'Nama Siswa', visible: true },
  { key: 'nik', label: 'NIK', visible: true },
  { key: 'kumiai', label: 'Kumiai', visible: true },
  { key: 'perusahaan', label: 'Perusahaan', visible: true },
  { key: 'program', label: 'Program', visible: true },
  { key: 'jenis_kerja', label: 'Jenis Kerja', visible: true },
  { key: 'posisi_kerja', label: 'Posisi Kerja', visible: true },
  { key: 'lpk_mitra', label: 'LPK Mitra', visible: true },
  { key: 'province', label: 'Prefecture', visible: true },
  { key: 'regency', label: 'City/District', visible: true },
  { key: 'lokasi', label: 'Lokasi Detail', visible: true },
  { key: 'mulai_kerja', label: 'Tanggal Mulai', visible: true },
  { key: 'pulang_kerja', label: 'Tanggal Pulang', visible: true },
  { key: 'gaji', label: 'Gaji', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'aksi', label: 'Aksi', visible: true },
];

export function useSiswaColumnVisibility() {
  const [columns, setColumns] = useState<SiswaColumnConfig[]>(() => {
    return DEFAULT_SISWA_COLUMNS.map(col => ({ ...col }));
  });

  const toggleColumn = useCallback((key: string) => {
    console.log('Toggling column:', key);
    setColumns(prev => {
      const newColumns = prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      );
      console.log('Updated columns:', newColumns);
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
    setColumns(DEFAULT_SISWA_COLUMNS.map(col => ({ ...col })));
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
