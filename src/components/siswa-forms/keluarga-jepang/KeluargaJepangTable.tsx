
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { SiswaKeluargaJepang } from "@/hooks/useSiswa";

interface KeluargaJepangTableProps {
  keluargaJepang: SiswaKeluargaJepang[];
  onEdit: (item: SiswaKeluargaJepang) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function KeluargaJepangTable({ keluargaJepang, onEdit, onDelete, isUpdating, isDeleting }: KeluargaJepangTableProps) {
  if (keluargaJepang.length === 0) {
    return <p className="text-gray-500 text-center py-4">Tidak ada kerabat/keluarga di Jepang</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Hubungan</TableHead>
            <TableHead>Umur</TableHead>
            <TableHead>Pekerjaan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keluargaJepang.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nama}</TableCell>
              <TableCell>{item.hubungan || '-'}</TableCell>
              <TableCell>{item.umur ? `${item.umur} tahun` : '-'}</TableCell>
              <TableCell>{item.pekerjaan || '-'}</TableCell>
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
