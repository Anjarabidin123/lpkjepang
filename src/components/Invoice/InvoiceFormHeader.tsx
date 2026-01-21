
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceFormHeaderProps {
  editingId: string | null;
}

export function InvoiceFormHeader({ editingId }: InvoiceFormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>{editingId ? 'Edit Invoice' : 'Buat Invoice Baru'}</CardTitle>
    </CardHeader>
  );
}
