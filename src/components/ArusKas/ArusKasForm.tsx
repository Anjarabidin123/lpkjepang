
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useArusKas } from '@/hooks/useArusKas';
import { formatNumberInput, parseFormattedNumber, formatIDRCurrency } from '@/lib/formatCurrency';
import { useToast } from '@/hooks/use-toast';

interface ArusKasFormProps {
  editingId: string | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function ArusKasForm({ editingId, onSubmit, onCancel }: ArusKasFormProps) {
  const { getArusKasById } = useArusKas();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    jenis: '',
    kategori: '',
    nominal: '',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const kategoriPemasukan = ['Pembayaran Siswa', 'Invoice Kumiai', 'Lain-lain'];
  const kategoriPengeluaran = ['Operasional', 'Gaji', 'Transportasi', 'Lain-lain'];

  useEffect(() => {
    if (editingId) {
      const loadData = async () => {
        try {
          const data = await getArusKasById(editingId);
          if (data) {
            setFormData({
              jenis: data.jenis,
              kategori: data.kategori,
              nominal: formatNumberInput(data.nominal.toString()),
              tanggal: data.tanggal,
              keterangan: data.keterangan || ''
            });
          }
        } catch (error) {
          console.error('Error loading arus kas data:', error);
          toast({
            title: "Error",
            description: "Gagal memuat data untuk edit",
            variant: "destructive",
          });
        }
      };
      loadData();
    }
  }, [editingId, getArusKasById, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jenis) {
      newErrors.jenis = 'Jenis transaksi wajib dipilih';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }

    if (!formData.nominal) {
      newErrors.nominal = 'Nominal wajib diisi';
    } else {
      const nominalValue = parseFormattedNumber(formData.nominal);
      if (nominalValue <= 0) {
        newErrors.nominal = 'Nominal harus lebih dari 0';
      }
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Harap perbaiki kesalahan pada form",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        jenis: formData.jenis,
        kategori: formData.kategori,
        nominal: parseFormattedNumber(formData.nominal),
        tanggal: formData.tanggal,
        keterangan: formData.keterangan || null
      };
      
      console.log('Submitting arus kas data:', submissionData);
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNominalChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const limitedValue = numericValue.slice(0, 12);
    
    if (limitedValue === '') {
      setFormData({ ...formData, nominal: '' });
      return;
    }
    
    const formattedValue = formatNumberInput(limitedValue);
    setFormData({ ...formData, nominal: formattedValue });
    
    // Clear error when user starts typing
    if (errors.nominal) {
      setErrors({ ...errors, nominal: '' });
    }
  };

  const handleJenisChange = (value: string) => {
    setFormData({ ...formData, jenis: value, kategori: '' });
    if (errors.jenis) {
      setErrors({ ...errors, jenis: '' });
    }
  };

  const handleKategoriChange = (value: string) => {
    setFormData({ ...formData, kategori: value });
    if (errors.kategori) {
      setErrors({ ...errors, kategori: '' });
    }
  };

  const handleTanggalChange = (value: string) => {
    setFormData({ ...formData, tanggal: value });
    if (errors.tanggal) {
      setErrors({ ...errors, tanggal: '' });
    }
  };

  const displayPreview = () => {
    if (!formData.nominal) return 'Rp 0';
    const numValue = parseFormattedNumber(formData.nominal);
    return formatIDRCurrency(numValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Edit Arus Kas' : 'Tambah Arus Kas'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="jenis">Jenis Transaksi *</Label>
            <Select value={formData.jenis} onValueChange={handleJenisChange}>
              <SelectTrigger className={errors.jenis ? 'border-red-500' : ''}>
                <SelectValue placeholder="Pilih jenis transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
            {errors.jenis && <p className="text-red-500 text-sm mt-1">{errors.jenis}</p>}
          </div>

          {formData.jenis && (
            <div>
              <Label htmlFor="kategori">Kategori *</Label>
              <Select value={formData.kategori} onValueChange={handleKategoriChange}>
                <SelectTrigger className={errors.kategori ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.jenis === 'Pemasukan' ? kategoriPemasukan : kategoriPengeluaran).map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="nominal">Nominal (Rp) *</Label>
            <Input
              type="text"
              value={formData.nominal}
              onChange={(e) => handleNominalChange(e.target.value)}
              placeholder="0"
              className={`text-right font-mono ${errors.nominal ? 'border-red-500' : ''}`}
              maxLength={15}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="text-xs text-gray-500">Maksimal 12 digit</p>
                {errors.nominal && <p className="text-red-500 text-sm">{errors.nominal}</p>}
              </div>
              <p className="text-sm font-semibold text-green-600">
                {displayPreview()}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="tanggal">Tanggal *</Label>
            <Input
              type="date"
              value={formData.tanggal}
              onChange={(e) => handleTanggalChange(e.target.value)}
              className={errors.tanggal ? 'border-red-500' : ''}
            />
            {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
          </div>

          <div>
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              placeholder="Keterangan tambahan..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
