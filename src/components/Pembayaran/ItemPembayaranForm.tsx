
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatNumberInput, parseFormattedNumber, formatIDRCurrency } from '@/lib/formatCurrency';

interface ItemPembayaranFormProps {
  editingId: string | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

export function ItemPembayaranForm({ editingId, onSubmit, onCancel, initialData }: ItemPembayaranFormProps) {
  const [formData, setFormData] = useState({
    nama_item: '',
    nominal_wajib: '',
    deskripsi: '',
    is_active: true
  });

  useEffect(() => {
    if (editingId && initialData) {
      setFormData({
        nama_item: initialData.nama_item || '',
        nominal_wajib: formatNumberInput(initialData.nominal_wajib?.toString() || '0'),
        deskripsi: initialData.deskripsi || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [editingId, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      nominal_wajib: parseFormattedNumber(formData.nominal_wajib)
    });
  };

  const handleNominalChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const limitedValue = numericValue.slice(0, 12);
    
    if (limitedValue === '') {
      setFormData({ ...formData, nominal_wajib: '' });
      return;
    }
    
    const formattedValue = formatNumberInput(limitedValue);
    setFormData({ ...formData, nominal_wajib: formattedValue });
  };

  const displayPreview = () => {
    if (!formData.nominal_wajib) return 'Rp 0';
    const numValue = parseFormattedNumber(formData.nominal_wajib);
    return formatIDRCurrency(numValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Edit Item Pembayaran' : 'Tambah Item Pembayaran'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama_item">Nama Item</Label>
            <Input
              type="text"
              value={formData.nama_item}
              onChange={(e) => setFormData({ ...formData, nama_item: e.target.value })}
              placeholder="Contoh: Biaya Pendaftaran, SPP, dll"
              required
            />
          </div>

          <div>
            <Label htmlFor="nominal_wajib">Nominal Wajib</Label>
            <Input
              type="text"
              value={formData.nominal_wajib}
              onChange={(e) => handleNominalChange(e.target.value)}
              placeholder="0"
              required
              className="text-right font-mono"
              maxLength={15}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Maksimal 12 digit
              </p>
              <p className="text-sm font-semibold text-green-600">
                {displayPreview()}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Deskripsi item pembayaran..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Aktif</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {editingId ? 'Update' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
