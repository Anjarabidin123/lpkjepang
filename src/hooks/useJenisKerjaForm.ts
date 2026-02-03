
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { JenisKerja } from "@/types";

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

export type JenisKerjaFormData = z.infer<typeof jenisKerjaSchema>;

export function useJenisKerjaForm(jenisKerja?: JenisKerja) {
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

  const formatDataForSubmission = (data: JenisKerjaFormData) => {
    return {
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
  };

  return {
    form,
    formatDataForSubmission,
  };
}
