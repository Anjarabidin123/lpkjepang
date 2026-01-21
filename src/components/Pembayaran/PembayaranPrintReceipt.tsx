
import React from 'react';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface PembayaranPrintReceiptProps {
  pembayaran: any;
}

export function PembayaranPrintReceipt({ pembayaran }: PembayaranPrintReceiptProps) {
  const currentDate = new Date();
  const receiptNumber = `RCP-${pembayaran.id.slice(-8).toUpperCase()}`;

  return (
    <div className="max-w-md mx-auto bg-white p-6 text-sm print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-xl font-bold mb-2">BUKTI PEMBAYARAN</h1>
        <h2 className="text-lg font-semibold">Lembaga Pelatihan Kerja</h2>
        <p className="text-xs text-gray-600 mt-1">Sistem Manajemen Siswa Magang</p>
      </div>

      {/* Receipt Info */}
      <div className="mb-4 text-center">
        <p className="font-mono text-xs">No. Bukti: {receiptNumber}</p>
        <p className="text-xs text-gray-600">Tanggal Cetak: {formatDate(currentDate.toISOString())}</p>
      </div>

      {/* Payment Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-1">
          <span className="font-medium">Nama Siswa:</span>
          <span>{pembayaran.siswa?.nama || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-200 pb-1">
          <span className="font-medium">Tanggal Bayar:</span>
          <span>{formatDate(pembayaran.tanggal_pembayaran)}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-200 pb-1">
          <span className="font-medium">Metode Bayar:</span>
          <span>{pembayaran.metode_pembayaran}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-200 pb-1">
          <span className="font-medium">Status:</span>
          <span className="font-semibold">{pembayaran.status}</span>
        </div>
      </div>

      {/* Amount Section */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Total Pembayaran:</span>
          <span className="text-xl font-bold text-green-700">
            {formatIDRCurrency(pembayaran.nominal)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {pembayaran.keterangan && (
        <div className="mb-6">
          <p className="font-medium mb-1">Keterangan:</p>
          <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
            {pembayaran.keterangan}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-800 pt-4 mt-6">
        <div className="flex justify-between items-start text-xs">
          <div>
            <p className="font-medium">Terima kasih</p>
            <p className="text-gray-600">Pembayaran telah diterima</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Petugas</p>
            <div className="mt-8 border-b border-gray-400 w-20"></div>
            <p className="text-gray-600 mt-1">Tanda Tangan</p>
          </div>
        </div>
      </div>

      {/* Print Info */}
      <div className="text-center mt-6 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500">
          Dokumen ini dicetak secara otomatis oleh sistem
        </p>
      </div>
    </div>
  );
}
