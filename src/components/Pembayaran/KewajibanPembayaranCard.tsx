
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatIDRCurrency } from '@/lib/formatCurrency';

interface KewajibanPembayaranCardProps {
  kewajiban: any;
}

export function KewajibanPembayaranCard({ kewajiban }: KewajibanPembayaranCardProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{kewajiban.item_pembayaran?.nama_item}</h4>
              <p className="text-sm text-gray-600">
                Nominal Wajib: {formatIDRCurrency(kewajiban.nominal_wajib)}
              </p>
            </div>
            <Badge variant={kewajiban.status_lunas ? 'default' : 'destructive'}>
              {kewajiban.status_lunas ? 'Lunas' : 'Belum Lunas'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Sudah Dibayar:</p>
              <p className="font-medium text-green-600">
                {formatIDRCurrency(kewajiban.nominal_terbayar)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Sisa Kewajiban:</p>
              <p className="font-medium text-red-600">
                {formatIDRCurrency(kewajiban.sisa_kewajiban)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
