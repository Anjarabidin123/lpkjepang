
import React from 'react';
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaRegulerFiltersProps {
  siswaMagang: SiswaMagang[] | undefined;
  searchTerm: string;
}

export function useSiswaRegulerFilters({ siswaMagang, searchTerm }: SiswaRegulerFiltersProps) {
  const filteredSiswaMagang = React.useMemo(() => {
    return siswaMagang?.filter(item =>
      item.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.siswa?.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kumiai?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perusahaan?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [siswaMagang, searchTerm]);

  return { filteredSiswaMagang };
}
