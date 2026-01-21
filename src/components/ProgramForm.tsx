import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProgram } from "@/hooks/useProgram";
import type { Tables } from "@/integrations/supabase/types";

const programSchema = z.object({
  nama: z.string().min(1, "Nama program harus diisi"),
  kode: z.string().min(1, "Kode program harus diisi"),
  deskripsi: z.string().optional(),
  durasi: z.number().min(1, "Durasi harus lebih dari 0").optional(),
  satuan_durasi: z.string().default("bulan"),
  biaya: z.number().min(0, "Biaya harus positif").optional(),
  kuota: z.number().min(1, "Kuota harus lebih dari 0").optional(),
  peserta_terdaftar: z.number().min(0, "Peserta terdaftar harus positif").optional(),
  status: z.enum(["Aktif", "Nonaktif"]).default("Aktif"),
  tanggal_mulai: z.string().optional(),
  tanggal_selesai: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program?: Tables<'program'>;
}

export function ProgramForm({ open, onOpenChange, program }: ProgramFormProps) {
  const { createProgram, updateProgram, isCreating, isUpdating } = useProgram();

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      nama: program?.nama || "",
      kode: program?.kode || "",
      deskripsi: program?.deskripsi || "",
      tanggal_mulai: program?.tanggal_mulai || "",
      tanggal_selesai: program?.tanggal_selesai || "",
      durasi: program?.durasi || 0,
      satuan_durasi: program?.satuan_durasi || "bulan",
      kuota: program?.kuota || 0,
      biaya: program?.biaya || 0,
    },
  });

  const onSubmit = (data: ProgramFormData) => {
    const formData = {
      nama: data.nama,
      kode: data.kode,
      satuan_durasi: data.satuan_durasi,
      status: data.status,
      deskripsi: data.deskripsi || null,
      durasi: data.durasi || null,
      biaya: data.biaya || null,
      kuota: data.kuota || null,
      peserta_terdaftar: data.peserta_terdaftar || 0,
      tanggal_mulai: data.tanggal_mulai || null,
      tanggal_selesai: data.tanggal_selesai || null,
    };

    if (program) {
      updateProgram({ id: program.id, data: formData });
    } else {
      createProgram(formData);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {program ? "Edit Program" : "Tambah Program"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nama">Nama Program</Label>
              <Input
                id="nama"
                {...form.register("nama")}
                placeholder="Masukkan nama program"
              />
              {form.formState.errors.nama && (
                <p className="text-sm text-red-500">{form.formState.errors.nama.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="kode">Kode Program</Label>
              <Input
                id="kode"
                {...form.register("kode")}
                placeholder="Masukkan kode program"
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
              placeholder="Masukkan deskripsi program"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="durasi">Durasi</Label>
              <Input
                id="durasi"
                type="number"
                {...form.register("durasi", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="satuan_durasi">Satuan Durasi</Label>
              <Select
                value={form.watch("satuan_durasi")}
                onValueChange={(value) => form.setValue("satuan_durasi", value)}
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
            <div>
              <Label htmlFor="biaya">Biaya</Label>
              <Input
                id="biaya"
                type="number"
                {...form.register("biaya", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="peserta_terdaftar">Peserta Terdaftar</Label>
              <Input
                id="peserta_terdaftar"
                type="number"
                {...form.register("peserta_terdaftar", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
              <Input
                id="tanggal_mulai"
                type="date"
                {...form.register("tanggal_mulai")}
              />
            </div>
            <div>
              <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
              <Input
                id="tanggal_selesai"
                type="date"
                {...form.register("tanggal_selesai")}
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
              {program ? "Update" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
