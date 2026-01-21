
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
import { useProgram } from '@/hooks/useProgram';
import type { Tables } from '@/integrations/supabase/types';

const programSchema = z.object({
  nama: z.string().min(1, 'Nama program wajib diisi'),
  kode: z.string().min(1, 'Kode program wajib diisi'),
  deskripsi: z.string().optional(),
  tanggal_mulai: z.string().optional(),
  tanggal_selesai: z.string().optional(),
  durasi: z.coerce.number().min(1, 'Durasi harus minimal 1').default(1),
  satuan_durasi: z.enum(['hari', 'minggu', 'bulan', 'tahun']).default('bulan'),
  kuota: z.coerce.number().min(1, 'Kuota harus minimal 1').default(10),
  biaya: z.coerce.number().min(0, 'Biaya harus positif').default(0),
});

type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramInlineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: Tables<'program'> | null;
}

export function ProgramInlineForm({ open, onOpenChange, program }: ProgramInlineFormProps) {
  const { createProgram, updateProgram, isCreating, isUpdating } = useProgram();

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      nama: program?.nama || '',
      kode: program?.kode || '',
      deskripsi: program?.deskripsi || '',
      tanggal_mulai: program?.tanggal_mulai || '',
      tanggal_selesai: program?.tanggal_selesai || '',
      durasi: program?.durasi || 1,
      satuan_durasi: (program?.satuan_durasi as 'hari' | 'minggu' | 'bulan' | 'tahun') || 'bulan',
      kuota: program?.kuota || 10,
      biaya: program?.biaya || 0,
    },
  });

  const onSubmit = async (data: ProgramFormData) => {
    try {
      const submitData = {
        nama: data.nama,
        kode: data.kode,
        deskripsi: data.deskripsi || null,
        tanggal_mulai: data.tanggal_mulai || null,
        tanggal_selesai: data.tanggal_selesai || null,
        durasi: data.durasi,
        satuan_durasi: data.satuan_durasi,
        kuota: data.kuota,
        biaya: data.biaya,
      };

      if (program) {
        await updateProgram({ id: program.id, data: submitData });
      } else {
        await createProgram(submitData);
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {program ? 'Edit Program' : 'Tambah Program Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Program</Label>
              <Input
                id="nama"
                {...form.register('nama')}
                placeholder="Nama program"
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-600">{form.formState.errors.nama.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kode">Kode Program</Label>
              <Input
                id="kode"
                {...form.register('kode')}
                placeholder="Contoh: PRG001"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-600">{form.formState.errors.kode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              {...form.register('deskripsi')}
              placeholder="Deskripsi program"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
              <Input
                id="tanggal_mulai"
                type="date"
                {...form.register('tanggal_mulai')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
              <Input
                id="tanggal_selesai"
                type="date"
                {...form.register('tanggal_selesai')}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durasi">Durasi</Label>
              <Input
                id="durasi"
                type="number"
                {...form.register('durasi')}
                placeholder="1"
              />
              {form.formState.errors.durasi && (
                <p className="text-sm text-red-600">{form.formState.errors.durasi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="satuan_durasi">Satuan</Label>
              <Select
                value={form.watch('satuan_durasi')}
                onValueChange={(value: 'hari' | 'minggu' | 'bulan' | 'tahun') => form.setValue('satuan_durasi', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari">Hari</SelectItem>
                  <SelectItem value="minggu">Minggu</SelectItem>
                  <SelectItem value="bulan">Bulan</SelectItem>
                  <SelectItem value="tahun">Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kuota">Kuota</Label>
              <Input
                id="kuota"
                type="number"
                {...form.register('kuota')}
                placeholder="10"
              />
              {form.formState.errors.kuota && (
                <p className="text-sm text-red-600">{form.formState.errors.kuota.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biaya">Biaya</Label>
            <Input
              id="biaya"
              type="number"
              {...form.register('biaya')}
              placeholder="0"
            />
            {form.formState.errors.biaya && (
              <p className="text-sm text-red-600">{form.formState.errors.biaya.message}</p>
            )}
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
              {isCreating || isUpdating ? 'Menyimpan...' : (program ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
