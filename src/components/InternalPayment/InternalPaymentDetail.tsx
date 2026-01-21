
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Printer } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { type InternalPayment } from '@/hooks/useInternalPayment';
import { useInternalPayment } from '@/hooks/useInternalPayment';

interface InternalPaymentDetailProps {
  payment: InternalPayment;
  onClose: () => void;
  onPrint: (payment: InternalPayment) => void;
}

export function InternalPaymentDetail({ payment, onClose, onPrint }: InternalPaymentDetailProps) {
  const { payments } = useInternalPayment();
  
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

  // Calculate payment summary for this student and item
  const getPaymentSummary = () => {
    const relatedPayments = payments.filter(p => 
      p.siswa_id === payment.siswa_id && 
      p.item_pembayaran_id === payment.item_pembayaran_id
    );
    
    const totalPaid = relatedPayments.reduce((sum, p) => sum + p.nominal, 0);
    const obligation = payment.item_pembayaran?.nominal_wajib || 0;
    const remaining = Math.max(0, obligation - totalPaid);
    const isFullyPaid = remaining === 0;
    
    return {
      obligation,
      totalPaid,
      remaining,
      isFullyPaid
    };
  };

  const paymentSummary = getPaymentSummary();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detail Biaya Pelatihan</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPrint(payment)}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak Kwitansi
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">ID Pembayaran</label>
            <p className="text-sm font-mono">{payment.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1">{getStatusBadge(paymentSummary.isFullyPaid ? 'Lunas' : 'Belum Lunas')}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Siswa</label>
            <p className="font-medium">{payment.siswa?.nama || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Tanggal Pembayaran</label>
            <p>{formatDate(payment.tanggal_pembayaran)}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Item Pembayaran</label>
          <p className="font-medium">{payment.item_pembayaran?.nama_item || 'N/A'}</p>
        </div>

        {/* Payment Summary Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Ringkasan Pembayaran</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-600">Kewajiban</label>
              <p className="text-lg font-bold text-blue-600">
                {formatIDRCurrency(paymentSummary.obligation)}
              </p>
            </div>
            <div>
              <label className="text-gray-600">Total Dibayar</label>
              <p className="text-lg font-bold text-green-600">
                {formatIDRCurrency(paymentSummary.totalPaid)}
              </p>
            </div>
            <div>
              <label className="text-gray-600">Kekurangan</label>
              <p className={`text-lg font-bold ${paymentSummary.remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatIDRCurrency(paymentSummary.remaining)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Jumlah Pembayaran Ini</label>
            <p className="text-2xl font-bold text-green-600">
              {formatIDRCurrency(payment.nominal)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Metode Pembayaran</label>
            <p>{payment.metode_pembayaran}</p>
          </div>
        </div>

        {payment.keterangan && (
          <div>
            <label className="text-sm font-medium text-gray-600">Keterangan</label>
            <p className="text-sm bg-gray-50 p-3 rounded-md">{payment.keterangan}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-gray-600">Dibuat</label>
            <p className="text-sm">{new Date(payment.created_at).toLocaleString('id-ID')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Terakhir Diperbarui</label>
            <p className="text-sm">{new Date(payment.updated_at).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
