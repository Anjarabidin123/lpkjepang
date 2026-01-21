import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Form } from '@/components/ui/form';
import { useSiswa } from "@/hooks/useSiswa";
import { LocationSelector } from "@/components/LocationSelector/LocationSelector";
import { SiswaPhotoUpload } from "@/components/Siswa/SiswaPhotoUpload";
import { calculateAge } from "@/utils/ageCalculator";
import { SiswaFormData } from "@/types/siswaForm";
import type { Siswa } from "@/hooks/useSiswa";
import { FamilyInformationTables } from "./FamilyInformationTables";
import { WorkExperienceTable } from "./WorkExperienceTable";

interface OfficialBiodataFormProps {
  siswa?: Siswa;
  onCancel: () => void;
  onSuccess: () => void;
}

export function OfficialBiodataForm({ siswa, onCancel, onSuccess }: OfficialBiodataFormProps) {
  const { createSiswa, updateSiswa, isCreating, isUpdating } = useSiswa();
  
  const form = useForm<SiswaFormData>({
    defaultValues: {
      nama: siswa?.nama || '',
      nik: siswa?.nik || '',
      jenis_kelamin: siswa?.jenis_kelamin || undefined,
      tanggal_lahir: siswa?.tanggal_lahir || '',
      tempat_lahir: siswa?.tempat_lahir || '',
      demografi_province_id: siswa?.demografi_province_id || '',
      demografi_regency_id: siswa?.demografi_regency_id || '',
      alamat: siswa?.alamat || '',
      telepon: siswa?.telepon || '',
      email: siswa?.email || '',
      umur: siswa?.umur || undefined,
      tinggi_badan: siswa?.tinggi_badan || undefined,
      berat_badan: siswa?.berat_badan || undefined,
      ukuran_sepatu: siswa?.ukuran_sepatu || undefined,
      ukuran_kepala: siswa?.ukuran_kepala || undefined,
      ukuran_pinggang: siswa?.ukuran_pinggang || undefined,
      golongan_darah: siswa?.golongan_darah || '',
      mata_kanan: siswa?.mata_kanan || '',
      mata_kiri: siswa?.mata_kiri || '',
      buta_warna: siswa?.buta_warna || false,
      warna_buta: siswa?.warna_buta || '',
      penggunaan_tangan: siswa?.penggunaan_tangan || 'Kanan',
      merokok_sekarang: siswa?.merokok_sekarang || '',
      merokok_jepang: siswa?.merokok_jepang || '',
      minum_sake: siswa?.minum_sake || '',
      agama: siswa?.agama || '',
      status_pernikahan: siswa?.status_pernikahan || 'Belum Menikah',
      hobi: siswa?.hobi || '',
      minat: siswa?.minat || '',
      visi: siswa?.visi || '',
      bakat_khusus: siswa?.bakat_khusus || '',
      kelebihan: siswa?.kelebihan || '',
      kekurangan: siswa?.kekurangan || '',
      pengalaman: siswa?.pengalaman || '',
      target_gaji: siswa?.target_gaji || '',
      target_menabung: siswa?.target_menabung || '',
      tujuan_jepang: siswa?.tujuan_jepang || '',
      pengalaman_jepang: siswa?.pengalaman_jepang || '',
      skill_bahasa_jepang: siswa?.skill_bahasa_jepang || '',
      tanggal_masuk_lpk: siswa?.tanggal_masuk_lpk || '',
      lama_belajar: siswa?.lama_belajar || '',
      catatan: siswa?.catatan || '',
      foto_siswa: siswa?.foto_siswa || '',
      foto_url: siswa?.foto_url || '',
      nama_sekolah: siswa?.nama_sekolah || '',
      tahun_masuk_sekolah: siswa?.tahun_masuk_sekolah || undefined,
      tahun_lulus_sekolah: siswa?.tahun_lulus_sekolah || undefined,
      jurusan: siswa?.jurusan || '',
      is_available: siswa?.is_available !== undefined ? siswa.is_available : true,
    }
  });

  const onSubmit = (data: SiswaFormData) => {
    // Auto-calculate age if birth date is provided but age is not
    let finalAge = data.umur;
    if (!finalAge && data.tanggal_lahir) {
      finalAge = calculateAge(data.tanggal_lahir) || undefined;
    }

    const submitData = {
      ...data,
      umur: finalAge,
      demografi_province_id: data.demografi_province_id || null,
      demografi_regency_id: data.demografi_regency_id || null,
      foto_siswa: data.foto_siswa || data.foto_url || null,
      foto_url: data.foto_siswa || data.foto_url || null,
    };

    if (siswa) {
      updateSiswa({ id: siswa.id, ...submitData });
    } else {
      createSiswa(submitData);
    }
    onSuccess();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">履歴書 BIODATA - CV</h1>
        <div className="text-lg font-semibold">
          NIK: <span className="border-b-2 border-gray-400 px-2 py-1 min-w-[200px] inline-block">
            {form.watch('nik') || '________________'}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 gap-6">
            {/* Left Section - Photo */}
            <div className="col-span-1">
              <div className="border-2 border-gray-400 p-4 h-48 flex flex-col items-center justify-center">
                <SiswaPhotoUpload
                  value={form.watch('foto_siswa') || form.watch('foto_url')}
                  onChange={(url) => {
                    form.setValue('foto_siswa', url);
                    form.setValue('foto_url', url);
                  }}
                  label="Foto 4x6"
                />
              </div>
            </div>

            {/* Right Section - Basic Information */}
            <div className="col-span-3">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-6 gap-4 mb-6">
                <div className="col-span-3">
                  <Label className="text-sm font-medium">氏名 Nama / Name</Label>
                  <Input
                    {...form.register("nama", { required: "Nama wajib diisi" })}
                    className="mt-1 font-medium text-lg"
                    placeholder="NAMA LENGKAP"
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-sm font-medium">性別 Jenis Kelamin / Sex</Label>
                  <RadioGroup 
                    value={form.watch('jenis_kelamin')}
                    onValueChange={(value) => form.setValue('jenis_kelamin', value as 'Laki-laki' | 'Perempuan')}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Perempuan" id="female" />
                      <Label htmlFor="female">女性 Perempuan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Laki-laki" id="male" />
                      <Label htmlFor="male">男性 Laki-laki</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="col-span-2">
                  <Label className="text-sm font-medium">生年月日 Tanggal Lahir</Label>
                  <Input
                    type="date"
                    {...form.register("tanggal_lahir")}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">出身地 Tempat Lahir</Label>
                  <Input
                    {...form.register("tempat_lahir")}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">年齢 Umur / Age</Label>
                  <Input
                    type="number"
                    {...form.register("umur", { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="Tahun"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-sm font-medium">電話番号 No. Telepon</Label>
                  <Input
                    {...form.register("telepon")}
                    className="mt-1"
                    placeholder="+62"
                  />
                </div>
                <div className="col-span-4">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    {...form.register("email")}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">住所 Alamat / Address</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Textarea
                    {...form.register("alamat")}
                    className="min-h-[60px]"
                    placeholder="Alamat lengkap..."
                  />
                  <LocationSelector
                    form={form}
                    countryCode="ID"
                    provinceFieldName="demografi_province_id"
                    regencyFieldName="demografi_regency_id"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Physical Measurements Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">身体情報 Informasi Fisik / Physical Information</h3>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <Label className="text-sm">身長 Tinggi (cm)</Label>
                <Input
                  type="number"
                  {...form.register("tinggi_badan", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">体重 Berat (kg)</Label>
                <Input
                  type="number"
                  {...form.register("berat_badan", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">靴 Sepatu</Label>
                <Input
                  type="number"
                  {...form.register("ukuran_sepatu", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">頭囲 Kepala (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...form.register("ukuran_kepala", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">腰囲 Pinggang (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...form.register("ukuran_pinggang", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">血液型 Gol. Darah</Label>
                <Select onValueChange={(value) => form.setValue('golongan_darah', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih" />
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

            {/* Vision and Health */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <Label className="text-sm">視力 Mata Kanan</Label>
                <Input
                  {...form.register("mata_kanan")}
                  className="mt-1"
                  placeholder="1.0"
                />
              </div>
              <div>
                <Label className="text-sm">視力 Mata Kiri</Label>
                <Input
                  {...form.register("mata_kiri")}
                  className="mt-1"
                  placeholder="1.0"
                />
              </div>
              <div>
                <Label className="text-sm">色覚 Buta Warna</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    checked={form.watch('buta_warna')}
                    onCheckedChange={(checked) => form.setValue('buta_warna', !!checked)}
                  />
                  <span className="text-sm">Ya</span>
                </div>
              </div>
              <div>
                <Label className="text-sm">利き手 Tangan</Label>
                <Select onValueChange={(value) => form.setValue('penggunaan_tangan', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Kanan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kanan">右 Kanan</SelectItem>
                    <SelectItem value="Kiri">左 Kiri</SelectItem>
                    <SelectItem value="Keduanya">両手 Keduanya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Health & Lifestyle Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">健康・生活習慣 Kesehatan & Gaya Hidup</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium">喫煙 Merokok Sekarang</Label>
                <Select onValueChange={(value) => form.setValue('merokok_sekarang', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ya">はい Ya</SelectItem>
                    <SelectItem value="Tidak">いいえ Tidak</SelectItem>
                    <SelectItem value="Kadang-kadang">時々 Kadang-kadang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">日本での喫煙 Merokok di Jepang</Label>
                <Select onValueChange={(value) => form.setValue('merokok_jepang', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ya">はい Ya</SelectItem>
                    <SelectItem value="Tidak">いいえ Tidak</SelectItem>
                    <SelectItem value="Mungkin">多分 Mungkin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">飲酒 Minum Alkohol</Label>
                <Select onValueChange={(value) => form.setValue('minum_sake', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ya">はい Ya</SelectItem>
                    <SelectItem value="Tidak">いいえ Tidak</SelectItem>
                    <SelectItem value="Kadang-kadang">時々 Kadang-kadang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label className="text-sm font-medium">宗教 Agama / Religion</Label>
                <Select onValueChange={(value) => form.setValue('agama', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih agama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">イスラム教 Islam</SelectItem>
                    <SelectItem value="Kristen">キリスト教 Kristen</SelectItem>
                    <SelectItem value="Katolik">カトリック Katolik</SelectItem>
                    <SelectItem value="Hindu">ヒンドゥー教 Hindu</SelectItem>
                    <SelectItem value="Buddha">仏教 Buddha</SelectItem>
                    <SelectItem value="Konghucu">儒教 Konghucu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">結婚状況 Status Pernikahan</Label>
                <Select onValueChange={(value) => form.setValue('status_pernikahan', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Menikah">独身 Belum Menikah</SelectItem>
                    <SelectItem value="Menikah">既婚 Menikah</SelectItem>
                    <SelectItem value="Cerai">離婚 Cerai</SelectItem>
                    <SelectItem value="Janda/Duda">寡婦/寡夫 Janda/Duda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Personal Qualities Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">個人的特性 Karakteristik Personal</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">趣味 Hobi / Hobby</Label>
                <Textarea
                  {...form.register("hobi")}
                  className="mt-1 min-h-[80px]"
                  placeholder="Sebutkan hobi dan minat Anda..."
                />
              </div>
              <div>
                <Label className="text-sm font-medium">特技 Bakat Khusus / Special Skills</Label>
                <Textarea
                  {...form.register("bakat_khusus")}
                  className="mt-1 min-h-[80px]"
                  placeholder="Keterampilan atau bakat khusus..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label className="text-sm font-medium">長所 Kelebihan / Strengths</Label>
                <Textarea
                  {...form.register("kelebihan")}
                  className="mt-1 min-h-[80px]"
                  placeholder="Kelebihan dan kekuatan Anda..."
                />
              </div>
              <div>
                <Label className="text-sm font-medium">短所 Kekurangan / Weaknesses</Label>
                <Textarea
                  {...form.register("kekurangan")}
                  className="mt-1 min-h-[80px]"
                  placeholder="Kelemahan yang ingin diperbaiki..."
                />
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">経験 Pengalaman / Experience</Label>
              <Textarea
                {...form.register("pengalaman")}
                className="mt-1 min-h-[100px]"
                placeholder="Pengalaman kerja atau kehidupan yang relevan..."
              />
            </div>
          </div>

          {/* Japan-related Goals Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">日本関連情報 Informasi Terkait Jepang</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">目標給与 Target Gaji / Target Salary</Label>
                <Input
                  {...form.register("target_gaji")}
                  className="mt-1"
                  placeholder="例: 150,000 yen/月"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">貯金目標 Target Menabung / Savings Goal</Label>
                <Input
                  {...form.register("target_menabung")}
                  className="mt-1"
                  placeholder="例: 50,000 yen/月"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">日本語能力 Kemampuan Bahasa Jepang / Japanese Level</Label>
              <Select onValueChange={(value) => form.setValue('skill_bahasa_jepang', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemula">初心者 Pemula</SelectItem>
                  <SelectItem value="N5">N5 レベル</SelectItem>
                  <SelectItem value="N4">N4 レベル</SelectItem>
                  <SelectItem value="N3">N3 レベル</SelectItem>
                  <SelectItem value="N2">N2 レベル</SelectItem>
                  <SelectItem value="N1">N1 レベル</SelectItem>
                  <SelectItem value="Native">母語レベル Native</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">日本での目的 Tujuan ke Jepang / Purpose in Japan</Label>
              <Textarea
                {...form.register("tujuan_jepang")}
                className="mt-1 min-h-[100px]"
                placeholder="Jelaskan tujuan dan harapan Anda bekerja di Jepang..."
              />
            </div>

            <div className="mt-4">
              <Label className="text-sm font-medium">日本での経験 Pengalaman Terkait Jepang / Japan Experience</Label>
              <Textarea
                {...form.register("pengalaman_jepang")}
                className="mt-1 min-h-[80px]"
                placeholder="Pengalaman sebelumnya terkait Jepang (kerja, belajar, tinggal)..."
              />
            </div>
          </div>

          {/* Education History Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">学歴 Riwayat Pendidikan / Education History</h3>
            <div className="border border-gray-400">
              <div className="grid grid-cols-5 gap-0 bg-gray-100 border-b border-gray-400">
                <div className="p-3 border-r border-gray-400 text-sm font-medium text-center">
                  入学年 FROM
                </div>
                <div className="p-3 border-r border-gray-400 text-sm font-medium text-center">
                  卒業年 TO
                </div>
                <div className="p-3 border-r border-gray-400 text-sm font-medium text-center">
                  学校名 School Name
                </div>
                <div className="p-3 border-r border-gray-400 text-sm font-medium text-center">
                  専攻 Major
                </div>
                <div className="p-3 text-sm font-medium text-center">
                  備考 Notes
                </div>
              </div>
              <div className="grid grid-cols-5 gap-0">
                <div className="p-3 border-r border-gray-400">
                  <Input
                    type="number"
                    {...form.register("tahun_masuk_sekolah", { valueAsNumber: true })}
                    placeholder="2020"
                    className="text-center"
                  />
                </div>
                <div className="p-3 border-r border-gray-400">
                  <Input
                    type="number"
                    {...form.register("tahun_lulus_sekolah", { valueAsNumber: true })}
                    placeholder="2023"
                    className="text-center"
                  />
                </div>
                <div className="p-3 border-r border-gray-400">
                  <Input
                    {...form.register("nama_sekolah")}
                    placeholder="Nama sekolah"
                  />
                </div>
                <div className="p-3 border-r border-gray-400">
                  <Input
                    {...form.register("jurusan")}
                    placeholder="Jurusan"
                  />
                </div>
                <div className="p-3">
                  <Input placeholder="Catatan" />
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience Table */}
          <WorkExperienceTable />

          {/* Family Information Tables */}
          <FamilyInformationTables />

          {/* LPK Information Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">LPK情報 Informasi LPK</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">入学日 Tanggal Masuk LPK</Label>
                <Input
                  type="date"
                  {...form.register("tanggal_masuk_lpk")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">学習期間 Lama Belajar</Label>
                <Input
                  {...form.register("lama_belajar")}
                  className="mt-1"
                  placeholder="例: 6ヶ月 (6 bulan)"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="border-t-2 border-gray-400 pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">備考 Catatan / Notes</h3>
            <Textarea
              {...form.register("catatan")}
              className="min-h-[120px]"
              placeholder="Catatan tambahan atau informasi penting lainnya..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中... Menyimpan..." : "保存 Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}