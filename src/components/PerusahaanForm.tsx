import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useKumiai } from '@/hooks/useKumiai';
import { usePerusahaan } from '@/hooks/usePerusahaan';
import type { Tables } from '@/integrations/supabase/types';

const perusahaanSchema = z.object({
  kode: z.string().min(1, 'Kode perusahaan wajib diisi'),
  nama: z.string().min(1, 'Nama perusahaan wajib diisi'),
  kumiai_id: z.string().min(1, 'Kumiai wajib dipilih'),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  bidang_usaha: z.string().optional(),
  kapasitas: z.coerce.number().min(0, 'Kapasitas harus positif').default(0),
  tanggal_kerjasama: z.string().optional(),
});

type PerusahaanFormData = z.infer<typeof perusahaanSchema>;

interface PerusahaanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perusahaan?: Tables<'perusahaan'> | null;
}

export function PerusahaanForm({ open, onOpenChange, perusahaan }: PerusahaanFormProps) {
  const { kumiai, isLoading: kumiaiLoading } = useKumiai();
  const { createPerusahaan, updatePerusahaan, isCreating, isUpdating } = usePerusahaan();

  const form = useForm<PerusahaanFormData>({
    resolver: zodResolver(perusahaanSchema),
    defaultValues: {
      kode: perusahaan?.kode || '',
      nama: perusahaan?.nama || '',
      kumiai_id: perusahaan?.kumiai_id || '',
      alamat: perusahaan?.alamat || '',
      telepon: perusahaan?.telepon || '',
      email: perusahaan?.email || '',
      bidang_usaha: perusahaan?.bidang_usaha || '',
      kapasitas: perusahaan?.kapasitas || 0,
      tanggal_kerjasama: perusahaan?.tanggal_kerjasama || '',
    },
  });

  const onSubmit = async (data: PerusahaanFormData) => {
    try {
      const submitData = {
        kode: data.kode,
        nama: data.nama,
        kumiai_id: data.kumiai_id,
        alamat: data.alamat || null,
        telepon: data.telepon || null,
        email: data.email || null,
        bidang_usaha: data.bidang_usaha || null,
        kapasitas: data.kapasitas,
        tanggal_kerjasama: data.tanggal_kerjasama || null,
      };

      if (perusahaan) {
        await updatePerusahaan({ 
          id: perusahaan.id, 
          data: submitData
        });
      } else {
        await createPerusahaan(submitData);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving perusahaan:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {perusahaan ? 'Edit Perusahaan' : 'Tambah Perusahaan Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Kode Perusahaan</Label>
              <Input
                id="kode"
                {...form.register('kode')}
                placeholder="Contoh: PRS001"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-600">{form.formState.errors.kode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Perusahaan</Label>
              <Input
                id="nama"
                {...form.register('nama')}
                placeholder="Nama perusahaan"
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-600">{form.formState.errors.nama.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kumiai_id">Kumiai</Label>
            <Select
              value={form.watch('kumiai_id')}
              onValueChange={(value) => form.setValue('kumiai_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kumiai" />
              </SelectTrigger>
              <SelectContent>
                {kumiai.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.kumiai_id && (
              <p className="text-sm text-red-600">{form.formState.errors.kumiai_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              {...form.register('alamat')}
              placeholder="Alamat perusahaan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                id="telepon"
                {...form.register('telepon')}
                placeholder="Nomor telepon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Email perusahaan"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bidang_usaha">Bidang Usaha</Label>
              <Input
                id="bidang_usaha"
                {...form.register('bidang_usaha')}
                placeholder="Bidang usaha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kapasitas">Kapasitas</Label>
              <Input
                id="kapasitas"
                type="number"
                {...form.register('kapasitas')}
                placeholder="0"
              />
              {form.formState.errors.kapasitas && (
                <p className="text-sm text-red-600">{form.formState.errors.kapasitas.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggal_kerjasama">Tanggal Kerjasama</Label>
            <Input
              id="tanggal_kerjasama"
              type="date"
              {...form.register('tanggal_kerjasama')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Menyimpan...' : (perusahaan ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
