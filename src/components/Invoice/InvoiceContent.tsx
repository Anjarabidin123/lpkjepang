
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, ArrowLeft } from 'lucide-react';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceSettings } from './InvoiceSettings';
import { InvoiceDetailInline } from './InvoiceDetailInline';
import { useInvoice } from '@/hooks/useInvoice';
import { useInvoiceInlineEdit } from '@/hooks/useInvoiceInlineEdit';

export function InvoiceContent() {
  const [activeTab, setActiveTab] = useState('data-invoice');
  const { invoiceList, loading, createInvoice, updateInvoice, deleteInvoice } = useInvoice();
  const {
    viewingInvoice,
    editingInvoice,
    isCreating,
    isInDetailView,
    isInEditMode,
    startView,
    startEdit,
    startCreate,
    clearAll,
  } = useInvoiceInlineEdit();

  const handleEdit = (id: string) => {
    const invoice = invoiceList.find(inv => inv.id === id);
    if (invoice) {
      startEdit(invoice);
    }
  };

  const handleView = (invoice: any) => {
    startView(invoice);
  };

  const handleSubmit = async (data: any, items: any[]) => {
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, data, items);
      } else {
        await createInvoice(data, items);
      }
      clearAll();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  // Show inline detail view
  if (isInDetailView && viewingInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={clearAll}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Invoice
          </Button>
        </div>
        <InvoiceDetailInline 
          invoice={viewingInvoice} 
          onEdit={handleEdit}
          onClose={clearAll}
        />
      </div>
    );
  }

  // Show form for create or edit
  if (isInEditMode) {
    return (
      <InvoiceForm
        editingId={editingInvoice?.id || null}
        initialData={editingInvoice}
        onSubmit={handleSubmit}
        onCancel={clearAll}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="data-invoice" className="flex items-center gap-2">
            Data Invoice
          </TabsTrigger>
          <TabsTrigger value="pengaturan" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Pengaturan
          </TabsTrigger>
        </TabsList>
        
        {activeTab === 'data-invoice' && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Invoice
          </Button>
        )}
      </div>

      <TabsContent value="data-invoice" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Daftar Invoice</h2>
          <p className="text-sm text-gray-600">Kelola invoice manajemen fee ke Kumiai dengan multiple siswa magang</p>
        </div>

        <InvoiceTable
          data={invoiceList}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteInvoice}
          onView={handleView}
        />
      </TabsContent>

      <TabsContent value="pengaturan" className="space-y-4">
        <InvoiceSettings />
      </TabsContent>
    </Tabs>
  );
}
