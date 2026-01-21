
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Save } from 'lucide-react';

interface JobOrderFormActionsProps {
  isLoading: boolean;
  isFormValid: boolean;
  onCancel: () => void;
}

export function JobOrderFormActions({ isLoading, isFormValid, onCancel }: JobOrderFormActionsProps) {
  return (
    <div className="flex gap-2 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isLoading}
      >
        Batal
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading || !isFormValid}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  );
}
