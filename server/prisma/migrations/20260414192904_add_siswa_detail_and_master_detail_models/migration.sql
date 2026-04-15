-- CreateTable
CREATE TABLE "siswa_keluarga_indonesia" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "hubungan" TEXT,
    "umur" INTEGER,
    "pekerjaan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_keluarga_indonesia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_keluarga_jepang" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "hubungan" TEXT,
    "umur" INTEGER,
    "pekerjaan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_keluarga_jepang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_kontak_keluarga" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "rt_rw" TEXT,
    "kelurahan" TEXT,
    "kecamatan" TEXT,
    "kab_kota" TEXT,
    "provinsi" TEXT,
    "kode_pos" TEXT,
    "no_hp" TEXT,
    "penghasilan_per_bulan" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_kontak_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_pengalaman_kerja" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "nama_perusahaan" TEXT NOT NULL,
    "jenis_pekerjaan" TEXT,
    "tahun_masuk" INTEGER,
    "tahun_keluar" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pengalaman_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_pendidikan" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "jenjang_pendidikan" TEXT NOT NULL,
    "nama_institusi" TEXT NOT NULL,
    "jurusan" TEXT,
    "tahun_masuk" INTEGER,
    "tahun_lulus" INTEGER,
    "nilai_akhir" TEXT,
    "sertifikat_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pendidikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_kerjas" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "kategori" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_kerjas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posisi_kerjas" (
    "id" SERIAL NOT NULL,
    "kode" TEXT,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "perusahaan_id" INTEGER,
    "jenis_kerja_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posisi_kerjas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profil_lpks" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "pemilik" TEXT,
    "alamat" TEXT,
    "no_telp" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profil_lpks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jenis_kerjas_kode_key" ON "jenis_kerjas"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "posisi_kerjas_kode_key" ON "posisi_kerjas"("kode");

-- AddForeignKey
ALTER TABLE "siswa_keluarga_indonesia" ADD CONSTRAINT "siswa_keluarga_indonesia_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_keluarga_jepang" ADD CONSTRAINT "siswa_keluarga_jepang_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_kontak_keluarga" ADD CONSTRAINT "siswa_kontak_keluarga_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_pengalaman_kerja" ADD CONSTRAINT "siswa_pengalaman_kerja_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_pendidikan" ADD CONSTRAINT "siswa_pendidikan_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posisi_kerjas" ADD CONSTRAINT "posisi_kerjas_perusahaan_id_fkey" FOREIGN KEY ("perusahaan_id") REFERENCES "perusahaans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posisi_kerjas" ADD CONSTRAINT "posisi_kerjas_jenis_kerja_id_fkey" FOREIGN KEY ("jenis_kerja_id") REFERENCES "jenis_kerjas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
