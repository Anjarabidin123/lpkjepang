import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectWithPlaceholder } from "@/components/ui/select-with-placeholder";
import { X, Save, Loader2 } from "lucide-react";
import { useSiswa, type Siswa } from "@/hooks/useSiswa";
import { useLpkMitra } from "@/hooks/useLpkMitra";
import { useProgram } from "@/hooks/useProgram";
import { usePosisiKerja } from "@/hooks/usePosisiKerja";
import { LocationSelector } from "@/components/LocationSelector/LocationSelector";
import { SiswaPhotoUpload } from "@/components/Siswa/SiswaPhotoUpload";
import { calculateAge } from "@/utils/ageCalculator";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';

interface SiswaFormProps {
  siswa?: Siswa;
  onCancel: () => void;
  onSave: () => void;
}

type SiswaFormData = {
  nama: string;
  nik: string;
  tanggal_lahir?: string;
  tempat_lahir?: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  foto_siswa?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  tinggi_badan?: number;
  berat_badan?: number;
  ukuran_sepatu?: number;
  golongan_darah?: string;
  status_pernikahan?: string;
  agama?: string;
  hobi?: string;
  visi?: string;
  target_gaji?: string;
  pengalaman_jepang?: string;
  skill_bahasa_jepang?: string;
  program_id?: string;
  posisi_kerja_id?: string;
  lpk_mitra_id?: string;
  tanggal_daftar?: string;
  foto_url?: string;
  nama_sekolah?: string;
  tahun_masuk_sekolah?: number;
  tahun_lulus_sekolah?: number;
  jurusan?: string;
  umur?: number;
  mata_kanan?: string;
  mata_kiri?: string;
  ukuran_kepala?: number;
  ukuran_pinggang?: number;
  merokok_sekarang?: string;
  merokok_jepang?: string;
  minum_sake?: string;
  penggunaan_tangan?: string;
  buta_warna?: boolean;
  warna_buta?: string;
  bakat_khusus?: string;
  kelebihan?: string;
  kekurangan?: string;
  pengalaman?: string;
  minat?: string;
  tujuan_jepang?: string;
  target_menabung?: string;
  tanggal_masuk_lpk?: string;
  lama_belajar?: string;
  catatan?: string;
  is_available?: boolean;
  demografi_province_id?: string;
  demografi_regency_id?: string;
};

