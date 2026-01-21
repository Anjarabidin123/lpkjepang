
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiswaMagangDetail } from "@/components/SiswaMagangDetail";
import { SiswaMagangForm } from "@/components/SiswaMagangForm";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaRegulerModalsProps {
  formModalOpen: boolean;
  detailModalOpen: boolean;
  selectedSiswaMagang: SiswaMagang | null;
  onCloseFormModal: () => void;
  onCloseDetailModal: () => void;
}

export function SiswaRegulerModals({
  formModalOpen,
  detailModalOpen,
  selectedSiswaMagang,
  onCloseFormModal,
  onCloseDetailModal
}: SiswaRegulerModalsProps) {
  return (
    <>
      {/* Wide Modal Dialog for Form */}
      <Dialog open={formModalOpen} onOpenChange={onCloseFormModal}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSiswaMagang ? 'Edit Siswa Magang' : 'Tambah Siswa Magang'}
            </DialogTitle>
          </DialogHeader>
          <SiswaMagangForm
            siswaMagang={selectedSiswaMagang}
            onClose={onCloseFormModal}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Dialog for Detail View */}
      {detailModalOpen && selectedSiswaMagang && (
        <SiswaMagangDetail
          siswaMagang={selectedSiswaMagang}
          onClose={onCloseDetailModal}
        />
      )}
    </>
  );
}
