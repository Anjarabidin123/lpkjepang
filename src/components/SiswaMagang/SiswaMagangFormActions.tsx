
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface SiswaMagangFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

export function SiswaMagangFormActions({ isLoading, onCancel, disabled = false }: SiswaMagangFormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X className="w-4 h-4 mr-2" />
        Batal
      </Button>
      <Button
        type="submit"
        disabled={isLoading || disabled}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  );
}
