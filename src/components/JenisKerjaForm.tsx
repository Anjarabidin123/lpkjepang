
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJenisKerja } from "@/hooks/useJenisKerja";
import type { Tables } from "@/integrations/supabase/types";

const jenisKerjaSchema = z.object({
  nama: z.string().min(1, "Nama jenis kerja harus diisi"),
  kode: z.string().min(1, "Kode jenis kerja harus diisi"),
  deskripsi: z.string().optional(),
  kategori: z.string().optional(),
  tingkat_kesulitan: z.enum(["Rendah", "Menengah", "Tinggi"]).default("Menengah"),
  syarat_pendidikan: z.string().optional(),
  gaji_minimal: z.number().min(0, "Gaji minimal harus positif").optional(),
  gaji_maksimal: z.number().min(0, "Gaji maksimal harus positif").optional(),
  total_posisi: z.number().min(0, "Total posisi harus positif").optional(),
});

type JenisKerjaFormData = z.infer<typeof jenisKerjaSchema>;

interface JenisKerjaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jenisKerja?: Tables<'jenis_kerja'>;
}

export function JenisKerjaForm({ open, onOpenChange, jenisKerja }: JenisKerjaFormProps) {
  const { createJenisKerja, updateJenisKerja, isCreating, isUpdating } = useJenisKerja();

  const form = useForm<JenisKerjaFormData>({
    resolver: zodResolver(jenisKerjaSchema),
    defaultValues: {
      nama: jenisKerja?.nama || "",
      kode: jenisKerja?.kode || "",
      deskripsi: jenisKerja?.deskripsi || "",
      kategori: jenisKerja?.kategori || "",
      tingkat_kesulitan: jenisKerja?.tingkat_kesulitan || "Menengah",
      syarat_pendidikan: jenisKerja?.syarat_pendidikan || "",
      gaji_minimal: jenisKerja?.gaji_minimal || 0,
      gaji_maksimal: jenisKerja?.gaji_maksimal || 0,
      total_posisi: jenisKerja?.total_posisi || 0,
    },
  });

  const onSubmit = (data: JenisKerjaFormData) => {
    const formData = {
      nama: data.nama,
      kode: data.kode,
      tingkat_kesulitan: data.tingkat_kesulitan,
      deskripsi: data.deskripsi || null,
      kategori: data.kategori || null,
      syarat_pendidikan: data.syarat_pendidikan || null,
      gaji_minimal: data.gaji_minimal || null,
      gaji_maksimal: data.gaji_maksimal || null,
      total_posisi: data.total_posisi || 0,
    };

    if (jenisKerja) {
      updateJenisKerja({ id: jenisKerja.id, data: formData });
    } else {
      createJenisKerja(formData);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {jenisKerja ? "Edit Jenis Kerja" : "Tambah Jenis Kerja"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nama">Nama Jenis Kerja</Label>
              <Input
                id="nama"
                {...form.register("nama")}
                placeholder="Masukkan nama jenis kerja"
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-500">{form.formState.errors.nama.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="kode">Kode Jenis Kerja</Label>
              <Input
                id="kode"
                {...form.register("kode")}
                placeholder="Masukkan kode jenis kerja"
              />
              {form.formState.errors.kode && (
                <p className="text-sm text-red-500">{form.formState.errors.kode.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              {...form.register("deskripsi")}
              placeholder="Masukkan deskripsi jenis kerja"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                {...form.register("kategori")}
                placeholder="Masukkan kategori"
              />
            </div>
            <div>
              <Label htmlFor="tingkat_kesulitan">Tingkat Kesulitan</Label>
              <Select
                value={form.watch("tingkat_kesulitan")}
                onValueChange={(value) => form.setValue("tingkat_kesulitan", value as "Rendah" | "Menengah" | "Tinggi")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rendah">Rendah</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Tinggi">Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="syarat_pendidikan">Syarat Pendidikan</Label>
            <Input
              id="syarat_pendidikan"
              {...form.register("syarat_pendidikan")}
              placeholder="Masukkan syarat pendidikan"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gaji_minimal">Gaji Minimal</Label>
              <Input
                id="gaji_minimal"
                type="number"
                {...form.register("gaji_minimal", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="gaji_maksimal">Gaji Maksimal</Label>
              <Input
                id="gaji_maksimal"
                type="number"
                {...form.register("gaji_maksimal", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="total_posisi">Total Posisi</Label>
              <Input
                id="total_posisi"
                type="number"
                {...form.register("total_posisi", { valueAsNumber: true })}
                placeholder="0"
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
              {jenisKerja ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
