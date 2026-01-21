
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { calculateAge } from "@/utils/ageCalculator";
import { SiswaFormData } from "@/types/siswaForm";

interface SiswaBasicFieldsProps {
  form: UseFormReturn<SiswaFormData>;
}

export function SiswaBasicFields({ form }: SiswaBasicFieldsProps) {
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nama">Nama Lengkap *</Label>
          <Input
            id="nama"
            {...form.register("nama", { required: "Nama wajib diisi" })}
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
            className={form.formState.errors.nik ? "border-red-500" : ""}
          />
          {form.formState.errors.nik && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.nik.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
          <Select onValueChange={(value) => form.setValue('jenis_kelamin', value as 'Laki-laki' | 'Perempuan')}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
          <Input
            id="tempat_lahir"
            {...form.register("tempat_lahir")}
          />
        </div>
        <div>
          <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
          <Input
            id="tanggal_lahir"
            type="date"
            {...form.register("tanggal_lahir")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telepon">Telepon</Label>
          <Input
            id="telepon"
            {...form.register("telepon")}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="alamat">Alamat</Label>
        <Textarea
          id="alamat"
          {...form.register("alamat")}
        />
      </div>
    </div>
  );
}
