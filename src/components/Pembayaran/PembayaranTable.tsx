
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Printer } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { PembayaranStatusBadge } from './PembayaranStatusBadge';

interface PembayaranTableProps {
  data: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onView: (pembayaran: any) => void;
  onPrint: (pembayaran: any) => void;
}

export function PembayaranTable({ data, loading, onEdit, onDelete, onView, onPrint }: PembayaranTableProps) {
  console.log('PembayaranTable received data:', data);
  
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-gray-500">Tidak ada data pembayaran</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No</TableHead>
            <TableHead>Siswa</TableHead>
            <TableHead>Item Pembayaran</TableHead>
            <TableHead>Tgl Transaksi</TableHead>
            <TableHead className="text-right min-w-[140px]">Pembayaran</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Kekurangan</TableHead>
            <TableHead className="text-center w-32">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const nominalWajib = item.item_pembayaran?.nominal_wajib || 0;
            const nominalBayar = Number(item.nominal) || 0;
            const kekurangan = Math.max(nominalWajib - nominalBayar, 0);
            
            return (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {item.siswa?.nama || 'N/A'}
                </TableCell>
                <TableCell>
                  {item.item_pembayaran ? (
                    <div>
                      <span className="font-medium">{item.item_pembayaran.nama_item}</span>
                      <div className="text-xs text-gray-500">
                        Wajib: {formatIDRCurrency(item.item_pembayaran.nominal_wajib)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(item.tanggal_pembayaran)}</TableCell>
                <TableCell className="font-bold text-right text-green-600 font-mono min-w-[140px]">
                  {formatIDRCurrency(nominalBayar)}
                </TableCell>
                <TableCell className="text-center">
                  <PembayaranStatusBadge status={item.status} kekurangan={kekurangan} />
                </TableCell>
                <TableCell className="font-bold text-right text-red-600 font-mono">
                  {formatIDRCurrency(kekurangan)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="grid grid-cols-2 gap-1 w-fit mx-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onView(item)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-8 w-8"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onPrint(item)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 h-8 w-8"
                      title="Cetak Bukti"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(item.id)}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
