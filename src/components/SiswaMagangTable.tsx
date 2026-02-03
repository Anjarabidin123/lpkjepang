
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SiswaColumnConfig } from "@/hooks/useSiswaColumnVisibility";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaMagangTableProps {
  siswaMagang: SiswaMagang[];
  searchTerm?: string;
  onView?: (siswaMagang: any) => void;
  onEdit?: (siswaMagang: any) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  visibleColumns?: SiswaColumnConfig[];
}

export function SiswaMagangTable({
  siswaMagang,
  searchTerm,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  visibleColumns = []
}: SiswaMagangTableProps) {
  if (!siswaMagang || siswaMagang.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada siswa magang di perusahaan ini</p>
      </div>
    );
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'Aktif':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'Selesai':
        return <Badge className="bg-blue-100 text-blue-800">Selesai</Badge>;
      case 'Cuti':
        return <Badge className="bg-yellow-100 text-yellow-800">Cuti</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  // Filter data based on search term if provided
  const filteredData = searchTerm
    ? siswaMagang.filter(item =>
      item.siswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.siswa?.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kumiai?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perusahaan?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : siswaMagang;

  // Helper function to check if column is visible
  const isColumnVisible = (key: string) => {
    if (visibleColumns.length === 0) return true;
    return visibleColumns.some(col => col.key === key && col.visible);
  };

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {isColumnVisible('avatar') && <TableHead className="min-w-[60px]">Avatar</TableHead>}
            {isColumnVisible('nama') && <TableHead className="min-w-[150px]">Nama Siswa</TableHead>}
            {isColumnVisible('nik') && <TableHead className="min-w-[120px]">NIK</TableHead>}
            {isColumnVisible('kumiai') && <TableHead className="min-w-[120px]">Kumiai</TableHead>}
            {isColumnVisible('perusahaan') && <TableHead className="min-w-[120px]">Perusahaan</TableHead>}
            {isColumnVisible('program') && <TableHead className="min-w-[120px]">Program</TableHead>}
            {isColumnVisible('jenis_kerja') && <TableHead className="min-w-[120px]">Jenis Kerja</TableHead>}
            {isColumnVisible('posisi_kerja') && <TableHead className="min-w-[120px]">Posisi Kerja</TableHead>}
            {isColumnVisible('lpk_mitra') && <TableHead className="min-w-[120px]">LPK Mitra</TableHead>}
            {isColumnVisible('province') && <TableHead className="min-w-[100px]">Prefecture</TableHead>}
            {isColumnVisible('regency') && <TableHead className="min-w-[100px]">City/District</TableHead>}
            {isColumnVisible('lokasi') && <TableHead className="min-w-[120px]">Lokasi Detail</TableHead>}
            {isColumnVisible('mulai_kerja') && <TableHead className="min-w-[120px]">Tanggal Mulai</TableHead>}
            {isColumnVisible('pulang_kerja') && <TableHead className="min-w-[120px]">Tanggal Pulang</TableHead>}
            {isColumnVisible('gaji') && <TableHead className="min-w-[120px]">Gaji</TableHead>}
            {isColumnVisible('status') && <TableHead className="min-w-[100px]">Status</TableHead>}
            {isColumnVisible('aksi') && <TableHead className="min-w-[120px]">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onView && onView(item)}
            >
              {isColumnVisible('avatar') && (
                <TableCell>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={item.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {item.siswa?.nama?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
              )}
              {isColumnVisible('nama') && (
                <TableCell>
                  <div className="font-medium">{item.siswa?.nama || 'Unknown'}</div>
                </TableCell>
              )}
              {isColumnVisible('nik') && (
                <TableCell>
                  <div className="text-sm text-muted-foreground">{item.siswa?.nik || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('kumiai') && (
                <TableCell>
                  <div className="text-sm">{item.kumiai?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('perusahaan') && (
                <TableCell>
                  <div className="text-sm">{item.perusahaan?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('program') && (
                <TableCell>
                  <div className="text-sm">{item.program?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('jenis_kerja') && (
                <TableCell>
                  <div className="text-sm">{item.jenis_kerja?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('posisi_kerja') && (
                <TableCell>
                  <div className="text-sm">{item.posisi_kerja?.posisi || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('lpk_mitra') && (
                <TableCell>
                  <div className="text-sm">{item.lpk_mitra?.nama_lpk || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('province') && (
                <TableCell>
                  <div className="text-sm">{item.provinsi?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('regency') && (
                <TableCell>
                  <div className="text-sm">{item.kabupaten?.nama || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('lokasi') && (
                <TableCell>
                  <div className="text-sm">{item.lokasi || '-'}</div>
                </TableCell>
              )}
              {isColumnVisible('mulai_kerja') && (
                <TableCell>
                  <div className="text-sm">{formatDate(item.tanggal_mulai_kerja)}</div>
                </TableCell>
              )}
              {isColumnVisible('pulang_kerja') && (
                <TableCell>
                  <div className="text-sm">{formatDate(item.tanggal_pulang_kerja)}</div>
                </TableCell>
              )}
              {isColumnVisible('gaji') && (
                <TableCell>
                  <div className="font-medium text-sm">
                    {formatCurrency(item.gaji)}
                  </div>
                </TableCell>
              )}
              {isColumnVisible('status') && (
                <TableCell>
                  {getStatusBadge(item.status_magang)}
                </TableCell>
              )}
              {isColumnVisible('aksi') && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(item);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="text-destructive hover:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
