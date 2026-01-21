
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { InvoiceContent } from '@/components/Invoice/InvoiceContent';

export default function Invoice() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-gray-600">Kelola invoice manajemen fee siswa magang ke Kumiai</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Invoice Kumiai</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceContent />
        </CardContent>
      </Card>
    </div>
  );
}
