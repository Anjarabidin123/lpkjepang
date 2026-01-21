
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings2 } from 'lucide-react';
import { ItemPembayaranTable } from './ItemPembayaranTable';
import { ItemPembayaranForm } from './ItemPembayaranForm';
import { useItemPembayaran } from '@/hooks/useItemPembayaran';

export function PembayaranSettings() {
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { itemPembayaranList, loading, createItemPembayaran, updateItemPembayaran, deleteItemPembayaran } = useItemPembayaran();

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleCloseItemForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleSubmitItem = async (data: any) => {
    try {
      if (editingItem) {
        await updateItemPembayaran(editingItem.id, data);
      } else {
        await createItemPembayaran(data);
      }
      handleCloseItemForm();
    } catch (error) {
      console.error('Error saving item pembayaran:', error);
    }
  };

  if (showItemForm) {
    return (
      <ItemPembayaranForm
        editingId={editingItem?.id || null}
        initialData={editingItem}
        onSubmit={handleSubmitItem}
        onCancel={handleCloseItemForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings2 className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">Pengaturan Pembayaran</h2>
          <p className="text-sm text-gray-600">Kelola item pembayaran dan pengaturan lainnya</p>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Item Pembayaran</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Item Pembayaran</CardTitle>
              <Button onClick={handleCreateItem}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item
              </Button>
            </CardHeader>
            <CardContent>
              <ItemPembayaranTable
                data={itemPembayaranList}
                loading={loading}
                onEdit={handleEditItem}
                onDelete={deleteItemPembayaran}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
