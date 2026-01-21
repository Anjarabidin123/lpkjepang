
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LpkMitra, CreateLpkMitraData, UpdateLpkMitraData } from '@/types/lpkMitra';

interface LpkMitraFormProps {
  lpkMitra?: LpkMitra;
  onSave: (data: CreateLpkMitraData | UpdateLpkMitraData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LpkMitraForm({ lpkMitra, onSave, onCancel, isLoading }: LpkMitraFormProps) {
  const [formData, setFormData] = useState({
    kode: lpkMitra?.kode || '',
    nama_lpk: lpkMitra?.nama_lpk || '',
    pic_nama: lpkMitra?.pic_nama || '',
    email: lpkMitra?.email || '',
    phone: lpkMitra?.phone || '',
    alamat: lpkMitra?.alamat || '',
    status: lpkMitra?.status || 'Aktif' as 'Aktif' | 'Nonaktif',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kode">Kode *</Label>
          <Input
            id="kode"
            value={formData.kode}
            onChange={(e) => handleChange('kode', e.target.value)}
            placeholder="Masukkan kode LPK"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nama_lpk">Nama LPK *</Label>
          <Input
            id="nama_lpk"
            value={formData.nama_lpk}
            onChange={(e) => handleChange('nama_lpk', e.target.value)}
            placeholder="Masukkan nama LPK"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pic_nama">PIC</Label>
          <Input
            id="pic_nama"
            value={formData.pic_nama}
            onChange={(e) => handleChange('pic_nama', e.target.value)}
            placeholder="Masukkan nama PIC"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Masukkan email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Masukkan nomor telepon"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Textarea
          id="alamat"
          value={formData.alamat}
          onChange={(e) => handleChange('alamat', e.target.value)}
          placeholder="Masukkan alamat lengkap"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
