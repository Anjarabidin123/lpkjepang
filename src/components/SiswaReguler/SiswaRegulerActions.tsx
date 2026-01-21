
import React from 'react';
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaRegulerActionsProps {
  onEdit: (siswaMagang: SiswaMagang) => void;
  onView: (siswaMagang: SiswaMagang) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function SiswaRegulerActions({
  onEdit,
  onView,
  onDelete,
  onCreateNew,
  onSave,
  onCancel
}: SiswaRegulerActionsProps) {
  return {
    handleEdit: onEdit,
    handleView: onView,
    handleDelete: onDelete,
    handleCreateNew: onCreateNew,
    handleSave: onSave,
    handleCancel: onCancel
  };
}
