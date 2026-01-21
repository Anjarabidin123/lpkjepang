
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useSiswaMagang } from '@/hooks/useSiswaMagang';

interface InvoiceItem {
  siswa_magang_id: string;
  nominal_fee: number;
  keterangan?: string;
}

interface InvoiceItemsManagerProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
  kumiaiId?: string;
}

export function InvoiceItemsManager({ items, onChange, kumiaiId }: InvoiceItemsManagerProps) {
  const { siswaMagang } = useSiswaMagang();

  // Filter siswa magang berdasarkan kumiai yang dipilih
  const availableSiswaMagang = kumiaiId 
    ? siswaMagang.filter(sm => sm.kumiai_id === kumiaiId)
    : siswaMagang;

  const addItem = () => {
    onChange([...items, { siswa_magang_id: '', nominal_fee: 0, keterangan: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleNominalChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const nominalValue = parseFloat(numericValue) || 0;
    updateItem(index, 'nominal_fee', nominalValue);
  };

  const getTotalNominal = () => {
    return items.reduce((total, item) => total + (item.nominal_fee || 0), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Daftar Siswa Magang & Fee</Label>
        <Button type="button" onClick={addItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-3">
              <div>
                <Label htmlFor={`siswa-${index}`}>Siswa Magang</Label>
                <Select
                  value={item.siswa_magang_id}
                  onValueChange={(value) => updateItem(index, 'siswa_magang_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih siswa magang" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSiswaMagang.map((siswa) => (
                      <SelectItem key={siswa.id} value={siswa.id}>
                        {siswa.siswa?.nama || 'N/A'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`nominal-${index}`}>Nominal Fee (Rp)</Label>
                <Input
                  type="text"
                  value={new Intl.NumberFormat('id-ID').format(item.nominal_fee || 0)}
                  onChange={(e) => handleNominalChange(index, e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor={`keterangan-${index}`}>Keterangan</Label>
                <Input
                  type="text"
                  value={item.keterangan || ''}
                  onChange={(e) => updateItem(index, 'keterangan', e.target.value)}
                  placeholder="Keterangan fee..."
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-700 ml-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada siswa magang yang ditambahkan.
          <br />
          Klik "Tambah Siswa" untuk menambahkan siswa magang.
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Nominal:</span>
            <span className="text-blue-600">{formatCurrency(getTotalNominal())}</span>
          </div>
        </div>
      )}
    </div>
  );
}
