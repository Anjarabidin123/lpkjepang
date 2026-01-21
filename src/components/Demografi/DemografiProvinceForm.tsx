
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, X } from 'lucide-react';
import { useDemografiProvinces } from '@/hooks/useDemografiProvinces';
import type { DemografiProvince } from '@/types/demografi';

const provinceSchema = z.object({
  kode: z.string().min(1, 'Kode provinsi harus diisi'),
  nama: z.string().min(1, 'Nama provinsi harus diisi'),
  nama_lokal: z.string().optional(),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type ProvinceFormData = z.infer<typeof provinceSchema>;

interface DemografiProvinceFormProps {
  countryId: string;
  province?: DemografiProvince | null;
  onClose: () => void;
}

export function DemografiProvinceForm({ countryId, province, onClose }: DemografiProvinceFormProps) {
  const { createProvince, updateProvince, isCreating, isUpdating } = useDemografiProvinces();
  const isEditing = !!province;

  const form = useForm<ProvinceFormData>({
    resolver: zodResolver(provinceSchema),
    defaultValues: {
      kode: province?.kode || '',
      nama: province?.nama || '',
      nama_lokal: province?.nama_lokal || '',
      sort_order: province?.sort_order || 0,
      is_active: province?.is_active ?? true,
    },
  });

  const onSubmit = async (data: ProvinceFormData) => {
    try {
      const submitData = {
        country_id: countryId,
        kode: data.kode,
        nama: data.nama,
        nama_lokal: data.nama_lokal || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      if (isEditing && province) {
        updateProvince({ id: province.id, ...submitData });
      } else {
        createProvince(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving province:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <CardTitle>
            {isEditing ? 'Edit Provinsi' : 'Tambah Provinsi Baru'}
          </CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Kode Provinsi</Label>
              <Input
                id="kode"
                {...form.register('kode')}
                placeholder="Contoh: JB"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-600">{form.formState.errors.kode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Provinsi</Label>
              <Input
                id="nama"
                {...form.register('nama')}
                placeholder="Contoh: Jawa Barat"
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-600">{form.formState.errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama_lokal">Nama Lokal (Opsional)</Label>
              <Input
                id="nama_lokal"
                {...form.register('nama_lokal')}
                placeholder="Contoh: 西ジャワ州"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Urutan</Label>
              <Input
                id="sort_order"
                type="number"
                {...form.register('sort_order')}
                placeholder="0"
              />
              {form.formState.errors.sort_order && (
                <p className="text-sm text-red-600">{form.formState.errors.sort_order.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Status Aktif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
