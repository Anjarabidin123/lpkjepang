
import { siswaTable, siswaMagangTable } from '@/lib/localStorage/tables';
import type { CreateSiswaData } from '@/hooks/siswa/types';
import type { CreateSiswaMagangData } from '@/types/siswaMagang';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

class ImportService {
  async importSiswa(data: Partial<CreateSiswaData>[]): Promise<ImportResult> {
    console.log('Starting siswa import process to localStorage with', data.length, 'records');
    
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const item of data) {
      try {
        const cleanData = this.cleanSiswaData(item);
        
        if (!cleanData.nama || !cleanData.nik) {
          result.failed++;
          result.errors.push(`Nama dan NIK wajib diisi`);
          continue;
        }

        const existingSiswa = siswaTable.getOneByField('nik', cleanData.nik);

        if (existingSiswa) {
          result.failed++;
          result.errors.push(`NIK ${cleanData.nik} sudah ada dalam database`);
          continue;
        }

        siswaTable.create(cleanData);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Error processing: ${(error as Error).message}`);
      }
    }

    console.log('Siswa import completed:', result);
    return result;
  }

  async importSiswaMagang(data: Partial<CreateSiswaMagangData>[]): Promise<ImportResult> {
    console.log('Starting siswa magang import process to localStorage with', data.length, 'records');
    
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const item of data) {
      try {
        const cleanData = this.cleanSiswaMagangData(item);
        
        if (!cleanData.siswa_id) {
          result.failed++;
          result.errors.push(`Siswa ID wajib diisi`);
          continue;
        }

        siswaMagangTable.create(cleanData);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Error processing: ${(error as Error).message}`);
      }
    }

    console.log('Siswa magang import completed:', result);
    return result;
  }

  private cleanSiswaData(item: Partial<CreateSiswaData>): CreateSiswaData {
    const cleanText = (value: any): string | null => {
      if (!value) return null;
      const str = String(value);
      return str.replace('...[cut]', '').trim() || null;
    };

    const cleanNumber = (value: any): number | null => {
      if (!value) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    const cleanBoolean = (value: any): boolean | null => {
      if (value === null || value === undefined) return null;
      const str = String(value).toLowerCase();
      return str === 'ya' || str === 'true' || str === '1';
    };

    const cleanDate = (value: any): string | null => {
      if (!value) return null;
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    };

    return {
      nama: cleanText(item.nama) || '',
      nik: cleanText(item.nik) || '',
      jenis_kelamin: item.jenis_kelamin || null,
      tempat_lahir: cleanText(item.tempat_lahir),
      tanggal_lahir: cleanDate(item.tanggal_lahir),
      umur: cleanNumber(item.umur),
      alamat: cleanText(item.alamat),
      telepon: cleanText(item.telepon),
      email: cleanText(item.email),
      tinggi_badan: cleanNumber(item.tinggi_badan),
      berat_badan: cleanNumber(item.berat_badan),
      ukuran_sepatu: cleanNumber(item.ukuran_sepatu),
      ukuran_kepala: cleanNumber(item.ukuran_kepala),
      ukuran_pinggang: cleanNumber(item.ukuran_pinggang),
      golongan_darah: cleanText(item.golongan_darah),
      mata_kanan: cleanText(item.mata_kanan),
      mata_kiri: cleanText(item.mata_kiri),
      buta_warna: cleanBoolean(item.buta_warna),
      warna_buta: cleanText(item.warna_buta),
      penggunaan_tangan: cleanText(item.penggunaan_tangan),
      merokok_sekarang: cleanText(item.merokok_sekarang),
      merokok_jepang: cleanText(item.merokok_jepang),
      minum_sake: cleanText(item.minum_sake),
      agama: cleanText(item.agama),
      status_pernikahan: cleanText(item.status_pernikahan),
      hobi: cleanText(item.hobi),
      minat: cleanText(item.minat),
      visi: cleanText(item.visi),
      bakat_khusus: cleanText(item.bakat_khusus),
      kelebihan: cleanText(item.kelebihan),
      kekurangan: cleanText(item.kekurangan),
      pengalaman: cleanText(item.pengalaman),
      nama_sekolah: cleanText(item.nama_sekolah),
      jurusan: cleanText(item.jurusan),
      tahun_masuk_sekolah: cleanNumber(item.tahun_masuk_sekolah),
      tahun_lulus_sekolah: cleanNumber(item.tahun_lulus_sekolah),
      skill_bahasa_jepang: cleanText(item.skill_bahasa_jepang),
      pengalaman_jepang: cleanText(item.pengalaman_jepang),
      target_gaji: cleanText(item.target_gaji),
      target_menabung: cleanText(item.target_menabung),
      tujuan_jepang: cleanText(item.tujuan_jepang),
      tanggal_masuk_lpk: cleanDate(item.tanggal_masuk_lpk),
      lama_belajar: cleanText(item.lama_belajar),
      status: item.status || 'Proses',
      is_available: cleanBoolean(item.is_available) ?? true,
      tanggal_daftar: cleanDate(item.tanggal_daftar) || new Date().toISOString().split('T')[0],
      catatan: cleanText(item.catatan),
      foto_siswa: cleanText(item.foto_siswa),
      foto_url: cleanText(item.foto_url),
      lpk_mitra_id: item.lpk_mitra_id || null,
      demografi_province_id: item.demografi_province_id || null,
      demografi_regency_id: item.demografi_regency_id || null,
      program_id: item.program_id || null,
      posisi_kerja_id: item.posisi_kerja_id || null,
    };
  }

  private cleanSiswaMagangData(item: Partial<CreateSiswaMagangData>): CreateSiswaMagangData {
    const cleanText = (value: any): string | null => {
      if (!value) return null;
      const str = String(value);
      return str.replace('...[cut]', '').trim() || null;
    };

    const cleanNumber = (value: any): number | null => {
      if (!value) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    const cleanDate = (value: any): string | null => {
      if (!value) return null;
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    };

    return {
      siswa_id: item.siswa_id || null,
      kumiai_id: item.kumiai_id || null,
      perusahaan_id: item.perusahaan_id || null,
      program_id: item.program_id || null,
      jenis_kerja_id: item.jenis_kerja_id || null,
      posisi_kerja_id: item.posisi_kerja_id || null,
      lpk_mitra_id: item.lpk_mitra_id || null,
      demografi_province_id: item.demografi_province_id || null,
      demografi_regency_id: item.demografi_regency_id || null,
      lokasi: cleanText(item.lokasi),
      tanggal_mulai_kerja: cleanDate(item.tanggal_mulai_kerja),
      tanggal_pulang_kerja: cleanDate(item.tanggal_pulang_kerja),
      gaji: cleanNumber(item.gaji),
      status_magang: cleanText(item.status_magang) || 'Aktif',
      avatar_url: cleanText(item.avatar_url),
    };
  }
}

export const importService = new ImportService();
