
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { SiswaKontakKeluarga } from "@/hooks/useSiswa";

interface KontakKeluargaTableProps {
  kontakKeluarga: SiswaKontakKeluarga[];
  onEdit: (item: SiswaKontakKeluarga) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function KontakKeluargaTable({ kontakKeluarga, onEdit, onDelete, isUpdating, isDeleting }: KontakKeluargaTableProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (kontakKeluarga.length === 0) {
    return <p className="text-gray-500 text-center py-4">Tidak ada kontak keluarga</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>No. HP</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Penghasilan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kontakKeluarga.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nama}</TableCell>
              <TableCell>{item.no_hp || '-'}</TableCell>
              <TableCell>{item.alamat || '-'}</TableCell>
              <TableCell>{formatCurrency(item.penghasilan_per_bulan)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    disabled={isUpdating || isDeleting}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    disabled={isUpdating || isDeleting}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
