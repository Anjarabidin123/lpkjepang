
import { useState } from 'react';

interface Invoice {
  id: string;
  nomor_invoice: string;
  status: string;
  kumiai_id: string;
  tanggal_invoice: string;
  tanggal_jatuh_tempo?: string;
  nominal: number;
  keterangan?: string;
  kumiai?: {
    id: string;
    nama: string;
    kode: string;
  };
  invoice_items?: Array<{
    id: string;
    siswa_magang_id: string;
    nominal_fee: number;
    keterangan?: string;
    siswa_magang?: {
      id: string;
      siswa?: {
        id: string;
        nama: string;
      };
    };
  }>;
  created_at: string;
  updated_at: string;
}

export function useInvoiceInlineEdit() {
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startView = (invoice: Invoice) => {
    console.log('Starting view for invoice:', invoice);
    setViewingInvoice(invoice);
    setEditingInvoice(null);
    setIsCreating(false);
  };

  const startEdit = (invoice: Invoice) => {
    console.log('Starting edit for invoice:', invoice);
    setEditingInvoice(invoice);
    setViewingInvoice(null);
    setIsCreating(false);
  };

  const startCreate = () => {
    console.log('Starting create new invoice');
    setIsCreating(true);
    setViewingInvoice(null);
    setEditingInvoice(null);
  };

  const clearAll = () => {
    console.log('Clearing all states');
    setViewingInvoice(null);
    setEditingInvoice(null);
    setIsCreating(false);
  };

  const isInDetailView = viewingInvoice !== null;
  const isInEditMode = editingInvoice !== null || isCreating;

  return {
    viewingInvoice,
    editingInvoice,
    isCreating,
    isInDetailView,
    isInEditMode,
    startView,
    startEdit,
    startCreate,
    clearAll,
  };
}
