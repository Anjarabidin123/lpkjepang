
import { useState } from 'react';

export function useFormToggle() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingId(null);
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setIsEditing(true);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsCreating(false);
  };

  return {
    isEditing,
    editingId,
    isCreating,
    startCreate,
    startEdit,
    cancelEdit
  };
}
