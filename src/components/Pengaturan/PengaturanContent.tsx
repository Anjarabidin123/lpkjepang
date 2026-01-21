
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemPembayaranTable } from '@/components/Pembayaran/ItemPembayaranTable';
import { ItemPembayaranForm } from '@/components/Pembayaran/ItemPembayaranForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useItemPembayaran } from '@/hooks/useItemPembayaran';
import { KategoriPengeluaranTable } from './KategoriPengeluaranTable';
import { KategoriPemasukanTable } from './KategoriPemasukanTable';

export function PengaturanContent() {
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const {
    itemPembayaranList,
    loading,
    createItemPembayaran,
    updateItemPembayaran,
    deleteItemPembayaran,
  } = useItemPembayaran();

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item pembayaran ini?')) {
      await deleteItemPembayaran(id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingItem) {
        await updateItemPembayaran(editingItem.id, data);
      } else {
        await createItemPembayaran(data);
      }
      setShowItemForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item pembayaran:', error);
    }
  };

  const handleFormCancel = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="item-pembayaran" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="item-pembayaran">Item Pembayaran</TabsTrigger>
          <TabsTrigger value="kategori-pengeluaran">Kategori Pengeluaran</TabsTrigger>
          <TabsTrigger value="kategori-pemasukan">Kategori Pemasukan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="item-pembayaran" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Item Pembayaran</h3>
              <p className="text-sm text-gray-600">Kelola item pembayaran untuk internal payment</p>
            </div>
            <Button onClick={() => setShowItemForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Item
            </Button>
          </div>
          
          {showItemForm ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <ItemPembayaranForm
                editingId={editingItem?.id || null}
                initialData={editingItem}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <ItemPembayaranTable
              data={itemPembayaranList}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="kategori-pengeluaran" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Kategori Pengeluaran</h3>
            <p className="text-sm text-gray-600">Kelola kategori untuk pengeluaran operasional</p>
          </div>
          <KategoriPengeluaranTable />
        </TabsContent>
        
        <TabsContent value="kategori-pemasukan" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Kategori Pemasukan</h3>
            <p className="text-sm text-gray-600">Kelola kategori untuk pemasukan operasional</p>
          </div>
          <KategoriPemasukanTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
