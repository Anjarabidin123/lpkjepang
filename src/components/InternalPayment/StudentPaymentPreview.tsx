
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { type InternalPayment } from '@/hooks/useInternalPayment';

interface StudentPaymentPreviewProps {
  payments: InternalPayment[];
  itemPembayaranId: string;
  siswaName: string;
}

export function StudentPaymentPreview({ payments, itemPembayaranId, siswaName }: StudentPaymentPreviewProps) {
  const relevantPayments = payments.filter(p => p.item_pembayaran_id === itemPembayaranId);
  const totalPaid = relevantPayments.reduce((sum, payment) => sum + payment.nominal, 0);
  const obligation = relevantPayments[0]?.item_pembayaran?.nominal_wajib || 0;
  const remaining = Math.max(0, obligation - totalPaid);
  const isFullyPaid = remaining === 0;

  if (relevantPayments.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Riwayat Pembayaran - {siswaName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Belum ada riwayat pembayaran untuk item ini</p>
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Kewajiban:</p>
              <p className="font-semibold">{formatIDRCurrency(obligation)}</p>
            </div>
            <div>
              <p className="text-gray-600">Sudah Dibayar:</p>
              <p className="font-semibold">{formatIDRCurrency(0)}</p>
            </div>
            <div>
              <p className="text-gray-600">Kekurangan:</p>
              <p className="font-semibold text-red-600">{formatIDRCurrency(obligation)}</p>
            </div>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-red-100 text-red-800">Belum Lunas</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Riwayat Pembayaran - {siswaName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {relevantPayments.map((payment) => (
            <div key={payment.id} className="flex justify-between items-center text-sm border-b pb-2">
              <div>
                <p className="font-medium">{formatDate(payment.tanggal_pembayaran)}</p>
                <p className="text-gray-600">{payment.metode_pembayaran}</p>
              </div>
              <p className="font-semibold">{formatIDRCurrency(payment.nominal)}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm border-t pt-3">
          <div>
            <p className="text-gray-600">Kewajiban:</p>
            <p className="font-semibold">{formatIDRCurrency(obligation)}</p>
          </div>
          <div>
            <p className="text-gray-600">Sudah Dibayar:</p>
            <p className="font-semibold">{formatIDRCurrency(totalPaid)}</p>
          </div>
          <div>
            <p className="text-gray-600">Kekurangan:</p>
            <p className={`font-semibold ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatIDRCurrency(remaining)}
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          <Badge variant={isFullyPaid ? "default" : "secondary"} 
                 className={isFullyPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
            {isFullyPaid ? 'Lunas' : 'Belum Lunas'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
