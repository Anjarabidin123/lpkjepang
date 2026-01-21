
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SiswaMagangForm } from '@/components/SiswaMagangForm';
import type { SiswaMagang } from '@/types/siswaMagang';

interface SiswaMagangModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswaMagang?: SiswaMagang | null;
  onSuccess?: () => void;
}

export function SiswaMagangModal({ 
  isOpen, 
  onClose, 
  siswaMagang, 
  onSuccess 
}: SiswaMagangModalProps) {
  const handleSuccess = () => {
    console.log('Modal form success, closing modal');
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {siswaMagang ? 'Edit Siswa Magang' : 'Tambah Siswa Magang'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SiswaMagangForm
            siswaMagang={siswaMagang}
            onClose={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
