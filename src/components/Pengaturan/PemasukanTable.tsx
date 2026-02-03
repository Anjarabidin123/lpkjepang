
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { usePemasukan, type Pemasukan } from '@/hooks/usePemasukan';
import { useKategoriPemasukan } from '@/hooks/useKategoriPemasukan';
import { formatCurrency } from '@/lib/formatCurrency';

export function PemasukanTable() {
  const { incomes, loading, createIncome, updateIncome, deleteIncome, fetchIncomes } = usePemasukan();
  const { categories } = useKategoriPemasukan();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Pemasukan | null>(null);
  const [formData, setFormData] = useState({
    kategori_id: '',
    nama_pemasukan: '',
    nominal: '',
    tanggal_pemasukan: new Date().toISOString().split('T')[0],
    keterangan: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        kategori_id: formData.kategori_id || undefined,
        nominal: parseFloat(formData.nominal) || 0,
        keterangan: formData.keterangan || undefined
      };

      if (editingIncome) {
        await updateIncome(editingIncome.id, submitData);
      } else {
        await createIncome(submitData);
      }
      
      setIsDialogOpen(false);
      setEditingIncome(null);
      resetForm();
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  const handleEdit = (income: Pemasukan) => {
    setEditingIncome(income);
    setFormData({
      kategori_id: income.kategori_id || '',
      nama_pemasukan: income.nama_pemasukan,
      nominal: income.nominal.toString(),
      tanggal_pemasukan: income.tanggal_pemasukan,
      keterangan: income.keterangan || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await deleteIncome(id);
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      kategori_id: '',
      nama_pemasukan: '',
      nominal: '',
      tanggal_pemasukan: new Date().toISOString().split('T')[0],
      keterangan: ''
    });
    setEditingIncome(null);
  };

  const activeCategories = categories.filter(cat => cat.is_active);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Total: {incomes.length} pemasukan
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchIncomes} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pemasukan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingIncome ? 'Edit Pemasukan' : 'Tambah Pemasukan Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="kategori_id">Kategori</Label>
                  <Select 
                    value={formData.kategori_id} 
                    onValueChange={(value) => setFormData({ ...formData, kategori_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nama_kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nama_pemasukan">Nama Pemasukan</Label>
                  <Input
                    id="nama_pemasukan"
                    value={formData.nama_pemasukan}
                    onChange={(e) => setFormData({ ...formData, nama_pemasukan: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nominal">Nominal (Rp)</Label>
                  <Input
                    id="nominal"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.nominal}
                    onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tanggal_pemasukan">Tanggal</Label>
                  <Input
                    id="tanggal_pemasukan"
                    type="date"
                    value={formData.tanggal_pemasukan}
                    onChange={(e) => setFormData({ ...formData, tanggal_pemasukan: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Textarea
                    id="keterangan"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingIncome ? 'Update' : 'Simpan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Pemasukan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : incomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Belum ada data pemasukan
                </TableCell>
              </TableRow>
            ) : (
              incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>
                    {new Date(income.tanggal_pemasukan).toLocaleDateString('en-US')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {income.nama_pemasukan}
                  </TableCell>
                  <TableCell>
                    {income.kategori_pemasukan?.nama_kategori || 'Tidak ada kategori'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(income.nominal)}
                  </TableCell>
                  <TableCell>{income.keterangan || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(income)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(income.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
