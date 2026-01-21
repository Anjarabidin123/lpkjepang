
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiswaFormData } from "@/types/siswaForm";

interface SiswaJapanFieldsProps {
  form: UseFormReturn<SiswaFormData>;
}

export function SiswaJapanFields({ form }: SiswaJapanFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium mb-3">Informasi Jepang & LPK</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target_gaji">Target Gaji</Label>
          <Input
            id="target_gaji"
            {...form.register("target_gaji")}
            placeholder="Contoh: 150,000 yen/bulan"
          />
        </div>
        <div>
          <Label htmlFor="target_menabung">Target Menabung</Label>
          <Input
            id="target_menabung"
            {...form.register("target_menabung")}
            placeholder="Contoh: 50,000 yen/bulan"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tujuan_jepang">Tujuan ke Jepang</Label>
        <Textarea
          id="tujuan_jepang"
          {...form.register("tujuan_jepang")}
          placeholder="Jelaskan tujuan Anda bekerja di Jepang"
        />
      </div>

      <div>
        <Label htmlFor="pengalaman_jepang">Pengalaman Terkait Jepang</Label>
        <Textarea
          id="pengalaman_jepang"
          {...form.register("pengalaman_jepang")}
          placeholder="Pengalaman kerja, belajar, atau tinggal di Jepang sebelumnya"
        />
      </div>

      <div>
        <Label htmlFor="skill_bahasa_jepang">Kemampuan Bahasa Jepang</Label>
        <Select onValueChange={(value) => form.setValue('skill_bahasa_jepang', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih level kemampuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pemula">Pemula</SelectItem>
            <SelectItem value="N5">N5</SelectItem>
            <SelectItem value="N4">N4</SelectItem>
            <SelectItem value="N3">N3</SelectItem>
            <SelectItem value="N2">N2</SelectItem>
            <SelectItem value="N1">N1</SelectItem>
            <SelectItem value="Native">Native</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            placeholder="Contoh: 6 bulan"
          />
        </div>
      </div>
    </div>
  );
}
