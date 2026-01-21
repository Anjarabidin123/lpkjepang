
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const jenjangOptions = [
  'SD', 'SMP', 'SMA', 'SMK', 'D3', 'D4', 'S1', 'S2', 'S3'
] as const;

interface PendidikanFormFieldsProps {
  formData: {
    jenjang_pendidikan: string;
    nama_institusi: string;
    jurusan: string;
    tahun_masuk: string;
    tahun_lulus: string;
    nilai_akhir: string;
    sertifikat_url: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    jenjang_pendidikan: string;
    nama_institusi: string;
    jurusan: string;
    tahun_masuk: string;
    tahun_lulus: string;
    nilai_akhir: string;
    sertifikat_url: string;
  }>>;
}

export function PendidikanFormFields({ formData, setFormData }: PendidikanFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="jenjang">Jenjang Pendidikan *</Label>
          <Select
            value={formData.jenjang_pendidikan}
            onValueChange={(value) => setFormData(prev => ({...prev, jenjang_pendidikan: value}))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenjang" />
            </SelectTrigger>
            <SelectContent>
              {jenjangOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="institusi">Nama Institusi *</Label>
          <Input
            id="institusi"
            value={formData.nama_institusi}
            onChange={(e) => setFormData(prev => ({...prev, nama_institusi: e.target.value}))}
            required
          />
        </div>
        <div>
          <Label htmlFor="jurusan">Jurusan</Label>
          <Input
            id="jurusan"
            value={formData.jurusan}
            onChange={(e) => setFormData(prev => ({...prev, jurusan: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="tahun_masuk">Tahun Masuk</Label>
          <Input
            id="tahun_masuk"
            type="number"
            value={formData.tahun_masuk}
            onChange={(e) => setFormData(prev => ({...prev, tahun_masuk: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="tahun_lulus">Tahun Lulus</Label>
          <Input
            id="tahun_lulus"
            type="number"
            value={formData.tahun_lulus}
            onChange={(e) => setFormData(prev => ({...prev, tahun_lulus: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="nilai">Nilai Akhir</Label>
          <Input
            id="nilai"
            value={formData.nilai_akhir}
            onChange={(e) => setFormData(prev => ({...prev, nilai_akhir: e.target.value}))}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="sertifikat">URL Sertifikat</Label>
        <Input
          id="sertifikat"
          type="url"
          value={formData.sertifikat_url}
          onChange={(e) => setFormData(prev => ({...prev, sertifikat_url: e.target.value}))}
        />
      </div>
    </>
  );
}
