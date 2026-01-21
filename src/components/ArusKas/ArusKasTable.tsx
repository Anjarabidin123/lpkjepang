
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface ArusKasTableProps {
  data: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ArusKasTable({ data, loading, onEdit, onDelete }: ArusKasTableProps) {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">Tidak ada data arus kas</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Nominal</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Badge variant={item.jenis === 'Pemasukan' ? 'default' : 'destructive'}>
                  {item.jenis}
                </Badge>
              </TableCell>
              <TableCell>{item.kategori}</TableCell>
              <TableCell className="font-medium text-right font-mono">
                {formatIDRCurrency(item.nominal)}
              </TableCell>
              <TableCell>{formatDate(item.tanggal)}</TableCell>
              <TableCell>{item.keterangan || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
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
