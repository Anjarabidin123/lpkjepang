
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SiswaFormData } from "@/types/siswaForm";

interface SiswaHealthFieldsProps {
  form: UseFormReturn<SiswaFormData>;
}

export function SiswaHealthFields({ form }: SiswaHealthFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium mb-3">Informasi Kesehatan</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mata_kanan">Mata Kanan</Label>
          <Input
            id="mata_kanan"
            {...form.register("mata_kanan")}
            placeholder="Contoh: Normal, Minus 1, dll"
          />
        </div>
        <div>
          <Label htmlFor="mata_kiri">Mata Kiri</Label>
          <Input
            id="mata_kiri"
            {...form.register("mata_kiri")}
            placeholder="Contoh: Normal, Minus 1, dll"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="buta_warna"
            checked={form.watch('buta_warna')}
            onCheckedChange={(checked) => form.setValue('buta_warna', !!checked)}
          />
          <Label htmlFor="buta_warna">Buta Warna</Label>
        </div>
        <div>
          <Label htmlFor="warna_buta">Jenis Buta Warna</Label>
          <Input
            id="warna_buta"
            {...form.register("warna_buta")}
            placeholder="Contoh: Parsial Merah-Hijau"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="penggunaan_tangan">Penggunaan Tangan</Label>
          <Select onValueChange={(value) => form.setValue('penggunaan_tangan', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih penggunaan tangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kanan">Kanan</SelectItem>
              <SelectItem value="Kiri">Kiri</SelectItem>
              <SelectItem value="Keduanya">Keduanya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="agama">Agama</Label>
          <Select onValueChange={(value) => form.setValue('agama', value)}>
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
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="merokok_sekarang">Status Merokok Saat Ini</Label>
          <Select onValueChange={(value) => form.setValue('merokok_sekarang', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ya">Ya</SelectItem>
              <SelectItem value="Tidak">Tidak</SelectItem>
              <SelectItem value="Kadang-kadang">Kadang-kadang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="merokok_jepang">Akan Merokok di Jepang</Label>
          <Select onValueChange={(value) => form.setValue('merokok_jepang', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ya">Ya</SelectItem>
              <SelectItem value="Tidak">Tidak</SelectItem>
              <SelectItem value="Mungkin">Mungkin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="minum_sake">Minum Sake</Label>
          <Select onValueChange={(value) => form.setValue('minum_sake', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ya">Ya</SelectItem>
              <SelectItem value="Tidak">Tidak</SelectItem>
              <SelectItem value="Kadang-kadang">Kadang-kadang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="status_pernikahan">Status Pernikahan</Label>
        <Select onValueChange={(value) => form.setValue('status_pernikahan', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status pernikahan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
            <SelectItem value="Menikah">Menikah</SelectItem>
            <SelectItem value="Cerai">Cerai</SelectItem>
            <SelectItem value="Janda/Duda">Janda/Duda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
