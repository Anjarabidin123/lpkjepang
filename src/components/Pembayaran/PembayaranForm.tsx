
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiswa } from '@/hooks/useSiswa';
import { usePembayaranSimplified } from '@/hooks/usePembayaranSimplified';
import { useItemPembayaran } from '@/hooks/useItemPembayaran';
import { useKewajibanPembayaran } from '@/hooks/useKewajibanPembayaran';
import { formatNumberInput, parseFormattedNumber, formatIDRCurrency } from '@/lib/formatCurrency';
import { KewajibanPembayaranCard } from './KewajibanPembayaranCard';
import { PembayaranFormValidation } from './PembayaranFormValidation';
import { useToast } from '@/hooks/use-toast';

interface PembayaranFormProps {
  editingId: string | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function PembayaranForm({ editingId, onSubmit, onCancel }: PembayaranFormProps) {
  const { siswa } = useSiswa();
  const { getPembayaranById } = usePembayaranSimplified();
  const { itemPembayaranList } = useItemPembayaran();
  const { getKewajibanBySiswa } = useKewajibanPembayaran();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    siswa_id: '',
    item_pembayaran_id: '',
    nominal: '',
    tanggal_pembayaran: new Date().toISOString().split('T')[0],
    metode_pembayaran: 'Tunai',
    keterangan: ''
  });

  const [kewajibanSiswa, setKewajibanSiswa] = useState<any[]>([]);
  const [selectedKewajiban, setSelectedKewajiban] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingId) {
      const loadData = async () => {
        try {
          console.log('Loading pembayaran data for edit, ID:', editingId);
          const data = await getPembayaranById(editingId);
          if (data) {
            console.log('Loaded pembayaran data:', data);
            setFormData({
              siswa_id: data.siswa_id,
              item_pembayaran_id: data.item_pembayaran_id || '',
              nominal: formatNumberInput(data.nominal.toString()),
              tanggal_pembayaran: data.tanggal_pembayaran,
              metode_pembayaran: data.metode_pembayaran,
              keterangan: data.keterangan || ''
            });
          }
        } catch (error) {
          console.error('Error loading pembayaran data:', error);
          toast({
            title: "Error",
            description: "Gagal memuat data untuk edit",
            variant: "destructive",
          });
        }
      };
      loadData();
    }
  }, [editingId, getPembayaranById, toast]);

  useEffect(() => {
    if (formData.siswa_id) {
      const loadKewajiban = async () => {
        try {
          console.log('Loading kewajiban for siswa:', formData.siswa_id);
          const kewajiban = await getKewajibanBySiswa(formData.siswa_id);
          console.log('Loaded kewajiban:', kewajiban);
          setKewajibanSiswa(kewajiban);
        } catch (error) {
          console.error('Error loading kewajiban:', error);
        }
      };
      loadKewajiban();
    } else {
      setKewajibanSiswa([]);
    }
  }, [formData.siswa_id, getKewajibanBySiswa]);

  useEffect(() => {
    if (formData.item_pembayaran_id) {
      const kewajiban = kewajibanSiswa.find(k => k.item_pembayaran_id === formData.item_pembayaran_id);
      console.log('Selected kewajiban:', kewajiban);
      setSelectedKewajiban(kewajiban);
    } else {
      setSelectedKewajiban(null);
    }
  }, [formData.item_pembayaran_id, kewajibanSiswa]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siswa_id) {
      newErrors.siswa_id = 'Siswa wajib dipilih';
    }

    if (!formData.item_pembayaran_id) {
      newErrors.item_pembayaran_id = 'Item pembayaran wajib dipilih';
    }

    if (!formData.nominal) {
      newErrors.nominal = 'Nominal wajib diisi';
    } else {
      const nominalValue = parseFormattedNumber(formData.nominal);
      if (nominalValue <= 0) {
        newErrors.nominal = 'Nominal harus lebih dari 0';
      }
    }

    if (!formData.tanggal_pembayaran) {
      newErrors.tanggal_pembayaran = 'Tanggal pembayaran wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('Form submit triggered');
    
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
        siswa_id: formData.siswa_id,
        item_pembayaran_id: formData.item_pembayaran_id,
        nominal: parseFormattedNumber(formData.nominal),
        tanggal_pembayaran: formData.tanggal_pembayaran,
        metode_pembayaran: formData.metode_pembayaran,
        keterangan: formData.keterangan || null
      };

      console.log('Submitting form data:', submissionData);
      await onSubmit(submissionData);
      console.log('Form submission successful');
    } catch (error) {
      console.error('Error in form submission:', error);
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
    
    if (errors.nominal) {
      setErrors({ ...errors, nominal: '' });
    }
  };

  const displayPreview = () => {
    if (!formData.nominal) return 'Rp 0';
    const numValue = parseFormattedNumber(formData.nominal);
    return formatIDRCurrency(numValue);
  };

  const availableItems = itemPembayaranList.filter(item => item.is_active);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siswa_id">Siswa *</Label>
                <Select 
                  value={formData.siswa_id} 
                  onValueChange={(value) => {
                    console.log('Siswa selected:', value);
                    setFormData({ ...formData, siswa_id: value, item_pembayaran_id: '' });
                    if (errors.siswa_id) {
                      setErrors({ ...errors, siswa_id: '' });
                    }
                  }}
                >
                  <SelectTrigger className={errors.siswa_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {siswa.map((siswaItem) => (
                      <SelectItem key={siswaItem.id} value={siswaItem.id}>
                        {siswaItem.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.siswa_id && <p className="text-red-500 text-sm mt-1">{errors.siswa_id}</p>}
              </div>

              <div>
                <Label htmlFor="item_pembayaran_id">Item Pembayaran *</Label>
                <Select 
                  value={formData.item_pembayaran_id} 
                  onValueChange={(value) => {
                    console.log('Item pembayaran selected:', value);
                    setFormData({ ...formData, item_pembayaran_id: value });
                    if (errors.item_pembayaran_id) {
                      setErrors({ ...errors, item_pembayaran_id: '' });
                    }
                  }}
                >
                  <SelectTrigger className={errors.item_pembayaran_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih item pembayaran" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nama_item} - {formatIDRCurrency(item.nominal_wajib)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.item_pembayaran_id && <p className="text-red-500 text-sm mt-1">{errors.item_pembayaran_id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tanggal_pembayaran">Tanggal Transaksi *</Label>
                <Input
                  type="date"
                  value={formData.tanggal_pembayaran}
                  onChange={(e) => {
                    setFormData({ ...formData, tanggal_pembayaran: e.target.value });
                    if (errors.tanggal_pembayaran) {
                      setErrors({ ...errors, tanggal_pembayaran: '' });
                    }
                  }}
                  className={errors.tanggal_pembayaran ? 'border-red-500' : ''}
                />
                {errors.tanggal_pembayaran && <p className="text-red-500 text-sm mt-1">{errors.tanggal_pembayaran}</p>}
              </div>

              <div>
                <Label htmlFor="metode_pembayaran">Metode Pembayaran</Label>
                <Select value={formData.metode_pembayaran} onValueChange={(value) => setFormData({ ...formData, metode_pembayaran: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
                    <SelectItem value="Kartu Debit">Kartu Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="nominal">Nominal Pembayaran *</Label>
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
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Keterangan tambahan..."
              />
            </div>

            {/* Payment Validation Component */}
            <PembayaranFormValidation
              selectedKewajiban={selectedKewajiban}
              nominalInput={formData.nominal}
              errors={errors}
            />

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

      {/* Kewajiban Information */}
      {formData.siswa_id && kewajibanSiswa.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kewajiban Pembayaran Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kewajibanSiswa.map((kewajiban) => (
                <KewajibanPembayaranCard key={kewajiban.id} kewajiban={kewajiban} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedKewajiban && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Info Pembayaran Terpilih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Item:</p>
                <p className="font-bold text-blue-600">{selectedKewajiban.item_pembayaran?.nama_item}</p>
              </div>
              <div>
                <p className="text-gray-600">Sisa Kewajiban:</p>
                <p className="font-bold text-red-600">{formatIDRCurrency(selectedKewajiban.sisa_kewajiban)}</p>
              </div>
              <div>
                <p className="text-gray-600">Sudah Dibayar:</p>
                <p className="font-bold text-green-600">{formatIDRCurrency(selectedKewajiban.nominal_terbayar)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!formData.siswa_id && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <p>Pilih siswa untuk melihat kewajiban pembayaran</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
