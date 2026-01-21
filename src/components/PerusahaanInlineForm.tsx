import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { usePerusahaan } from '@/hooks/usePerusahaan';
import { useKumiai } from '@/hooks/useKumiai';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

const perusahaanSchema = z.object({
  nama: z.string().min(1, 'Nama perusahaan harus diisi'),
  kode: z.string().min(1, 'Kode perusahaan harus diisi'),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  bidang_usaha: z.string().optional(),
  kapasitas: z.number().min(0, 'Kapasitas tidak boleh negatif').optional(),
  tanggal_kerjasama: z.string().optional(),
  kumiai_id: z.string().min(1, 'Kumiai harus dipilih'),
});

type PerusahaanFormData = z.infer<typeof perusahaanSchema>;

interface PerusahaanInlineFormProps {
  perusahaan?: Tables<'perusahaan'> | null;
  kumiaiId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function PerusahaanInlineForm({ 
  perusahaan, 
  kumiaiId,
  onCancel, 
  onSuccess 
}: PerusahaanInlineFormProps) {
  const { createPerusahaan, updatePerusahaan, isCreating, isUpdating } = usePerusahaan();
  const { kumiai } = useKumiai();
  const { toast } = useToast();

  const form = useForm<PerusahaanFormData>({
    resolver: zodResolver(perusahaanSchema),
    defaultValues: {
      nama: perusahaan?.nama || '',
      kode: perusahaan?.kode || '',
      alamat: perusahaan?.alamat || '',
      telepon: perusahaan?.telepon || '',
      email: perusahaan?.email || '',
      bidang_usaha: perusahaan?.bidang_usaha || '',
      kapasitas: perusahaan?.kapasitas || 0,
      tanggal_kerjasama: perusahaan?.tanggal_kerjasama || '',
      kumiai_id: perusahaan?.kumiai_id || kumiaiId || '',
    },
  });

  const onSubmit = async (data: PerusahaanFormData) => {
    try {
      console.log('Submitting perusahaan form:', data);
      
      const submitData = {
        nama: data.nama,
        kode: data.kode,
        email: data.email || null,
        alamat: data.alamat || null,
        telepon: data.telepon || null,
        bidang_usaha: data.bidang_usaha || null,
        kapasitas: data.kapasitas || 0,
        tanggal_kerjasama: data.tanggal_kerjasama || null,
        kumiai_id: data.kumiai_id,
      };

      if (perusahaan) {
        await updatePerusahaan({ 
          id: perusahaan.id, 
          data: submitData 
        });
        toast({
          title: "Berhasil",
          description: "Perusahaan berhasil diperbarui"
        });
      } else {
        await createPerusahaan(submitData);
        toast({
          title: "Berhasil", 
          description: "Perusahaan berhasil ditambahkan"
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting perusahaan form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive"
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {perusahaan ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan *</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama perusahaan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Perusahaan *</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kode perusahaan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="kumiai_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kumiai *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!!kumiaiId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kumiai" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {kumiai?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nama} - {item.kode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea placeholder="Masukkan alamat perusahaan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="bidang_usaha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bidang Usaha</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan bidang usaha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kapasitas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapasitas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggal_kerjasama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kerjasama</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : (perusahaan ? 'Perbarui' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
