
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, X } from 'lucide-react';
import { useDemografiRegencies } from '@/hooks/useDemografiRegencies';
import type { DemografiRegency, DemografiProvince } from '@/types/demografi';

const regencySchema = z.object({
  kode: z.string().min(1, 'Kode kabupaten harus diisi'),
  nama: z.string().min(1, 'Nama kabupaten harus diisi'),
  nama_lokal: z.string().optional(),
  province_id: z.string().min(1, 'Provinsi harus dipilih'),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type RegencyFormData = z.infer<typeof regencySchema>;

interface DemografiRegencyFormProps {
  provinces: DemografiProvince[];
  regency?: DemografiRegency | null;
  onClose: () => void;
}

export function DemografiRegencyForm({ provinces, regency, onClose }: DemografiRegencyFormProps) {
  const { createRegency, updateRegency, isCreating, isUpdating } = useDemografiRegencies();
  const isEditing = !!regency;

  const form = useForm<RegencyFormData>({
    resolver: zodResolver(regencySchema),
    defaultValues: {
      kode: regency?.kode || '',
      nama: regency?.nama || '',
      nama_lokal: regency?.nama_lokal || '',
      province_id: regency?.province_id || '',
      sort_order: regency?.sort_order || 0,
      is_active: regency?.is_active ?? true,
    },
  });

  const onSubmit = async (data: RegencyFormData) => {
    try {
      const submitData = {
        province_id: data.province_id,
        kode: data.kode,
        nama: data.nama,
        nama_lokal: data.nama_lokal || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      if (isEditing && regency) {
        updateRegency({ id: regency.id, ...submitData });
      } else {
        createRegency(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving regency:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <CardTitle>
            {isEditing ? 'Edit Kabupaten' : 'Tambah Kabupaten Baru'}
          </CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="province_id">Provinsi</Label>
            <Select
              value={form.watch('province_id')}
              onValueChange={(value) => form.setValue('province_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih provinsi" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.province_id && (
              <p className="text-sm text-red-600">{form.formState.errors.province_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Kode Kabupaten</Label>
              <Input
                id="kode"
                {...form.register('kode')}
                placeholder="Contoh: BGR"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-600">{form.formState.errors.kode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kabupaten</Label>
              <Input
                id="nama"
                {...form.register('nama')}
                placeholder="Contoh: Bogor"
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
                placeholder="Contoh: ボゴール"
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
