
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceFormFieldsProps {
  formData: {
    nomor_invoice: string;
    kumiai_id: string;
    tanggal_invoice: string;
    tanggal_jatuh_tempo: string;
    status: string;
    keterangan: string;
  };
  kumiai: any[];
  onFormDataChange: (data: any) => void;
  onKumiaiChange: (kumiaiId: string) => void;
}

export function InvoiceFormFields({ 
  formData, 
  kumiai, 
  onFormDataChange, 
  onKumiaiChange 
}: InvoiceFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomor_invoice">Nomor Invoice</Label>
          <Input
            value={formData.nomor_invoice}
            onChange={(e) => onFormDataChange({ ...formData, nomor_invoice: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="kumiai_id">Kumiai (Pembayar)</Label>
          <Select 
            value={formData.kumiai_id} 
            onValueChange={onKumiaiChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kumiai" />
            </SelectTrigger>
            <SelectContent>
              {kumiai.map((kumiaiItem) => (
                <SelectItem key={kumiaiItem.id} value={kumiaiItem.id}>
                  {kumiaiItem.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal_invoice">Tanggal Invoice</Label>
          <Input
            type="date"
            value={formData.tanggal_invoice}
            onChange={(e) => onFormDataChange({ ...formData, tanggal_invoice: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="tanggal_jatuh_tempo">Tanggal Jatuh Tempo</Label>
          <Input
            type="date"
            value={formData.tanggal_jatuh_tempo}
            onChange={(e) => onFormDataChange({ ...formData, tanggal_jatuh_tempo: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => onFormDataChange({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          value={formData.keterangan}
          onChange={(e) => onFormDataChange({ ...formData, keterangan: e.target.value })}
          placeholder="Keterangan tambahan..."
        />
      </div>
    </>
  );
}
