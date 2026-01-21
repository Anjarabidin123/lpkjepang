
-- Add missing fields to siswa table for complete biodata
ALTER TABLE public.siswa 
ADD COLUMN tempat_lahir TEXT,
ADD COLUMN tinggi_badan INTEGER,
ADD COLUMN berat_badan INTEGER,
ADD COLUMN ukuran_sepatu INTEGER,
ADD COLUMN golongan_darah TEXT,
ADD COLUMN status_pernikahan TEXT DEFAULT 'Belum Menikah',
ADD COLUMN agama TEXT,
ADD COLUMN hobi TEXT,
ADD COLUMN visi TEXT,
ADD COLUMN target_gaji TEXT,
ADD COLUMN pengalaman_jepang TEXT,
ADD COLUMN skill_bahasa_jepang TEXT;

-- Add address fields to siswa_kontak_keluarga for emergency contact
ALTER TABLE public.siswa_kontak_keluarga
ADD COLUMN rt_rw TEXT,
ADD COLUMN kelurahan TEXT,
ADD COLUMN kecamatan TEXT,
ADD COLUMN kab_kota TEXT,
ADD COLUMN provinsi TEXT,
ADD COLUMN kode_pos TEXT;
