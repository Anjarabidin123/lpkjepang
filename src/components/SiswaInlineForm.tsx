
import React from 'react';
import { OfficialBiodataForm } from "@/components/Siswa/OfficialBiodataForm";
import type { Siswa } from "@/hooks/useSiswa";

interface SiswaInlineFormProps {
  siswa?: Siswa;
  onCancel: () => void;
  onSuccess: () => void;
}

export function SiswaInlineForm({ siswa, onCancel, onSuccess }: SiswaInlineFormProps) {
  return (
    <OfficialBiodataForm 
      siswa={siswa}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
}
