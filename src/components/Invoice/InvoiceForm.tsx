
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useKumiai } from '@/hooks/useKumiai';
import { useInvoice } from '@/hooks/useInvoice';
import { useInvoiceSettings } from '@/hooks/useInvoiceSettings';
import { useSiswaMagang } from '@/hooks/useSiswaMagang';
import { InvoiceFormHeader } from './InvoiceFormHeader';
import { InvoiceFormFields } from './InvoiceFormFields';
import { InvoiceFormSettings } from './InvoiceFormSettings';
import { InvoiceFormStudentSelection } from './InvoiceFormStudentSelection';
import { InvoiceFormSummary } from './InvoiceFormSummary';

interface InvoiceFormProps {
  editingId: string | null;
  initialData?: any;
  onSubmit: (data: any, items: any[]) => Promise<void>;
  onCancel: () => void;
}

interface InvoiceItem {
  siswa_magang_id: string;
  nominal_fee: number;
  keterangan?: string;
}

export function InvoiceForm({ editingId, initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const { kumiai } = useKumiai();
  const { getInvoiceById } = useInvoice();
  const { getSettingByKumiai } = useInvoiceSettings();
  const { siswaMagang } = useSiswaMagang();
  
  const [formData, setFormData] = useState({
    kumiai_id: '',
    nomor_invoice: '',
    nominal: 0,
    tanggal_invoice: new Date().toISOString().split('T')[0],
    tanggal_jatuh_tempo: '',
    keterangan: '',
    status: 'Pending'
  });

  const [selectedSiswa, setSelectedSiswa] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Filter siswa magang berdasarkan kumiai yang dipilih
  const filteredSiswaMagang = siswaMagang.filter(sm => 
    sm.kumiai_id === formData.kumiai_id && sm.status_magang === 'Aktif'
  );

  // Calculate total nominal automatically
  useEffect(() => {
    if (formData.kumiai_id && selectedSiswa.length > 0 && selectedMonths.length > 0) {
      const setting = getSettingByKumiai(formData.kumiai_id);
      if (setting) {
        const totalNominal = setting.nominal_base * selectedSiswa.length * selectedMonths.length;
        setFormData(prev => ({ ...prev, nominal: totalNominal }));
      }
    } else {
      setFormData(prev => ({ ...prev, nominal: 0 }));
    }
  }, [formData.kumiai_id, selectedSiswa.length, selectedMonths.length, getSettingByKumiai]);

  useEffect(() => {
    if (!editingId) {
      // Generate invoice number for new invoice
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({ 
        ...prev, 
        nomor_invoice: `INV-${year}${month}-${random}` 
      }));
    }
  }, [editingId]);

  useEffect(() => {
    if (editingId && initialData) {
      // Use initialData if provided, otherwise fetch from API
      setFormData({
        kumiai_id: initialData.kumiai_id,
        nomor_invoice: initialData.nomor_invoice,
        nominal: initialData.nominal,
        tanggal_invoice: initialData.tanggal_invoice,
        tanggal_jatuh_tempo: initialData.tanggal_jatuh_tempo || '',
        keterangan: initialData.keterangan || '',
        status: initialData.status
      });

      // Load selected siswa from invoice items
      if (initialData.invoice_items && initialData.invoice_items.length > 0) {
        const siswaIds = initialData.invoice_items.map((item: any) => item.siswa_magang_id);
        setSelectedSiswa(siswaIds);
      }
    } else if (editingId) {
      const loadData = async () => {
        const data = await getInvoiceById(editingId);
        if (data) {
          setFormData({
            kumiai_id: data.kumiai_id,
            nomor_invoice: data.nomor_invoice,
            nominal: data.nominal,
            tanggal_invoice: data.tanggal_invoice,
            tanggal_jatuh_tempo: data.tanggal_jatuh_tempo || '',
            keterangan: data.keterangan || '',
            status: data.status
          });

          // Load selected siswa from invoice items
          if (data.invoice_items && data.invoice_items.length > 0) {
            const siswaIds = data.invoice_items.map((item: any) => item.siswa_magang_id);
            setSelectedSiswa(siswaIds);
          }
        }
      };
      loadData();
    }
  }, [editingId, initialData, getInvoiceById]);

  const handleKumiaiChange = (kumiaiId: string) => {
    setFormData({ ...formData, kumiai_id: kumiaiId });
    setSelectedSiswa([]);
    setSelectedMonths([]);
  };

  const handleSiswaChange = (siswaId: string, checked: boolean) => {
    if (checked) {
      setSelectedSiswa(prev => [...prev, siswaId]);
    } else {
      setSelectedSiswa(prev => prev.filter(id => id !== siswaId));
    }
  };

  const handleMonthChange = (month: string, checked: boolean) => {
    if (checked) {
      setSelectedMonths(prev => [...prev, month]);
    } else {
      setSelectedMonths(prev => prev.filter(m => m !== month));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSiswa.length === 0) {
      alert('Pilih minimal satu siswa magang');
      return;
    }

    if (!editingId && selectedMonths.length === 0) {
      alert('Pilih minimal satu bulan');
      return;
    }

    const setting = getSettingByKumiai(formData.kumiai_id);
    const nominalPerSiswa = setting ? setting.nominal_base * selectedMonths.length : 0;

    // Create invoice items
    const invoiceItems: InvoiceItem[] = selectedSiswa.map(siswaId => ({
      siswa_magang_id: siswaId,
      nominal_fee: nominalPerSiswa,
      keterangan: `${setting?.item_pembayaran || 'Management Fee'} - ${selectedMonths.length} bulan (${selectedYear})`
    }));

    await onSubmit({
      ...formData,
      tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo || null
    }, invoiceItems);
  };

  const selectedSetting = getSettingByKumiai(formData.kumiai_id);

  return (
    <Card>
      <InvoiceFormHeader editingId={editingId} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InvoiceFormFields
            formData={formData}
            kumiai={kumiai}
            onFormDataChange={setFormData}
            onKumiaiChange={handleKumiaiChange}
          />

          <InvoiceFormSettings selectedSetting={selectedSetting} />

          {formData.kumiai_id && (
            <InvoiceFormStudentSelection
              editingId={editingId}
              filteredSiswaMagang={filteredSiswaMagang}
              selectedSiswa={selectedSiswa}
              selectedMonths={selectedMonths}
              selectedYear={selectedYear}
              onSiswaChange={handleSiswaChange}
              onMonthChange={handleMonthChange}
              onYearChange={setSelectedYear}
            />
          )}

          <InvoiceFormSummary
            nominal={formData.nominal}
            selectedSetting={selectedSetting}
            selectedSiswaCount={selectedSiswa.length}
            selectedMonthsCount={selectedMonths.length}
          />

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
