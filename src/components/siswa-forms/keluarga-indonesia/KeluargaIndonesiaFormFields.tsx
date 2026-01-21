
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const hubunganOptions = [
  'Ayah', 'Ibu', 'Suami', 'Istri', 'Anak', 'Kakak', 'Adik', 
  'Kakek', 'Nenek', 'Paman', 'Bibi', 'Sepupu', 'Keponakan', 'Lainnya'
] as const;

type HubunganType = typeof hubunganOptions[number];

interface KeluargaIndonesiaFormFieldsProps {
  formData: {
    nama: string;
    umur: string;
    hubungan: HubunganType | '';
    pekerjaan: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nama: string;
    umur: string;
    hubungan: HubunganType | '';
    pekerjaan: string;
  }>>;
}

export function KeluargaIndonesiaFormFields({ formData, setFormData }: KeluargaIndonesiaFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <Label htmlFor="nama">Nama *</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) => setFormData(prev => ({...prev, nama: e.target.value}))}
          required
        />
      </div>
      <div>
        <Label htmlFor="hubungan">Hubungan</Label>
        <Select
          value={formData.hubungan}
          onValueChange={(value: HubunganType) => setFormData(prev => ({...prev, hubungan: value}))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih hubungan" />
          </SelectTrigger>
          <SelectContent>
            {hubunganOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="umur">Umur</Label>
        <Input
          id="umur"
          type="number"
          value={formData.umur}
          onChange={(e) => setFormData(prev => ({...prev, umur: e.target.value}))}
        />
      </div>
      <div>
        <Label htmlFor="pekerjaan">Pekerjaan</Label>
        <Input
          id="pekerjaan"
          value={formData.pekerjaan}
          onChange={(e) => setFormData(prev => ({...prev, pekerjaan: e.target.value}))}
        />
      </div>
    </div>
  );
}
