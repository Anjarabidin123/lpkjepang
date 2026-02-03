
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useKumiai } from "@/hooks/useKumiai";
import type { Kumiai } from "@/types";

type KumiaiFormData = {
  nama: string;
  kode: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  pic_nama: string | null;
  pic_telepon: string | null;
  jumlah_perusahaan: number | null;
  tanggal_kerjasama: string | null;
  status: 'Aktif' | 'Nonaktif';
};

interface KumiaiInlineFormProps {
  kumiai?: Kumiai;
  onCancel: () => void;
  onSuccess: () => void;
}

export function KumiaiInlineForm({ kumiai, onCancel, onSuccess }: KumiaiInlineFormProps) {
  const { createKumiai, updateKumiai, isCreating, isUpdating } = useKumiai();

  const { register, handleSubmit, formState: { errors } } = useForm<KumiaiFormData>({
    defaultValues: {
      nama: kumiai?.nama || '',
      kode: kumiai?.kode || '',
      alamat: kumiai?.alamat || null,
      telepon: kumiai?.telepon || null,
      email: kumiai?.email || null,
      pic_nama: kumiai?.pic_nama || null,
      pic_telepon: kumiai?.pic_telepon || null,
      jumlah_perusahaan: kumiai?.jumlah_perusahaan || null,
      tanggal_kerjasama: kumiai?.tanggal_kerjasama || null,
      status: 'Aktif',
    }
  });

  const onSubmit = (data: KumiaiFormData) => {
    if (kumiai) {
      updateKumiai({ id: kumiai.id, ...data });
    } else {
      createKumiai(data);
    }
    onSuccess();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {kumiai ? "Edit Kumiai" : "Tambah Kumiai"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nama">Nama Kumiai *</Label>
              <Input
                id="nama"
                {...register("nama", { required: "Nama wajib diisi" })}
                className={errors.nama ? "border-red-500" : ""}
              />
              {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>}
            </div>
            <div>
              <Label htmlFor="kode">Kode *</Label>
              <Input
                id="kode"
                {...register("kode", { required: "Kode wajib diisi" })}
                className={errors.kode ? "border-red-500" : ""}
              />
              {errors.kode && <p className="text-red-500 text-sm mt-1">{errors.kode.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              {...register("alamat")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                id="telepon"
                {...register("telepon")}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pic_nama">PIC Nama</Label>
              <Input
                id="pic_nama"
                {...register("pic_nama")}
              />
            </div>
            <div>
              <Label htmlFor="pic_telepon">PIC Telepon</Label>
              <Input
                id="pic_telepon"
                {...register("pic_telepon")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jumlah_perusahaan">Jumlah Perusahaan</Label>
              <Input
                id="jumlah_perusahaan"
                type="number"
                min="0"
                {...register("jumlah_perusahaan", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="tanggal_kerjasama">Tanggal Kerjasama</Label>
              <Input
                id="tanggal_kerjasama"
                type="date"
                {...register("tanggal_kerjasama")}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
