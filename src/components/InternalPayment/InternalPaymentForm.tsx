import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiswa } from '@/hooks/useSiswa';
import { useItemPembayaran } from '@/hooks/useItemPembayaran';
import { useInternalPayment, type InternalPayment } from '@/hooks/useInternalPayment';
import { formatNumberInput, parseFormattedNumber, formatIDRCurrency } from '@/lib/formatCurrency';
import { useToast } from '@/hooks/use-toast';
import { StudentPaymentPreview } from './StudentPaymentPreview';

interface InternalPaymentFormProps {
  editingPayment: InternalPayment | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export function InternalPaymentForm({ editingPayment, onSubmit, onCancel }: InternalPaymentFormProps) {
  const { siswa } = useSiswa();
  const { itemPembayaranList } = useItemPembayaran();
  const { createPayment, updatePayment, payments } = useInternalPayment();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    siswa_id: '',
    item_pembayaran_id: '',
    nominal: '',
    tanggal_pembayaran: new Date().toISOString().split('T')[0],
    metode_pembayaran: 'Tunai',
    keterangan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [calculatedRemaining, setCalculatedRemaining] = useState(0);
  const [calculatedStatus, setCalculatedStatus] = useState('Belum Lunas');

  useEffect(() => {
    if (editingPayment) {
      setFormData({
        siswa_id: editingPayment.siswa_id,
        item_pembayaran_id: editingPayment.item_pembayaran_id,
        nominal: formatNumberInput(editingPayment.nominal.toString()),
        tanggal_pembayaran: editingPayment.tanggal_pembayaran,
        metode_pembayaran: editingPayment.metode_pembayaran,
        keterangan: editingPayment.keterangan || ''
      });
      setShowPreview(true);
    }
  }, [editingPayment]);

  // Show preview when both siswa and item pembayaran are selected
  useEffect(() => {
    if (formData.siswa_id && formData.item_pembayaran_id && !editingPayment) {
      setShowPreview(true);
    }
  }, [formData.siswa_id, formData.item_pembayaran_id, editingPayment]);

  // Calculate remaining amount and status when nominal changes
  useEffect(() => {
    if (formData.siswa_id && formData.item_pembayaran_id && formData.nominal) {
      const currentNominal = parseFormattedNumber(formData.nominal);
      const existingPayments = payments.filter(p => 
        p.siswa_id === formData.siswa_id && 
        p.item_pembayaran_id === formData.item_pembayaran_id &&
        (!editingPayment || p.id !== editingPayment.id)
      );
      
      const totalExistingPaid = existingPayments.reduce((sum, payment) => sum + payment.nominal, 0);
      const obligation = existingPayments[0]?.item_pembayaran?.nominal_wajib || 
                        itemPembayaranList.find(item => item.id === formData.item_pembayaran_id)?.nominal_wajib || 0;
      
      const totalPaidIncludingCurrent = totalExistingPaid + currentNominal;
      const remaining = Math.max(0, obligation - totalPaidIncludingCurrent);
      const status = remaining === 0 ? 'Lunas' : 'Belum Lunas';
      
      setCalculatedRemaining(remaining);
      setCalculatedStatus(status);
    }
  }, [formData.nominal, formData.siswa_id, formData.item_pembayaran_id, payments, itemPembayaranList, editingPayment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siswa_id) newErrors.siswa_id = 'Siswa wajib dipilih';
    if (!formData.item_pembayaran_id) newErrors.item_pembayaran_id = 'Item pembayaran wajib dipilih';
    if (!formData.nominal) {
      newErrors.nominal = 'Jumlah pembayaran wajib diisi';
    } else {
      const nominalValue = parseFormattedNumber(formData.nominal);
      if (nominalValue <= 0) newErrors.nominal = 'Jumlah pembayaran harus lebih dari 0';
    }
    if (!formData.tanggal_pembayaran) newErrors.tanggal_pembayaran = 'Tanggal pembayaran wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !validateForm()) return;
    
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

      if (editingPayment) {
        await updatePayment(editingPayment.id, submissionData);
      } else {
        await createPayment(submissionData);
      }
      
      onSubmit();
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

  const handleSiswaChange = (value: string) => {
    setFormData({ ...formData, siswa_id: value });
    setShowPreview(false);
    if (errors.siswa_id) setErrors({ ...errors, siswa_id: '' });
  };

  const handleItemPembayaranChange = (value: string) => {
    setFormData({ ...formData, item_pembayaran_id: value });
    setShowPreview(false);
    if (errors.item_pembayaran_id) setErrors({ ...errors, item_pembayaran_id: '' });
  };

  const displayPreview = () => {
    if (!formData.nominal) return 'Rp 0';
    const numValue = parseFormattedNumber(formData.nominal);
    return formatIDRCurrency(numValue);
  };

  const availableItems = itemPembayaranList.filter(item => item.is_active);
  const selectedSiswa = siswa.find(s => s.id === formData.siswa_id);
  const studentPayments = payments.filter(p => p.siswa_id === formData.siswa_id);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{editingPayment ? 'Edit Biaya Pelatihan' : 'Tambah Biaya Pelatihan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="siswa_id">Siswa *</Label>
                <Select 
                  value={formData.siswa_id} 
                  onValueChange={handleSiswaChange}
                >
                  <SelectTrigger className={errors.siswa_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
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
                  onValueChange={handleItemPembayaranChange}
                >
                  <SelectTrigger className={errors.item_pembayaran_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih item pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nama_item} - {formatIDRCurrency(item.nominal_wajib)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.item_pembayaran_id && <p className="text-red-500 text-sm mt-1">{errors.item_pembayaran_id}</p>}
              </div>

              <div>
                <Label htmlFor="nominal">Jumlah Pembayaran *</Label>
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
                {formData.nominal && formData.siswa_id && formData.item_pembayaran_id && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    <p>Kekurangan setelah pembayaran: <span className={calculatedRemaining > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                      {formatIDRCurrency(calculatedRemaining)}
                    </span></p>
                    <p>Status: <span className={calculatedStatus === 'Lunas' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                      {calculatedStatus}
                    </span></p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="tanggal_pembayaran">Tanggal Pembayaran *</Label>
                <Input
                  type="date"
                  value={formData.tanggal_pembayaran}
                  onChange={(e) => {
                    setFormData({ ...formData, tanggal_pembayaran: e.target.value });
                    if (errors.tanggal_pembayaran) setErrors({ ...errors, tanggal_pembayaran: '' });
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
                  <SelectContent>
                    <SelectItem value="Tunai">Tunai</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
                    <SelectItem value="Kartu Debit">Kartu Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Keterangan tambahan..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : (editingPayment ? 'Perbarui' : 'Simpan')}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Batal
                </Button>
              </div>
            </form>
          </div>

          <div>
            {showPreview && selectedSiswa && formData.item_pembayaran_id && (
              <StudentPaymentPreview 
                payments={studentPayments}
                itemPembayaranId={formData.item_pembayaran_id}
                siswaName={selectedSiswa.nama}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
