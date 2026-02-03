
import React from 'react';
import { Button } from "@/components/ui/button";
import type { JenisKerja } from "@/types";

interface JenisKerjaFormActionsProps {
  jenisKerja?: JenisKerja;
  isLoading: boolean;
  onCancel: () => void;
}

export function JenisKerjaFormActions({ jenisKerja, isLoading, onCancel }: JenisKerjaFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Batal
      </Button>
      <Button type="submit" disabled={isLoading}>
        {jenisKerja ? "Update" : "Simpan"}
      </Button>
    </div>
  );
}
