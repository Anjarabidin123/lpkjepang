
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface InvoiceTableProps {
  data: any[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onView?: (invoice: any) => void;
}

export function InvoiceTable({ data, loading, onEdit, onDelete, onView }: InvoiceTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memuat data invoice...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-gray-500 mb-2">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Belum ada invoice</p>
          <p className="text-sm">Buat invoice pertama untuk memulai</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleDeleteWithConfirm = async (id: string, invoiceNumber: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus invoice ${invoiceNumber}?`)) {
      await onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16 text-center">No</TableHead>
              <TableHead className="min-w-[140px]">ID Invoice</TableHead>
              <TableHead className="min-w-[200px]">Kumiai</TableHead>
              <TableHead className="text-center w-32">Siswa</TableHead>
              <TableHead className="text-right min-w-[120px]">Nominal</TableHead>
              <TableHead className="min-w-[120px]">Tgl Tagihan</TableHead>
              <TableHead className="min-w-[120px]">Jatuh Tempo</TableHead>
              <TableHead className="text-center w-24">Status</TableHead>
              <TableHead className="text-center w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="text-center font-medium text-gray-600">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm font-medium text-blue-600">
                    {item.nomor_invoice}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {item.kumiai?.nama || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.kumiai?.kode}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-blue-600">
                      {item.invoice_items?.length || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-bold text-green-600 font-mono">
                    {formatCurrency(item.nominal)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-700">
                    {formatDate(item.tanggal_invoice)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-700">
                    {item.tanggal_jatuh_tempo ? formatDate(item.tanggal_jatuh_tempo) : '-'}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusColor(item.status)} className="text-xs">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-1 justify-center">
                    {onView && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(item)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-8 w-8"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
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
                      onClick={() => handleDeleteWithConfirm(item.id, item.nomor_invoice)}
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
    </div>
  );
}
