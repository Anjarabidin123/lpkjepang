
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { JournalTable } from './JournalTable';
import { JournalForm } from './JournalForm';
import { useJournal } from '@/hooks/useJournal';

export function JournalContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { journals, loading, createJournal, updateJournal, deleteJournal } = useJournal();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (journalData: any, details: any[]) => {
    try {
      if (editingId) {
        await updateJournal(journalData);
      } else {
        await createJournal(journalData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Error saving journal:', error);
    }
  };

  if (showForm) {
    return (
      <JournalForm
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
          <h2 className="text-lg font-semibold">Journal Entries</h2>
          <p className="text-sm text-gray-600">Manage double-entry bookkeeping journal entries</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Journal Entry
        </Button>
      </div>

      <JournalTable
        data={journals}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteJournal}
      />
    </div>
  );
}
