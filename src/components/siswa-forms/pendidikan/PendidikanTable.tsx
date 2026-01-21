
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { SiswaPendidikan } from "@/hooks/useSiswaPendidikan";

interface PendidikanTableProps {
  pendidikan: SiswaPendidikan[];
  onEdit: (item: SiswaPendidikan) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function PendidikanTable({ pendidikan, onEdit, onDelete, isUpdating, isDeleting }: PendidikanTableProps) {
  if (pendidikan.length === 0) {
    return <p className="text-gray-500 text-center py-4">Tidak ada informasi pendidikan</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenjang</TableHead>
            <TableHead>Institusi</TableHead>
            <TableHead>Jurusan</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendidikan.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.jenjang_pendidikan}</TableCell>
              <TableCell>{item.nama_institusi}</TableCell>
              <TableCell>{item.jurusan || '-'}</TableCell>
              <TableCell>
                {item.tahun_masuk && item.tahun_lulus 
                  ? `${item.tahun_masuk} - ${item.tahun_lulus}`
                  : item.tahun_masuk || item.tahun_lulus || '-'
                }
              </TableCell>
              <TableCell>{item.nilai_akhir || '-'}</TableCell>
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
