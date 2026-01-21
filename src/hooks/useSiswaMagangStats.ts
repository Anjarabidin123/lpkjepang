
import { useMemo } from 'react';
import type { SiswaMagang } from '@/types/siswaMagang';

export function useSiswaMagangStats(siswaMagang: SiswaMagang[]) {
  const stats = useMemo(() => {
    const total = siswaMagang.length;
    const aktif = siswaMagang.filter(s => s.status_magang === 'Aktif').length;
    const selesai = siswaMagang.filter(s => s.status_magang === 'Selesai').length;
    const cuti = siswaMagang.filter(s => s.status_magang === 'Cuti').length;
    const dipulangkan = siswaMagang.filter(s => s.status_magang === 'Dipulangkan').length;

    return {
      total,
      aktif,
      selesai,
      cuti,
      dipulangkan,
      percentage: {
        aktif: total > 0 ? Math.round((aktif / total) * 100) : 0,
        selesai: total > 0 ? Math.round((selesai / total) * 100) : 0,
        cuti: total > 0 ? Math.round((cuti / total) * 100) : 0,
        dipulangkan: total > 0 ? Math.round((dipulangkan / total) * 100) : 0,
      }
    };
  }, [siswaMagang]);

  return stats;
}
