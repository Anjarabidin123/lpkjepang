
import React from 'react';
import { Label } from '@/components/ui/label';
import { formatJPYCurrency } from '@/lib/formatCurrency';

interface InvoiceFormSummaryProps {
  nominal: number;
  selectedSetting: any;
  selectedSiswaCount: number;
  selectedMonthsCount: number;
}

export function InvoiceFormSummary({ 
  nominal, 
  selectedSetting, 
  selectedSiswaCount, 
  selectedMonthsCount 
}: InvoiceFormSummaryProps) {
  return (
    <div>
      <Label htmlFor="nominal">Total Nominal</Label>
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-2xl font-bold text-green-700 font-mono">
          {formatJPYCurrency(nominal)}
        </div>
        {selectedSetting && selectedSiswaCount > 0 && selectedMonthsCount > 0 && (
          <div className="text-xs text-gray-600 mt-1">
            {formatJPYCurrency(selectedSetting.nominal_base)} × {selectedSiswaCount} siswa × {selectedMonthsCount} bulan
          </div>
        )}
      </div>
    </div>
  );
}
