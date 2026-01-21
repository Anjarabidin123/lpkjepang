
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Eye, User, Trash2, Camera } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import type { SiswaMagang } from '@/types/siswaMagang';
import type { SiswaColumnConfig } from '@/hooks/useSiswaColumnVisibility';

interface SiswaMagangTableRowProps {
  siswaMagang: SiswaMagang;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: (item: SiswaMagang) => void;
  onView: (item: SiswaMagang) => void;
  onDelete: (id: string) => void;
  visibleColumns: SiswaColumnConfig[];
}

export function SiswaMagangTableRow({
  siswaMagang,
  isEditing,
  isDeleting,
  onEdit,
  onView,
  onDelete,
  visibleColumns
}: SiswaMagangTableRowProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Selesai': return 'secondary';
      case 'Dipulangkan': return 'destructive';
      case 'Cuti': return 'outline';
      default: return 'secondary';
    }
  };

  // Create a function that checks if a column is visible from the visibleColumns array
  const isColumnVisible = (key: string) => {
    const found = visibleColumns.find(col => col.key === key);
    const isVisible = found?.visible === true;
    console.log(`Column ${key} visibility check:`, isVisible, 'found:', found);
    return isVisible;
  };

  console.log('Rendering row with visible columns:', visibleColumns.map(col => `${col.key}:${col.visible}`).join(', '));

  return (
    <TableRow className="hover:bg-gray-50/50">
      {isColumnVisible('avatar') && (
        <TableCell>
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-gray-200">
              <AvatarImage 
                src={siswaMagang.avatar_url || ''} 
                alt={`Foto ${siswaMagang.siswa?.nama || 'Siswa'}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            {siswaMagang.avatar_url && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                <Camera className="w-1.5 h-1.5 text-white" />
              </div>
            )}
          </div>
        </TableCell>
      )}
      
      {isColumnVisible('nama') && (
        <TableCell>
          <div className="font-medium text-gray-900">
            {siswaMagang.siswa?.nama || '-'}
          </div>
        </TableCell>
      )}
      
      {isColumnVisible('nik') && (
        <TableCell>
          <span className="text-sm text-gray-600">
            {siswaMagang.siswa?.nik || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('kumiai') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.kumiai?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('perusahaan') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.perusahaan?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('program') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.program?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('jenis_kerja') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.jenis_kerja?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('posisi_kerja') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.posisi_kerja?.posisi || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('lpk_mitra') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.lpk_mitra?.nama_lpk || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('province') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.provinsi?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('regency') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.kabupaten?.nama || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('lokasi') && (
        <TableCell>
          <span className="text-sm">
            {siswaMagang.lokasi || '-'}
          </span>
        </TableCell>
      )}

      {isColumnVisible('mulai_kerja') && (
        <TableCell>
          <span className="text-sm">
            {formatDate(siswaMagang.tanggal_mulai_kerja)}
          </span>
        </TableCell>
      )}

      {isColumnVisible('pulang_kerja') && (
        <TableCell>
          <span className="text-sm">
            {formatDate(siswaMagang.tanggal_pulang_kerja)}
          </span>
        </TableCell>
      )}

      {isColumnVisible('gaji') && (
        <TableCell>
          <span className="text-sm font-medium">
            {formatCurrency(siswaMagang.gaji)}
          </span>
        </TableCell>
      )}

      {isColumnVisible('status') && (
        <TableCell>
          <Badge variant={getStatusBadgeVariant(siswaMagang.status_magang)}>
            {siswaMagang.status_magang || 'Aktif'}
          </Badge>
        </TableCell>
      )}

      {isColumnVisible('aksi') && (
        <TableCell>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(siswaMagang)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(siswaMagang)}
              disabled={isEditing}
              className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(siswaMagang.id)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
