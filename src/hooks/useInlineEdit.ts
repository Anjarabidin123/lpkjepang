
import { useState } from 'react';
import { useSiswaMagang } from './useSiswaMagang';

export function useInlineEdit<T extends { id: string }>() {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const { deleteSiswaMagang, isDeleting } = useSiswaMagang();

  const startEdit = (item: T) => {
    setEditingItem(item);
    setIsCreating(false);
    setViewingItem(null);
  };

  const startCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setViewingItem(null);
  };

  const startView = (item: T) => {
    setViewingItem(item);
    setEditingItem(null);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsCreating(false);
    setViewingItem(null);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setFormModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setFormModalOpen(true);
  };

  const handleView = (item: T) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSiswaMagang(id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSave = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormModalOpen(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  };

  return {
    editingItem,
    setEditingItem,
    isCreating,
    viewingItem,
    formModalOpen,
    setFormModalOpen,
    detailModalOpen,
    setDetailModalOpen,
    selectedItem,
    setSelectedItem,
    isDeleting,
    startEdit,
    startCreate,
    startView,
    cancelEdit,
    handleCreateNew,
    handleEdit,
    handleView,
    handleDelete,
    handleSave,
    handleCancel,
    handleCloseFormModal,
    handleCloseDetailModal,
    isEditing: editingItem !== null,
    isViewing: viewingItem !== null,
  };
}
