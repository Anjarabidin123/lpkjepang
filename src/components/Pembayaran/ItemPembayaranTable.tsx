
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';

interface ItemPembayaranTableProps {
  data: any[];
  loading: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ItemPembayaranTable({ data, loading, onEdit, onDelete }: ItemPembayaranTableProps) {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Item</TableHead>
            <TableHead className="text-right">Nominal Wajib</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{item.nama_item}</TableCell>
              <TableCell className="font-bold text-right text-green-600 font-mono">
                {formatIDRCurrency(item.nominal_wajib)}
              </TableCell>
              <TableCell className="max-w-xs">
                <span className="truncate block" title={item.deskripsi || '-'}>
                  {item.deskripsi || '-'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                  {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex gap-1 justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(item)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 h-8 w-8"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
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
