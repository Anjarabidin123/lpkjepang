
import React from 'react';
import { formatCurrency } from '@/lib/formatCurrency';

interface InvoiceFormSettingsProps {
  selectedSetting: any;
}

export function InvoiceFormSettings({ selectedSetting }: InvoiceFormSettingsProps) {
  if (!selectedSetting) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">Pengaturan Aktif</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Item Pembayaran:</span>
          <span className="ml-2 font-medium">{selectedSetting.item_pembayaran}</span>
        </div>
        <div>
          <span className="text-gray-600">Nominal Base:</span>
          <span className="ml-2 font-medium text-green-600">{formatCurrency(selectedSetting.nominal_base)}</span>
        </div>
      </div>
    </div>
  );
}
