
import { siswaTable, siswaMagangTable } from '@/lib/localStorage/tables';
import type { Siswa } from '@/hooks/siswa/types';

export const siswaService = {
  async fetchAll(): Promise<Siswa[]> {
    console.log('Fetching siswa data from localStorage...');
    const data = siswaTable.getAll();
    console.log('Siswa data fetched successfully:', data?.length || 0, 'records');
    return data as Siswa[];
  },

  async fetchAvailableForMagang(): Promise<Siswa[]> {
    console.log('Fetching available siswa for magang from localStorage...');
    
    // Get siswa IDs that are already in siswa_magang
    const existingMagang = siswaMagangTable.getAll();
    const existingSiswaIds = existingMagang
      .map((item: any) => item.siswa_id)
      .filter(Boolean);
    console.log('Existing siswa in magang:', existingSiswaIds.length);

    // Get all siswa and filter
    const allSiswa = siswaTable.getAll() as Siswa[];
    const availableSiswa = allSiswa.filter(
      siswa => siswa.is_available === true && !existingSiswaIds.includes(siswa.id)
    );

    console.log('Available siswa for magang fetched successfully:', availableSiswa.length, 'records');
    return availableSiswa;
  },

  async fetchById(id: string): Promise<Siswa | null> {
    if (!id) return null;
    const data = siswaTable.getById(id);
    return data as Siswa | null;
  },

  async create(newSiswa: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>): Promise<Siswa> {
    console.log('Creating siswa with data:', newSiswa);
    
    const formattedData = {
      ...newSiswa,
      tanggal_lahir: newSiswa.tanggal_lahir || null,
      tempat_lahir: newSiswa.tempat_lahir || null,
      foto_siswa: newSiswa.foto_siswa || null,
      foto_url: newSiswa.foto_url || null,
      alamat: newSiswa.alamat || null,
      telepon: newSiswa.telepon || null,
      email: newSiswa.email || null,
      golongan_darah: newSiswa.golongan_darah || null,
      status_pernikahan: newSiswa.status_pernikahan || 'Belum Menikah',
      agama: newSiswa.agama || null,
      hobi: newSiswa.hobi || null,
      visi: newSiswa.visi || null,
      target_gaji: newSiswa.target_gaji || null,
      pengalaman_jepang: newSiswa.pengalaman_jepang || null,
      skill_bahasa_jepang: newSiswa.skill_bahasa_jepang || null,
      program_id: newSiswa.program_id || null,
      posisi_kerja_id: newSiswa.posisi_kerja_id || null,
      lpk_mitra_id: newSiswa.lpk_mitra_id || null,
      tanggal_daftar: newSiswa.tanggal_daftar || new Date().toISOString().split('T')[0],
      nama_sekolah: newSiswa.nama_sekolah || null,
      jurusan: newSiswa.jurusan || null,
      mata_kanan: newSiswa.mata_kanan || null,
      mata_kiri: newSiswa.mata_kiri || null,
      merokok_sekarang: newSiswa.merokok_sekarang || null,
      merokok_jepang: newSiswa.merokok_jepang || null,
      minum_sake: newSiswa.minum_sake || null,
      penggunaan_tangan: newSiswa.penggunaan_tangan || 'Kanan',
      buta_warna: newSiswa.buta_warna || false,
      warna_buta: newSiswa.warna_buta || null,
      bakat_khusus: newSiswa.bakat_khusus || null,
      kelebihan: newSiswa.kelebihan || null,
      kekurangan: newSiswa.kekurangan || null,
      pengalaman: newSiswa.pengalaman || null,
      minat: newSiswa.minat || null,
      tujuan_jepang: newSiswa.tujuan_jepang || null,
      target_menabung: newSiswa.target_menabung || null,
      tanggal_masuk_lpk: newSiswa.tanggal_masuk_lpk || null,
      lama_belajar: newSiswa.lama_belajar || null,
      catatan: newSiswa.catatan || null,
      is_available: newSiswa.is_available !== undefined ? newSiswa.is_available : true,
      demografi_province_id: newSiswa.demografi_province_id || null,
      demografi_regency_id: newSiswa.demografi_regency_id || null,
      status: newSiswa.status || 'Proses'
    };
    
    const data = siswaTable.create(formattedData);
    console.log('Siswa created successfully:', data);
    return data as Siswa;
  },

  async update({ id, ...updates }: Partial<Siswa> & { id: string }): Promise<Siswa> {
    console.log('Updating siswa:', id, updates);
    
    if (!id) {
      throw new Error('ID is required for update');
    }

    // Format the updates to handle null values properly
    const formattedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value === '') {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    const data = siswaTable.update(id, formattedUpdates);
    
    if (!data) {
      throw new Error('Failed to update siswa: Not found');
    }
    
    console.log('Siswa updated successfully:', data);
    return data as Siswa;
  },

  async delete(id: string): Promise<string> {
    console.log('Deleting siswa:', id);
    
    if (!id) {
      throw new Error('ID is required for delete');
    }
    
    const success = siswaTable.delete(id);
    
    if (!success) {
      throw new Error('Failed to delete siswa');
    }
    
    console.log('Siswa deleted successfully:', id);
    return id;
  }
};
