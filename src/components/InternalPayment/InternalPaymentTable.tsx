
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Printer, ChevronUp, ChevronDown } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { type InternalPayment } from '@/hooks/useInternalPayment';

interface InternalPaymentTableProps {
  data: InternalPayment[];
  loading: boolean;
  onEdit: (payment: InternalPayment) => void;
  onDelete: (id: string) => void;
  onView: (payment: InternalPayment) => void;
  onPrint: (payment: InternalPayment) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function InternalPaymentTable({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  onView, 
  onPrint,
  sortField,
  sortDirection,
  onSort
}: InternalPaymentTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tidak ada data biaya pelatihan</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lunas':
        return <Badge variant="default" className="bg-green-100 text-green-800">Lunas</Badge>;
      case 'Belum Lunas':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Belum Lunas</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  // Calculate payment summary for each student and item
  const getPaymentSummary = (siswaId: string, itemPembayaranId: string) => {
    const siswaPayments = data.filter(p => p.siswa_id === siswaId && p.item_pembayaran_id === itemPembayaranId);
    const totalPaid = siswaPayments.reduce((sum, payment) => sum + payment.nominal, 0);
    const obligation = siswaPayments[0]?.item_pembayaran?.nominal_wajib || 0;
    const remaining = Math.max(0, obligation - totalPaid);
    
    return {
      obligation,
      totalPaid,
      remaining,
      isFullyPaid: remaining === 0
    };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="tanggal_pembayaran">Tanggal</SortableHeader>
            <SortableHeader field="siswa.nama">Siswa</SortableHeader>
            <SortableHeader field="item_pembayaran.nama_item">Item Pembayaran</SortableHeader>
            <TableHead className="text-right">Kewajiban</TableHead>
            <TableHead className="text-right">Dibayarkan</TableHead>
            <TableHead className="text-right">Kekurangan</TableHead>
            <SortableHeader field="metode_pembayaran">Metode</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <TableHead className="text-center w-32">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => {
            const paymentSummary = getPaymentSummary(payment.siswa_id, payment.item_pembayaran_id);
            
            return (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.tanggal_pembayaran)}</TableCell>
                <TableCell className="font-medium">
                  {payment.siswa?.nama || 'N/A'}
                </TableCell>
                <TableCell>{payment.item_pembayaran?.nama_item || 'N/A'}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatIDRCurrency(paymentSummary.obligation)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatIDRCurrency(payment.nominal)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className={paymentSummary.remaining > 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatIDRCurrency(paymentSummary.remaining)}
                  </span>
                </TableCell>
                <TableCell>{payment.metode_pembayaran}</TableCell>
                <TableCell>
                  {getStatusBadge(paymentSummary.isFullyPaid ? 'Lunas' : 'Belum Lunas')}
                </TableCell>
                <TableCell>
                  <div className="grid grid-cols-2 gap-1 w-fit mx-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(payment)}
                      className="h-8 w-8 p-0"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(payment)}
                      className="h-8 w-8 p-0"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrint(payment)}
                      className="h-8 w-8 p-0"
                      title="Cetak Kwitansi"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(payment.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
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