export default function SiswaForm({ siswa, onCancel, onSave }: SiswaFormProps) {
  const { createSiswa, updateSiswa, isCreating, isUpdating } = useSiswa();
  const { lpkMitras, isLoading: isLoadingLpkMitra } = useLpkMitra();
  const { program, isLoading: isLoadingPrograms } = useProgram();
  const { posisiKerja, isLoading: isLoadingPosisiKerja } = usePosisiKerja();

  const form = useForm<SiswaFormData>({
    defaultValues: {
      nama: siswa?.nama || '',
      nik: siswa?.nik || '',
      tanggal_lahir: siswa?.tanggal_lahir || '',
      tempat_lahir: siswa?.tempat_lahir || '',
      jenis_kelamin: siswa?.jenis_kelamin || undefined,
      foto_siswa: siswa?.foto_siswa || '',
      alamat: siswa?.alamat || '',
      telepon: siswa?.telepon || '',
      email: siswa?.email || '',
      tinggi_badan: siswa?.tinggi_badan || undefined,
      berat_badan: siswa?.berat_badan || undefined,
      ukuran_sepatu: siswa?.ukuran_sepatu || undefined,
      golongan_darah: siswa?.golongan_darah || '',
      status_pernikahan: siswa?.status_pernikahan || 'Belum Menikah',
      agama: siswa?.agama || '',
      hobi: siswa?.hobi || '',
      visi: siswa?.visi || '',
      target_gaji: siswa?.target_gaji || '',
      pengalaman_jepang: siswa?.pengalaman_jepang || '',
      skill_bahasa_jepang: siswa?.skill_bahasa_jepang || '',
      program_id: siswa?.program_id || '',
      posisi_kerja_id: siswa?.posisi_kerja_id || '',
      lpk_mitra_id: siswa?.lpk_mitra_id || '',
      tanggal_daftar: siswa?.tanggal_daftar || '',
      foto_url: siswa?.foto_url || '',
      nama_sekolah: siswa?.nama_sekolah || '',
      tahun_masuk_sekolah: siswa?.tahun_masuk_sekolah || undefined,
      tahun_lulus_sekolah: siswa?.tahun_lulus_sekolah || undefined,
      jurusan: siswa?.jurusan || '',
      umur: siswa?.umur || undefined,
      mata_kanan: siswa?.mata_kanan || '',
      mata_kiri: siswa?.mata_kiri || '',
      ukuran_kepala: siswa?.ukuran_kepala || undefined,
      ukuran_pinggang: siswa?.ukuran_pinggang || undefined,
      merokok_sekarang: siswa?.merokok_sekarang || '',
      merokok_jepang: siswa?.merokok_jepang || '',
      minum_sake: siswa?.minum_sake || '',
      penggunaan_tangan: siswa?.penggunaan_tangan || 'Kanan',
      buta_warna: siswa?.buta_warna || false,
      warna_buta: siswa?.warna_buta || '',
      bakat_khusus: siswa?.bakat_khusus || '',
      kelebihan: siswa?.kelebihan || '',
      kekurangan: siswa?.kekurangan || '',
      pengalaman: siswa?.pengalaman || '',
      minat: siswa?.minat || '',
      tujuan_jepang: siswa?.tujuan_jepang || '',
      target_menabung: siswa?.target_menabung || '',
      tanggal_masuk_lpk: siswa?.tanggal_masuk_lpk || '',
      lama_belajar: siswa?.lama_belajar || '',
      catatan: siswa?.catatan || '',
      is_available: siswa?.is_available !== undefined ? siswa.is_available : true,
      demografi_province_id: siswa?.demografi_province_id || '',
      demografi_regency_id: siswa?.demografi_regency_id || '',
    }
  });

  // Auto-calculate age when birth date changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'tanggal_lahir' && value.tanggal_lahir) {
        const age = calculateAge(value.tanggal_lahir);
        if (age !== null) {
          form.setValue('umur', age);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: SiswaFormData) => {
    if (!data.nama || !data.nik) {
      toast.error('Nama dan NIK wajib diisi');
      return;
    }

    try {
      // Auto-calculate age if birth date is provided but age is not
      let finalAge = data.umur;
      if (!finalAge && data.tanggal_lahir) {
        finalAge = calculateAge(data.tanggal_lahir) || undefined;
      }

      const submitData = {
        ...data,
        umur: finalAge,
        tinggi_badan: data.tinggi_badan || null,
        ukuran_kepala: data.ukuran_kepala || null,
        ukuran_pinggang: data.ukuran_pinggang || null,
        program_id: data.program_id || null,
        posisi_kerja_id: data.posisi_kerja_id || null,
        lpk_mitra_id: data.lpk_mitra_id || null,
        demografi_province_id: data.demografi_province_id || null,
        demografi_regency_id: data.demografi_regency_id || null,
        tanggal_daftar: data.tanggal_daftar || new Date().toISOString().split('T')[0],
        jenis_kelamin: data.jenis_kelamin as 'Laki-laki' | 'Perempuan' | null,
        // Standardize photo field - use foto_siswa as primary  
        foto_siswa: data.foto_siswa || data.foto_url || null,
        foto_url: data.foto_siswa || data.foto_url || null,
      };

      console.log('Submitting siswa data:', submitData);

      if (siswa) {
        await updateSiswa({ id: siswa.id, ...submitData });
        toast.success('Siswa berhasil diperbarui');
      } else {
        await createSiswa(submitData);
        toast.success('Siswa berhasil ditambahkan');
      }

      onSave();
    } catch (error) {
      console.error('Error saving siswa:', error);
      toast.error('Terjadi kesalahan saat menyimpan data siswa');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{siswa ? 'Edit Siswa' : 'Tambah Siswa Baru'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <SiswaPhotoUpload
                  value={form.watch('foto_siswa') || form.watch('foto_url')}
                  onChange={(url) => {
                    form.setValue('foto_siswa', url);
                    form.setValue('foto_url', url);
                  }}
                  label="Foto Siswa"
                />
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    {...form.register("nama", { required: "Nama wajib diisi" })}
                    placeholder="Masukkan nama lengkap"
                    className={form.formState.errors.nama ? "border-red-500" : ""}
                  />
                  {form.formState.errors.nama && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nama.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    {...form.register("nik", { required: "NIK wajib diisi" })}
                    placeholder="Masukkan NIK"
                    className={form.formState.errors.nik ? "border-red-500" : ""}
                  />
                  {form.formState.errors.nik && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nik.message}</p>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    {...form.register("tanggal_lahir")}
                  />
                </div>
                <div>
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input
                    id="tempat_lahir"
                    {...form.register("tempat_lahir")}
                    placeholder="Masukkan tempat lahir"
                  />
                </div>
                <div>
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select
                    value={form.watch('jenis_kelamin') || ''}
                    onValueChange={(value) => form.setValue('jenis_kelamin', value as 'Laki-laki' | 'Perempuan')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Section - Added before Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Lokasi</h3>
                <LocationSelector
                  form={form}
                  countryCode="ID"
                  provinceFieldName="demografi_province_id"
                  regencyFieldName="demografi_regency_id"
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Informasi Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telepon">Telepon</Label>
                    <Input
                      id="telepon"
                      {...form.register("telepon")}
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Textarea
                    id="alamat"
                    {...form.register("alamat")}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                </div>
              </div>

              {/* Physical Information */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
                  <Input
                    id="tinggi_badan"
                    type="number"
                    {...form.register("tinggi_badan", { valueAsNumber: true })}
                    placeholder="170"
                  />
                </div>
                <div>
                  <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
                  <Input
                    id="berat_badan"
                    type="number"
                    {...form.register("berat_badan", { valueAsNumber: true })}
                    placeholder="65"
                  />
                </div>
                <div>
                  <Label htmlFor="ukuran_sepatu">Ukuran Sepatu</Label>
                  <Input
                    id="ukuran_sepatu"
                    type="number"
                    {...form.register("ukuran_sepatu", { valueAsNumber: true })}
                    placeholder="42"
                  />
                </div>
                <div>
                  <Label htmlFor="golongan_darah">Golongan Darah</Label>
                  <Select
                    value={form.watch('golongan_darah') || ''}
                    onValueChange={(value) => form.setValue('golongan_darah', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih golongan darah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Biometric & Health */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Biometrik & Kesehatan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="ukuran_kepala">Ukuran Kepala</Label>
                    <Input
                      id="ukuran_kepala"
                      type="number"
                      {...form.register("ukuran_kepala", { valueAsNumber: true })}
                      placeholder="58"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ukuran_pinggang">Ukuran Pinggang (cm)</Label>
                    <Input
                      id="ukuran_pinggang"
                      type="number"
                      {...form.register("ukuran_pinggang", { valueAsNumber: true })}
                      placeholder="80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mata_kanan">Mata Kanan</Label>
                    <Input
                      id="mata_kanan"
                      {...form.register("mata_kanan")}
                      placeholder="1.0 / Normal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mata_kiri">Mata Kiri</Label>
                    <Input
                      id="mata_kiri"
                      {...form.register("mata_kiri")}
                      placeholder="1.0 / Normal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="buta_warna">Buta Warna</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="buta_warna"
                        className="w-4 h-4"
                        checked={form.watch('buta_warna')}
                        onChange={(e) => form.setValue('buta_warna', e.target.checked)}
                      />
                      <span>Ya, Buta Warna</span>
                    </div>
                  </div>
                  {form.watch('buta_warna') && (
                    <div>
                      <Label htmlFor="warna_buta">Jenis Buta Warna</Label>
                      <Input
                        id="warna_buta"
                        {...form.register("warna_buta")}
                        placeholder="Parsial / Total"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="penggunaan_tangan">Penggunaan Tangan</Label>
                    <Select
                      value={form.watch('penggunaan_tangan') || 'Kanan'}
                      onValueChange={(value) => form.setValue('penggunaan_tangan', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tangan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kanan">Kanan</SelectItem>
                        <SelectItem value="Kiri">Kiri</SelectItem>
                        <SelectItem value="Keduanya">Keduanya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Habits Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Kebiasaan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="merokok_sekarang">Merokok Sekarang?</Label>
                    <Select
                      value={form.watch('merokok_sekarang') || ''}
                      onValueChange={(value) => form.setValue('merokok_sekarang', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ya">Ya</SelectItem>
                        <SelectItem value="Tidak">Tidak</SelectItem>
                        <SelectItem value="Kadang-kadang">Kadang-kadang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="merokok_jepang">Merokok di Jepang?</Label>
                    <Select
                      value={form.watch('merokok_jepang') || ''}
                      onValueChange={(value) => form.setValue('merokok_jepang', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ya">Ya</SelectItem>
                        <SelectItem value="Tidak">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="minum_sake">Minum Sake/Alkohol?</Label>
                    <Select
                      value={form.watch('minum_sake') || ''}
                      onValueChange={(value) => form.setValue('minum_sake', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ya">Ya</SelectItem>
                        <SelectItem value="Tidak">Tidak</SelectItem>
                        <SelectItem value="Kadang-kadang">Kadang-kadang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
                  <Input
                    id="nama_sekolah"
                    {...form.register("nama_sekolah")}
                    placeholder="Masukkan nama sekolah"
                  />
                </div>
                <div>
                  <Label htmlFor="jurusan">Jurusan</Label>
                  <Input
                    id="jurusan"
                    {...form.register("jurusan")}
                    placeholder="Masukkan jurusan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tahun_masuk_sekolah">Tahun Masuk Sekolah</Label>
                  <Input
                    id="tahun_masuk_sekolah"
                    type="number"
                    {...form.register("tahun_masuk_sekolah", { valueAsNumber: true })}
                    placeholder="2018"
                  />
                </div>
                <div>
                  <Label htmlFor="tahun_lulus_sekolah">Tahun Lulus Sekolah</Label>
                  <Input
                    id="tahun_lulus_sekolah"
                    type="number"
                    {...form.register("tahun_lulus_sekolah", { valueAsNumber: true })}
                    placeholder="2021"
                  />
                </div>
              </div>

              {/* Program and LPK Mitra Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="program_id">Program</Label>
                  <SelectWithPlaceholder
                    value={form.watch('program_id') || ''}
                    onValueChange={(value) => form.setValue('program_id', value)}
                    placeholder="Pilih program"
                    disabled={isLoadingPrograms}
                  >
                    {program?.map((programItem) => (
                      <SelectItem key={programItem.id} value={programItem.id}>
                        {programItem.nama} - {programItem.kode}
                      </SelectItem>
                    ))}
                  </SelectWithPlaceholder>
                </div>
                <div>
                  <Label htmlFor="posisi_kerja_id">Posisi Kerja</Label>
                  <SelectWithPlaceholder
                    value={form.watch('posisi_kerja_id') || ''}
                    onValueChange={(value) => form.setValue('posisi_kerja_id', value)}
                    placeholder="Pilih posisi kerja"
                    disabled={isLoadingPosisiKerja}
                  >
                    {posisiKerja?.map((posisi) => (
                      <SelectItem key={posisi.id} value={posisi.id}>
                        {posisi.posisi} - {posisi.kode}
                      </SelectItem>
                    ))}
                  </SelectWithPlaceholder>
                </div>
                <div>
                  <Label htmlFor="lpk_mitra_id">LPK Mitra</Label>
                  <SelectWithPlaceholder
                    value={form.watch('lpk_mitra_id') || ''}
                    onValueChange={(value) => form.setValue('lpk_mitra_id', value)}
                    placeholder="Pilih LPK Mitra"
                    disabled={isLoadingLpkMitra}
                  >
                    {lpkMitras?.map((lpk) => (
                      <SelectItem key={lpk.id} value={lpk.id}>
                        {lpk.nama} - {lpk.kode}
                      </SelectItem>
                    ))}
                  </SelectWithPlaceholder>
                </div>
              </div>

              {/* Age Information - Auto-calculated from birth date */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="umur">Umur (otomatis dari tanggal lahir)</Label>
                  <Input
                    id="umur"
                    type="number"
                    {...form.register("umur", { valueAsNumber: true })}
                    readOnly
                    className="bg-muted"
                    placeholder="Akan terisi otomatis"
                  />
                </div>
                <div>
                  <Label htmlFor="tanggal_daftar">Tanggal Daftar</Label>
                  <Input
                    id="tanggal_daftar"
                    type="date"
                    {...form.register("tanggal_daftar")}
                  />
                </div>
                <div>
                  <Label htmlFor="agama">Agama</Label>
                  <Select
                    value={form.watch('agama') || ''}
                    onValueChange={(value) => form.setValue('agama', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status_pernikahan">Status Pernikahan</Label>
                  <Select
                    value={form.watch('status_pernikahan') || ''}
                    onValueChange={(value) => form.setValue('status_pernikahan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status pernikahan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                      <SelectItem value="Menikah">Menikah</SelectItem>
                      <SelectItem value="Cerai">Cerai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* LPK & Program Timeline */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Riwayat & Status LPK</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tanggal_masuk_lpk">Tanggal Masuk LPK</Label>
                    <Input
                      id="tanggal_masuk_lpk"
                      type="date"
                      {...form.register("tanggal_masuk_lpk")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lama_belajar">Lama Belajar</Label>
                    <Input
                      id="lama_belajar"
                      {...form.register("lama_belajar")}
                      placeholder="Contoh: 6 Bulan / 1 Tahun"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Profile Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Profil Lanjutan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bakat_khusus">Bakat Khusus</Label>
                    <Textarea
                      id="bakat_khusus"
                      {...form.register("bakat_khusus")}
                      placeholder="Masukkan bakat khusus"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kelebihan">Kelebihan</Label>
                    <Textarea
                      id="kelebihan"
                      {...form.register("kelebihan")}
                      placeholder="Kekuatan Anda"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kekurangan">Kekurangan</Label>
                    <Textarea
                      id="kekurangan"
                      {...form.register("kekurangan")}
                      placeholder="Hal yang perlu diperbaiki"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minat">Minat / Ketertarikan</Label>
                    <Textarea
                      id="minat"
                      {...form.register("minat")}
                      placeholder="Apa yang Anda minati di Jepang?"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="tujuan_jepang">Tujuan ke Jepang</Label>
                    <Textarea
                      id="tujuan_jepang"
                      {...form.register("tujuan_jepang")}
                      placeholder="Mengapa Anda ingin ke Jepang?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target_menabung">Target Menabung</Label>
                    <Input
                      id="target_menabung"
                      {...form.register("target_menabung")}
                      placeholder="Contoh: 50 Juta / Tahun"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="pengalaman">Pengalaman Lainnya</Label>
                  <Textarea
                    id="pengalaman"
                    {...form.register("pengalaman")}
                    placeholder="Pengalaman organisasi/sosial"
                    rows={2}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="hobi">Hobi</Label>
                <Textarea
                  id="hobi"
                  {...form.register("hobi")}
                  placeholder="Masukkan hobi"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="visi">Visi</Label>
                <Textarea
                  id="visi"
                  {...form.register("visi")}
                  placeholder="Masukkan visi"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea
                  id="catatan"
                  {...form.register("catatan")}
                  placeholder="Masukkan catatan tambahan"
                  rows={3}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {siswa ? 'Menyimpan...' : 'Membuat...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {siswa ? 'Simpan Perubahan' : 'Tambah Siswa'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
