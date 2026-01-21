
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ArusKasTable } from './ArusKasTable';
import { ArusKasForm } from './ArusKasForm';
import { useArusKas } from '@/hooks/useArusKas';

export function ArusKasContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { arusKasList, loading, createArusKas, updateArusKas, deleteArusKas } = useArusKas();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingId) {
        await updateArusKas(editingId, data);
      } else {
        await createArusKas(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving arus kas:', error);
    }
  };

  if (showForm) {
    return (
      <ArusKasForm
        editingId={editingId}
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Daftar Arus Kas</h2>
          <p className="text-sm text-gray-600">Kelola data pemasukan dan pengeluaran</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      <ArusKasTable
        data={arusKasList}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteArusKas}
      />
    </div>
  );
}
