
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  nama_job_order: string;
  kumiai_id: string | undefined;
  jenis_kerja_id: string | undefined;
  catatan: string;
  status: 'Aktif' | 'Nonaktif';
  kuota?: number;
}

interface JobOrderFormFieldsProps {
  formData: FormData;
  formErrors: Record<string, string>;
  isLoading: boolean;
  kumiai: any[];
  jenisKerja: any[];
  onFieldChange: (field: string, value: any) => void;
}

export function JobOrderFormFields({ 
  formData, 
  formErrors, 
  isLoading, 
  kumiai, 
  jenisKerja, 
  onFieldChange 
}: JobOrderFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Job Order *
          </label>
          <Input
            placeholder="Masukkan nama job order"
            value={formData.nama_job_order}
            onChange={(e) => onFieldChange('nama_job_order', e.target.value)}
            onFocus={() => onFieldChange('clearError', 'nama_job_order')}
            disabled={isLoading}
            className={formErrors.nama_job_order ? 'border-red-500' : ''}
          />
          {formErrors.nama_job_order && (
            <p className="text-red-500 text-xs mt-1">{formErrors.nama_job_order}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kuota Peserta
          </label>
          <Input
            type="number"
            placeholder="Masukkan kuota peserta"
            value={formData.kuota || ''}
            onChange={(e) => onFieldChange('kuota', e.target.value ? parseInt(e.target.value) : null)}
            disabled={isLoading}
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kumiai
          </label>
          <Select
            value={formData.kumiai_id || ''}
            onValueChange={(value) => onFieldChange('kumiai_id', value || undefined)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kumiai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tidak ada</SelectItem>
              {kumiai?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kerja
          </label>
          <Select
            value={formData.jenis_kerja_id || ''}
            onValueChange={(value) => onFieldChange('jenis_kerja_id', value || undefined)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kerja" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tidak ada</SelectItem>
              {jenisKerja?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => onFieldChange('status', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan
          </label>
          <Textarea
            placeholder="Masukkan catatan (opsional)"
            value={formData.catatan}
            onChange={(e) => onFieldChange('catatan', e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
