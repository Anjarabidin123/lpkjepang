
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import { useKumiai } from '@/hooks/useKumiai';
import { useInvoiceSettings } from '@/hooks/useInvoiceSettings';
import { formatCurrency } from '@/lib/formatCurrency';

export function InvoiceSettings() {
  const { kumiai } = useKumiai();
  const { settings, loading, createSetting, updateSetting, deleteSetting } = useInvoiceSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    kumiai_id: '',
    item_pembayaran: '',
    nominal_base: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSetting(editingId, formData);
      } else {
        await createSetting(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ kumiai_id: '', item_pembayaran: '', nominal_base: 0 });
    } catch (error) {
      console.error('Error saving invoice setting:', error);
    }
  };

  const handleEdit = (setting: any) => {
    setEditingId(setting.id);
    setFormData({
      kumiai_id: setting.kumiai_id,
      item_pembayaran: setting.item_pembayaran,
      nominal_base: setting.nominal_base
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus pengaturan ini?')) {
      await deleteSetting(id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ kumiai_id: '', item_pembayaran: '', nominal_base: 0 });
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Pengaturan Invoice</CardTitle>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengaturan
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? 'Edit Pengaturan' : 'Tambah Pengaturan Baru'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="kumiai_id">Kumiai</Label>
                      <Select 
                        value={formData.kumiai_id} 
                        onValueChange={(value) => setFormData({ ...formData, kumiai_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kumiai" />
                        </SelectTrigger>
                        <SelectContent>
                          {kumiai.map((kumiaiItem) => (
                            <SelectItem key={kumiaiItem.id} value={kumiaiItem.id}>
                              {kumiaiItem.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="item_pembayaran">Item Pembayaran</Label>
                      <Input
                        value={formData.item_pembayaran}
                        onChange={(e) => setFormData({ ...formData, item_pembayaran: e.target.value })}
                        placeholder="Contoh: Management Fee"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="nominal_base">Nominal Base (per siswa per bulan)</Label>
                      <Input
                        type="number"
                        value={formData.nominal_base}
                        onChange={(e) => setFormData({ ...formData, nominal_base: Number(e.target.value) })}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Simpan'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Daftar Pengaturan</h3>
            
            {settings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada pengaturan invoice. Silakan tambah pengaturan baru.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>Kumiai</TableHead>
                      <TableHead>Item Pembayaran</TableHead>
                      <TableHead className="text-right">Nominal Base</TableHead>
                      <TableHead className="text-center w-32">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.map((setting, index) => (
                      <TableRow key={setting.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{setting.kumiai?.nama || 'N/A'}</span>
                            <div className="text-xs text-gray-500">{setting.kumiai?.kode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{setting.item_pembayaran}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-green-600">
                          {formatCurrency(setting.nominal_base)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(setting)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 h-8 w-8"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(setting.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
