
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KontakKeluargaFormFieldsProps {
  formData: {
    nama: string;
    alamat: string;
    no_hp: string;
    penghasilan_per_bulan: string;
    rt_rw: string;
    kelurahan: string;
    kecamatan: string;
    kab_kota: string;
    provinsi: string;
    kode_pos: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nama: string;
    alamat: string;
    no_hp: string;
    penghasilan_per_bulan: string;
    rt_rw: string;
    kelurahan: string;
    kecamatan: string;
    kab_kota: string;
    provinsi: string;
    kode_pos: string;
  }>>;
}

export function KontakKeluargaFormFields({ formData, setFormData }: KontakKeluargaFormFieldsProps) {
  return (
    <>
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
          <Label htmlFor="no_hp">No. HP</Label>
          <Input
            id="no_hp"
            value={formData.no_hp}
            onChange={(e) => setFormData(prev => ({...prev, no_hp: e.target.value}))}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            value={formData.alamat}
            onChange={(e) => setFormData(prev => ({...prev, alamat: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="rt_rw">RT/RW</Label>
          <Input
            id="rt_rw"
            value={formData.rt_rw}
            onChange={(e) => setFormData(prev => ({...prev, rt_rw: e.target.value}))}
            placeholder="001/002"
          />
        </div>
        <div>
          <Label htmlFor="kelurahan">Kelurahan</Label>
          <Input
            id="kelurahan"
            value={formData.kelurahan}
            onChange={(e) => setFormData(prev => ({...prev, kelurahan: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="kecamatan">Kecamatan</Label>
          <Input
            id="kecamatan"
            value={formData.kecamatan}
            onChange={(e) => setFormData(prev => ({...prev, kecamatan: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="kab_kota">Kabupaten/Kota</Label>
          <Input
            id="kab_kota"
            value={formData.kab_kota}
            onChange={(e) => setFormData(prev => ({...prev, kab_kota: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="provinsi">Provinsi</Label>
          <Input
            id="provinsi"
            value={formData.provinsi}
            onChange={(e) => setFormData(prev => ({...prev, provinsi: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="kode_pos">Kode Pos</Label>
          <Input
            id="kode_pos"
            value={formData.kode_pos}
            onChange={(e) => setFormData(prev => ({...prev, kode_pos: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="penghasilan">Penghasilan per Bulan</Label>
          <Input
            id="penghasilan"
            type="number"
            value={formData.penghasilan_per_bulan}
            onChange={(e) => setFormData(prev => ({...prev, penghasilan_per_bulan: e.target.value}))}
          />
        </div>
      </div>
    </>
  );
}
