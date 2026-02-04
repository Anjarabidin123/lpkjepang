import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { useDemografiProvinces } from '@/hooks/useDemografiProvinces';
import { useDemografiRegencies } from '@/hooks/useDemografiRegencies';
import { formatRibuan } from "@/utils/formHelpers";
import { useEffect, useState } from "react";

const hubunganOptions = [
  "Ayah", "Ibu", "Suami", "Istri", "Anak", "Kakak", "Adik",
  "Kakek", "Nenek", "Paman", "Bibi", "Sepupu", "Keponakan", "Lainnya"
];

export function FamilyInformationTables() {
  const { control, register, watch, setValue } = useFormContext();
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  const { provinces } = useDemografiProvinces();
  const { regencies } = useDemografiRegencies(selectedProvinceId || undefined);

  // Initial sync for province name to ID if needed
  // But usually demografi master data is for IDs. 
  // If the field is 'provinsi' (string), we might need to find by name or just use IDs.
  // The user wants dropdowns, so we'll use master data.

  const { fields: fieldsIndonesia, append: appendIndonesia, remove: removeIndonesia } = useFieldArray({
    control,
    name: "keluarga_indonesia"
  });

  const { fields: fieldsJapan, append: appendJapan, remove: removeJapan } = useFieldArray({
    control,
    name: "keluarga_jepang"
  });

  const addFamilyMember = (type: 'indonesia' | 'japan') => {
    const newMember = {
      nama: '',
      hubungan: '',
      umur: '',
      pekerjaan: ''
    };

    if (type === 'indonesia') {
      appendIndonesia(newMember);
    } else {
      appendJapan(newMember);
    }
  };

  return (
    <div className="space-y-8">
      {/* Emergency Contact in Indonesia */}
      <div className="border-t-2 border-gray-400 pt-6">
        <h3 className="text-lg font-bold mb-4">緊急連絡先 Kontak Darurat di Indonesia</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">名前 Nama / Name</Label>
            <Input
              {...register('kontak_darurat_nama')}
              className="mt-1"
              placeholder="Nama lengkap kontak darurat"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">電話番号 No. HP / Phone</Label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-400 text-sm font-semibold">
                +62
              </span>
              <Input
                {...register('kontak_darurat_no_hp')}
                className="rounded-l-none"
                placeholder="812345678"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-sm font-medium">住所 Alamat / Address</Label>
          <Input
            {...register('kontak_darurat_alamat')}
            className="mt-1"
            placeholder="Alamat lengkap"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label className="text-sm">RT/RW</Label>
            <Input
              {...register('kontak_darurat_rt_rw')}
              className="mt-1"
              placeholder="001/002"
            />
          </div>
          <div>
            <Label className="text-sm">Kelurahan</Label>
            <Input
              {...register('kontak_darurat_kelurahan')}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Kecamatan</Label>
            <Input
              {...register('kontak_darurat_kecamatan')}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label className="text-sm">Provinsi</Label>
            <Controller
              name="kontak_darurat_provinsi"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    const prov = provinces.find(p => p.nama === val);
                    if (prov) setSelectedProvinceId(prov.id);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(p => (
                      <SelectItem key={p.id} value={p.nama}>{p.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label className="text-sm">Kab/Kota</Label>
            <Controller
              name="kontak_darurat_kab_kota"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedProvinceId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih Kab/Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {regencies.map(r => (
                      <SelectItem key={r.id} value={r.nama}>{r.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label className="text-sm">Kode Pos</Label>
            <Input
              {...register('kontak_darurat_kode_pos')}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-sm font-medium">収入 Penghasilan/Bulan (Rp)</Label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-400 text-sm">
              Rp
            </span>
            <Controller
              name="kontak_darurat_penghasilan_per_bulan"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="rounded-l-none"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    field.onChange(formatRibuan(val));
                  }}
                  placeholder="0"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Family Members in Indonesia */}
      <div className="border-t-2 border-gray-400 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">家族構成 Keluarga di Indonesia</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember('indonesia')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Anggota
          </Button>
        </div>

        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                名前 Nama / Name
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                続柄 Hubungan / Relation
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                年齢 Umur / Age
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                職業 Pekerjaan / Job
              </TableHead>
              <TableHead className="text-center font-medium text-sm">
                アクション Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldsIndonesia.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="border-r border-gray-400">
                  <Input
                    {...register(`keluarga_indonesia.${index}.nama` as const)}
                    placeholder="Nama lengkap"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Controller
                    name={`keluarga_indonesia.${index}.hubungan`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hubungan" />
                        </SelectTrigger>
                        <SelectContent>
                          {hubunganOptions.map((hubungan) => (
                            <SelectItem key={hubungan} value={hubungan}>
                              {hubungan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    type="number"
                    {...register(`keluarga_indonesia.${index}.umur` as const, { valueAsNumber: true })}
                    placeholder="Umur"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    {...register(`keluarga_indonesia.${index}.pekerjaan` as const)}
                    placeholder="Pekerjaan"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIndonesia(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {fieldsIndonesia.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Belum ada data keluarga. Klik "Tambah Anggota" untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Family Members in Japan */}
      <div className="border-t-2 border-gray-400 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">日本の家族・知人 Keluarga/Teman di Jepang</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember('japan')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kontak
          </Button>
        </div>

        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                名前 Nama / Name
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                続柄 Hubungan / Relation
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                年齢 Umur / Age
              </TableHead>
              <TableHead className="border-r border-gray-400 text-center font-medium text-sm">
                職業 Pekerjaan / Job
              </TableHead>
              <TableHead className="text-center font-medium text-sm">
                アクション Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldsJapan.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell className="border-r border-gray-400">
                  <Input
                    {...register(`keluarga_jepang.${index}.nama` as const)}
                    placeholder="Nama lengkap"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Controller
                    name={`keluarga_jepang.${index}.hubungan`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hubungan" />
                        </SelectTrigger>
                        <SelectContent>
                          {hubunganOptions.map((hubungan) => (
                            <SelectItem key={hubungan} value={hubungan}>
                              {hubungan}
                            </SelectItem>
                          ))}
                          <SelectItem value="Teman">友人 Teman</SelectItem>
                          <SelectItem value="Kenalan">知人 Kenalan</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    type="number"
                    {...register(`keluarga_jepang.${index}.umur` as const, { valueAsNumber: true })}
                    placeholder="Umur"
                  />
                </TableCell>
                <TableCell className="border-r border-gray-400">
                  <Input
                    {...register(`keluarga_jepang.${index}.pekerjaan` as const)}
                    placeholder="Pekerjaan"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeJapan(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {fieldsJapan.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Belum ada data keluarga/teman di Jepang. Klik "Tambah Kontak" untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

