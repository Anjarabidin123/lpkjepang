
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormActions } from './FormActions';
import { Kumiai } from '@/hooks/useKumiai';

interface KumiaiFormProps {
  kumiai?: Kumiai;
  onSave: (data: Omit<Kumiai, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function KumiaiForm({ kumiai, onSave, onCancel, isLoading }: KumiaiFormProps) {
  const [formData, setFormData] = useState({
    nama: '',
    kode: '',
    alamat: '',
    telepon: '',
    email: '',
    pic_nama: '',
    pic_telepon: '',
    jumlah_perusahaan: 0,
    tanggal_kerjasama: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (kumiai) {
      console.log('Loading kumiai data into form:', kumiai);
      setFormData({
        nama: kumiai.nama || '',
        kode: kumiai.kode || '',
        alamat: kumiai.alamat || '',
        telepon: kumiai.telepon || '',
        email: kumiai.email || '',
        pic_nama: kumiai.pic_nama || '',
        pic_telepon: kumiai.pic_telepon || '',
        jumlah_perusahaan: kumiai.jumlah_perusahaan || 0,
        tanggal_kerjasama: kumiai.tanggal_kerjasama || new Date().toISOString().split('T')[0]
      });
    } else {
      // Reset form for new entry
      setFormData({
        nama: '',
        kode: '',
        alamat: '',
        telepon: '',
        email: '',
        pic_nama: '',
        pic_telepon: '',
        jumlah_perusahaan: 0,
        tanggal_kerjasama: new Date().toISOString().split('T')[0]
      });
    }
  }, [kumiai]);

  const handleSubmit = () => {
    console.log('Submitting form data:', formData);
    if (!formData.nama || !formData.kode) {
      console.error('Form validation failed: missing required fields');
      return;
    }

    // Add the required timestamp fields
    const submitData = {
      ...formData,
      created_at: kumiai?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      perusahaan: kumiai?.perusahaan || []
    };

    onSave(submitData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nama">Nama Kumiai *</Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => handleInputChange('nama', e.target.value)}
            placeholder="Masukkan nama kumiai"
          />
        </div>
        <div>
          <Label htmlFor="kode">Kode *</Label>
          <Input
            id="kode"
            value={formData.kode}
            onChange={(e) => handleInputChange('kode', e.target.value)}
            placeholder="Masukkan kode kumiai"
          />
        </div>
        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            value={formData.alamat}
            onChange={(e) => handleInputChange('alamat', e.target.value)}
            placeholder="Masukkan alamat"
          />
        </div>
        <div>
          <Label htmlFor="telepon">Telepon</Label>
          <Input
            id="telepon"
            value={formData.telepon}
            onChange={(e) => handleInputChange('telepon', e.target.value)}
            placeholder="Masukkan nomor telepon"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Masukkan email"
          />
        </div>
        <div>
          <Label htmlFor="pic_nama">Nama PIC</Label>
          <Input
            id="pic_nama"
            value={formData.pic_nama}
            onChange={(e) => handleInputChange('pic_nama', e.target.value)}
            placeholder="Masukkan nama PIC"
          />
        </div>
        <div>
          <Label htmlFor="pic_telepon">Telepon PIC</Label>
          <Input
            id="pic_telepon"
            value={formData.pic_telepon}
            onChange={(e) => handleInputChange('pic_telepon', e.target.value)}
            placeholder="Masukkan telepon PIC"
          />
        </div>
        <div>
          <Label htmlFor="jumlah_perusahaan">Jumlah Perusahaan</Label>
          <Input
            id="jumlah_perusahaan"
            type="number"
            value={formData.jumlah_perusahaan}
            onChange={(e) => handleInputChange('jumlah_perusahaan', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="tanggal_kerjasama">Tanggal Kerjasama</Label>
          <Input
            id="tanggal_kerjasama"
            type="date"
            value={formData.tanggal_kerjasama}
            onChange={(e) => handleInputChange('tanggal_kerjasama', e.target.value)}
          />
        </div>
      </div>
      <FormActions 
        onSave={handleSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
