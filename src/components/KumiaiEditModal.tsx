
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { KumiaiForm } from '@/components/KumiaiForm';
import { Kumiai } from '@/hooks/useKumiai';

interface KumiaiEditModalProps {
  kumiai: Kumiai | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Kumiai, 'id'>) => void;
  isLoading?: boolean;
}

export function KumiaiEditModal({ kumiai, isOpen, onClose, onSave, isLoading }: KumiaiEditModalProps) {
  if (!kumiai) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Kumiai - {kumiai.nama}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          <KumiaiForm
            kumiai={kumiai}
            onSave={onSave}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
