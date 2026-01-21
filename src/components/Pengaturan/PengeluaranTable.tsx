
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { usePengeluaran, type Pengeluaran } from '@/hooks/usePengeluaran';
import { useKategoriPengeluaran } from '@/hooks/useKategoriPengeluaran';
import { formatCurrency } from '@/lib/formatCurrency';

export function PengeluaranTable() {
  const { expenses, loading, createExpense, updateExpense, deleteExpense, fetchExpenses } = usePengeluaran();
  const { categories } = useKategoriPengeluaran();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Pengeluaran | null>(null);
  const [formData, setFormData] = useState({
    kategori_id: '',
    nama_pengeluaran: '',
    nominal: '',
    tanggal_pengeluaran: new Date().toISOString().split('T')[0],
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

      if (editingExpense) {
        await updateExpense(editingExpense.id, submitData);
      } else {
        await createExpense(submitData);
      }
      
      setIsDialogOpen(false);
      setEditingExpense(null);
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense: Pengeluaran) => {
    setEditingExpense(expense);
    setFormData({
      kategori_id: expense.kategori_id || '',
      nama_pengeluaran: expense.nama_pengeluaran,
      nominal: expense.nominal.toString(),
      tanggal_pengeluaran: expense.tanggal_pengeluaran,
      keterangan: expense.keterangan || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      kategori_id: '',
      nama_pengeluaran: '',
      nominal: '',
      tanggal_pengeluaran: new Date().toISOString().split('T')[0],
      keterangan: ''
    });
    setEditingExpense(null);
  };

  const activeCategories = categories.filter(cat => cat.is_active);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Total: {expenses.length} pengeluaran
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchExpenses} disabled={loading}>
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
                Tambah Pengeluaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}
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
                  <Label htmlFor="nama_pengeluaran">Nama Pengeluaran</Label>
                  <Input
                    id="nama_pengeluaran"
                    value={formData.nama_pengeluaran}
                    onChange={(e) => setFormData({ ...formData, nama_pengeluaran: e.target.value })}
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
                  <Label htmlFor="tanggal_pengeluaran">Tanggal</Label>
                  <Input
                    id="tanggal_pengeluaran"
                    type="date"
                    value={formData.tanggal_pengeluaran}
                    onChange={(e) => setFormData({ ...formData, tanggal_pengeluaran: e.target.value })}
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
                    {editingExpense ? 'Update' : 'Simpan'}
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
              <TableHead>Nama Pengeluaran</TableHead>
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
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Belum ada data pengeluaran
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.tanggal_pengeluaran).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {expense.nama_pengeluaran}
                  </TableCell>
                  <TableCell>
                    {expense.kategori_pengeluaran?.nama_kategori || 'Tidak ada kategori'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(expense.nominal)}
                  </TableCell>
                  <TableCell>{expense.keterangan || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
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
