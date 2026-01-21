
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { ReportFinanceContent } from '@/components/ReportFinance/ReportFinanceContent';
import { AuthGuard } from '@/components/AuthGuard';

export default function ReportFinance() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
            <p className="text-gray-600">Laporan pemasukan, pengeluaran, dan laba rugi</p>
          </div>
        </div>
        
        <ReportFinanceContent />
      </div>
    </AuthGuard>
  );
}
