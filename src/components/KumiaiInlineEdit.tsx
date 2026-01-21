
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Building2 } from 'lucide-react';
import { KumiaiForm } from '@/components/KumiaiForm';
import { Kumiai } from '@/hooks/useKumiai';

interface KumiaiInlineEditProps {
  kumiai: Kumiai;
  onSave: (data: Omit<Kumiai, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function KumiaiInlineEdit({ kumiai, onSave, onCancel, isLoading }: KumiaiInlineEditProps) {
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-orange-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Building2 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Kumiai</h3>
            <p className="text-sm text-gray-500">{kumiai.nama} - {kumiai.kode}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-6">
        <KumiaiForm
          kumiai={kumiai}
          onSave={onSave}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
