
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePerusahaan } from "@/hooks/usePerusahaan";
import { useJenisKerja } from "@/hooks/useJenisKerja";
import { usePosisiKerja } from "@/hooks/usePosisiKerja";
import type { Tables } from "@/integrations/supabase/types";

const posisiKerjaSchema = z.object({
  kode: z.string().min(1, "Kode posisi kerja harus diisi"),
  perusahaan_id: z.string().min(1, "Perusahaan harus dipilih"),
  jenis_kerja_id: z.string().min(1, "Jenis kerja harus dipilih"),
  posisi: z.string().min(1, "Posisi harus diisi"),
  lokasi: z.string().optional(),
  kuota: z.number().min(1, "Kuota harus lebih dari 0").optional(),
  terisi: z.number().min(0, "Terisi harus positif").optional(),
  gaji_harian: z.number().min(0, "Gaji harian harus positif").optional(),
  jam_kerja: z.string().optional(),
  persyaratan: z.string().optional(),
  status: z.enum(["Buka", "Penuh", "Tutup"]).default("Buka"),
  tanggal_buka: z.string().optional(),
  tanggal_tutup: z.string().optional(),
});

type PosisiKerjaFormData = z.infer<typeof posisiKerjaSchema>;

interface PosisiKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posisiKerja?: Tables<'posisi_kerja'>;
}

export function PosisiKerjaForm({ open, onOpenChange, posisiKerja }: PosisiKerjaFormProps) {
  const { perusahaan } = usePerusahaan();
  const { jenisKerja } = useJenisKerja();
  const { createPosisiKerja, updatePosisiKerja, isCreating, isUpdating } = usePosisiKerja();

  const form = useForm<PosisiKerjaFormData>({
    resolver: zodResolver(posisiKerjaSchema),
    defaultValues: {
      kode: posisiKerja?.kode || "",
      perusahaan_id: posisiKerja?.perusahaan_id || "",
      jenis_kerja_id: posisiKerja?.jenis_kerja_id || "",
      posisi: posisiKerja?.posisi || "",
      lokasi: posisiKerja?.lokasi || "",
      kuota: posisiKerja?.kuota || 0,
      terisi: posisiKerja?.terisi || 0,
      gaji_harian: posisiKerja?.gaji_harian || 0,
      jam_kerja: posisiKerja?.jam_kerja || "",
      persyaratan: posisiKerja?.persyaratan || "",
      status: posisiKerja?.status || "Buka",
      tanggal_buka: posisiKerja?.tanggal_buka || "",
      tanggal_tutup: posisiKerja?.tanggal_tutup || "",
    },
  });

  const onSubmit = (data: PosisiKerjaFormData) => {
    const formData = {
      kode: data.kode,
      posisi: data.posisi,
      perusahaan_id: data.perusahaan_id,
      jenis_kerja_id: data.jenis_kerja_id,
      status: data.status,
      lokasi: data.lokasi || null,
      kuota: data.kuota || null,
      terisi: data.terisi || 0,
      gaji_harian: data.gaji_harian || null,
      jam_kerja: data.jam_kerja || null,
      persyaratan: data.persyaratan || null,
      tanggal_buka: data.tanggal_buka || null,
      tanggal_tutup: data.tanggal_tutup || null,
    };

    if (posisiKerja) {
      updatePosisiKerja({ id: posisiKerja.id, data: formData });
    } else {
      createPosisiKerja(formData);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {posisiKerja ? "Edit Posisi Kerja" : "Tambah Posisi Kerja"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kode">Kode Posisi</Label>
              <Input
                id="kode"
                {...form.register("kode")}
                placeholder="Masukkan kode posisi"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-500">{form.formState.errors.kode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="posisi">Nama Posisi</Label>
              <Input
                id="posisi"
                {...form.register("posisi")}
                placeholder="Masukkan nama posisi"
              />
              {form.formState.errors.posisi && (
                <p className="text-sm text-red-500">{form.formState.errors.posisi.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="perusahaan_id">Perusahaan</Label>
              <Select
                value={form.watch("perusahaan_id")}
                onValueChange={(value) => form.setValue("perusahaan_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih perusahaan" />
                </SelectTrigger>
                <SelectContent>
                  {perusahaan?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.perusahaan_id && (
                <p className="text-sm text-red-500">{form.formState.errors.perusahaan_id.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="jenis_kerja_id">Jenis Kerja</Label>
              <Select
                value={form.watch("jenis_kerja_id")}
                onValueChange={(value) => form.setValue("jenis_kerja_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kerja" />
                </SelectTrigger>
                <SelectContent>
                  {jenisKerja?.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.jenis_kerja_id && (
                <p className="text-sm text-red-500">{form.formState.errors.jenis_kerja_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="lokasi">Lokasi</Label>
            <Input
              id="lokasi"
              {...form.register("lokasi")}
              placeholder="Masukkan lokasi kerja"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="kuota">Kuota</Label>
              <Input
                id="kuota"
                type="number"
                {...form.register("kuota", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="terisi">Terisi</Label>
              <Input
                id="terisi"
                type="number"
                {...form.register("terisi", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="gaji_harian">Gaji Harian</Label>
              <Input
                id="gaji_harian"
                type="number"
                {...form.register("gaji_harian", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="jam_kerja">Jam Kerja</Label>
              <Input
                id="jam_kerja"
                {...form.register("jam_kerja")}
                placeholder="8 jam/hari"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="persyaratan">Persyaratan</Label>
            <Textarea
              id="persyaratan"
              {...form.register("persyaratan")}
              placeholder="Masukkan persyaratan"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as "Buka" | "Penuh" | "Tutup")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buka">Buka</SelectItem>
                  <SelectItem value="Penuh">Penuh</SelectItem>
                  <SelectItem value="Tutup">Tutup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tanggal_buka">Tanggal Buka</Label>
              <Input
                id="tanggal_buka"
                type="date"
                {...form.register("tanggal_buka")}
              />
            </div>
            <div>
              <Label htmlFor="tanggal_tutup">Tanggal Tutup</Label>
              <Input
                id="tanggal_tutup"
                type="date"
                {...form.register("tanggal_tutup")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {posisiKerja ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
