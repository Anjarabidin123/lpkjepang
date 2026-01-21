
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { journalTable } from '@/lib/localStorage/tables';

export interface JournalEntry {
  id: string;
  tanggal: string;
  kode_jurnal: string;
  deskripsi: string;
  referensi?: string;
  total_debit: number;
  total_kredit: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChartOfAccount {
  id: string;
  kode_akun: string;
  nama_akun: string;
  jenis_akun: string;
  kategori: string;
  saldo_normal: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useJournal() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJournalEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = journalTable.getAll();
      const processedData = data.map(item => ({
        ...item,
        total_debit: Number(item.total_debit) || 0,
        total_kredit: Number(item.total_kredit) || 0
      })).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      
      setJournalEntries(processedData);
    } catch (err: any) {
      console.error('Error fetching journal entries:', err);
      setError(err.message || 'Failed to fetch journal entries');
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartOfAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // COA is usually static or managed elsewhere, for now returning empty or we could add a coaTable
      setChartOfAccounts([]);
      
    } catch (err: any) {
      console.error('Error fetching chart of accounts:', err);
      setError(err.message || 'Failed to fetch chart of accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const createJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    try {
      setIsLoading(true);
      
      const insertedData = journalTable.create({
        ...entry,
        total_debit: Number(entry.total_debit),
        total_kredit: Number(entry.total_kredit)
      } as any);

      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });
      
      await fetchJournalEntries();
      return insertedData;
    } catch (err: any) {
      console.error('Error creating journal entry:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create journal entry",
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      setIsLoading(true);
      const updateData = { ...updates };
      if (updates.total_debit !== undefined) updateData.total_debit = Number(updates.total_debit);
      if (updates.total_kredit !== undefined) updateData.total_kredit = Number(updates.total_kredit);

      const updated = journalTable.update(id, updateData);
      if (!updated) throw new Error('Failed to update journal entry');

      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });
      
      await fetchJournalEntries();
      return updated;
    } catch (err: any) {
      console.error('Error updating journal entry:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update journal entry",
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJournalEntry = async (id: string) => {
    try {
      setIsLoading(true);
      const success = journalTable.delete(id);
      if (!success) throw new Error('Failed to delete journal entry');

      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
      
      await fetchJournalEntries();
    } catch (err: any) {
      console.error('Error deleting journal entry:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete journal entry",
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getJournalDetails = async (id: string) => {
    return journalTable.getById(id);
  };

  useEffect(() => {
    fetchJournalEntries();
    fetchChartOfAccounts();
  }, []);

  return {
    journals: journalEntries,
    journalEntries,
    chartOfAccounts,
    loading: isLoading,
    isLoading,
    error,
    fetchJournalEntries,
    fetchChartOfAccounts,
    createJournal: createJournalEntry,
    createJournalEntry,
    updateJournal: updateJournalEntry,
    deleteJournal: deleteJournalEntry,
    getJournalDetails,
  };
}
