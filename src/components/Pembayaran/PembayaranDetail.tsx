
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { Printer, X } from 'lucide-react';

interface PembayaranDetailProps {
  pembayaran: any;
  onClose: () => void;
  onPrint: (pembayaran: any) => void;
}

export function PembayaranDetail({ pembayaran, onClose, onPrint }: PembayaranDetailProps) {
  if (!pembayaran) return null;

  const nominalWajib = pembayaran.item_pembayaran?.nominal_wajib || 0;
  const kekurangan = Math.max(nominalWajib - pembayaran.nominal, 0);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Detail Pembayaran</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(pembayaran)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Printer className="h-4 w-4" />
            Cetak Bukti
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Informasi Siswa</h3>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-medium text-lg">{pembayaran.siswa?.nama || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Nominal Pembayaran</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-bold text-2xl text-green-700 font-mono break-all">
                  {formatIDRCurrency(pembayaran.nominal)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Nilai: {pembayaran.nominal?.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Kekurangan</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-bold text-2xl text-red-700 font-mono break-all">
                  {formatIDRCurrency(kekurangan)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Detail Transaksi</h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tanggal Transaksi:</span>
                  <span className="font-medium">{formatDate(pembayaran.tanggal_pembayaran)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium">{pembayaran.metode_pembayaran}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Pembayaran Info */}
        {pembayaran.item_pembayaran && (
          <div>
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Item Pembayaran</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-lg text-blue-800">{pembayaran.item_pembayaran.nama_item}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Nominal Wajib: {formatIDRCurrency(pembayaran.item_pembayaran.nominal_wajib)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Dibuat: {formatDate(pembayaran.created_at)}</p>
            {pembayaran.updated_at !== pembayaran.created_at && (
              <p>Diperbarui: {formatDate(pembayaran.updated_at)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
