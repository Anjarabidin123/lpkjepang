
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiswaFormData } from "@/types/siswaForm";

interface SiswaPhysicalFieldsProps {
  form: UseFormReturn<SiswaFormData>;
}

export function SiswaPhysicalFields({ form }: SiswaPhysicalFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium mb-3">Informasi Fisik</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
          <Input
            id="tinggi_badan"
            type="number"
            min="0"
            {...form.register("tinggi_badan", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="berat_badan">Berat Badan (kg)</Label>
          <Input
            id="berat_badan"
            type="number"
            min="0"
            {...form.register("berat_badan", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="ukuran_sepatu">Ukuran Sepatu</Label>
          <Input
            id="ukuran_sepatu"
            type="number"
            min="0"
            {...form.register("ukuran_sepatu", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ukuran_kepala">Ukuran Kepala (cm)</Label>
          <Input
            id="ukuran_kepala"
            type="number"
            step="0.1"
            min="0"
            {...form.register("ukuran_kepala", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="ukuran_pinggang">Ukuran Pinggang (cm)</Label>
          <Input
            id="ukuran_pinggang"
            type="number"
            step="0.1"
            min="0"
            {...form.register("ukuran_pinggang", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="golongan_darah">Golongan Darah</Label>
          <Select onValueChange={(value) => form.setValue('golongan_darah', value)}>
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
    </div>
  );
}
