
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { InternalPaymentContent } from '@/components/InternalPayment/InternalPaymentContent';
import { AuthGuard } from '@/components/AuthGuard';

export default function InternalPayment() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Biaya Pelatihan</h1>
            <p className="text-gray-600">Kelola transaksi pembayaran biaya pelatihan siswa</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Biaya Pelatihan</CardTitle>
          </CardHeader>
          <CardContent>
            <InternalPaymentContent />
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
