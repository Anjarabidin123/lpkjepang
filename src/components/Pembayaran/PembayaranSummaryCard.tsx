
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { PembayaranStatusBadge } from './PembayaranStatusBadge';

interface PembayaranSummaryCardProps {
  pembayaran: any;
}

export function PembayaranSummaryCard({ pembayaran }: PembayaranSummaryCardProps) {
  const nominalWajib = pembayaran.item_pembayaran?.nominal_wajib || 0;
  const nominalBayar = Number(pembayaran.nominal) || 0;
  const kekurangan = Math.max(nominalWajib - nominalBayar, 0);
  const kelebihan = Math.max(nominalBayar - nominalWajib, 0);

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-800 text-lg">Ringkasan Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Siswa:</p>
            <p className="font-semibold text-blue-900">{pembayaran.siswa?.nama}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Status:</p>
            <PembayaranStatusBadge status={pembayaran.status} kekurangan={kekurangan} />
          </div>
        </div>

        <div className="border-t border-blue-200 pt-3">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nominal Wajib:</span>
              <span className="font-semibold">{formatIDRCurrency(nominalWajib)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dibayar:</span>
              <span className="font-semibold text-green-600">{formatIDRCurrency(nominalBayar)}</span>
            </div>
            {kekurangan > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kekurangan:</span>
                <span className="font-semibold text-red-600">{formatIDRCurrency(kekurangan)}</span>
              </div>
            )}
            {kelebihan > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kelebihan:</span>
                <span className="font-semibold text-orange-600">{formatIDRCurrency(kelebihan)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md p-3 border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Item Pembayaran:</p>
          <p className="font-medium text-blue-900">
            {pembayaran.item_pembayaran?.nama_item || 'Tidak Ada Item'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
