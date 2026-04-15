-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_system_role" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT,
    "action" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswas" (
    "id" SERIAL NOT NULL,
    "nik" TEXT,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Proses',
    "jenis_kelamin" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "tempat_lahir" TEXT,
    "alamat" TEXT,
    "no_hp" TEXT,
    "demografi_province_id" INTEGER,
    "demografi_regency_id" INTEGER,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kumiais" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "email" TEXT,
    "no_telp" TEXT,
    "jumlah_perusahaan" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kumiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perusahaans" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "kumiai_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perusahaans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT,
    "durasi_bulanan" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_orders" (
    "id" SERIAL NOT NULL,
    "nomor" TEXT,
    "nama_job_order" TEXT NOT NULL,
    "kumiai_id" INTEGER,
    "perusahaan_id" INTEGER,
    "program_id" INTEGER,
    "kuota" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_magangs" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "tanggal_mulai_kerja" TIMESTAMP(3),
    "tanggal_pulang_kerja" TIMESTAMP(3),
    "status_magang" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_magangs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demografi_provinces" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demografi_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demografi_regencies" (
    "id" SERIAL NOT NULL,
    "demografi_province_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demografi_regencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SiswaToJobOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SiswaToJobOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "siswas_nik_key" ON "siswas"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "siswas_email_key" ON "siswas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "siswas_user_id_key" ON "siswas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kumiais_kode_key" ON "kumiais"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "programs_kode_key" ON "programs"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "job_orders_nomor_key" ON "job_orders"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_magangs_siswa_id_key" ON "siswa_magangs"("siswa_id");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE INDEX "_SiswaToJobOrder_B_index" ON "_SiswaToJobOrder"("B");

-- AddForeignKey
ALTER TABLE "siswas" ADD CONSTRAINT "siswas_demografi_province_id_fkey" FOREIGN KEY ("demografi_province_id") REFERENCES "demografi_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswas" ADD CONSTRAINT "siswas_demografi_regency_id_fkey" FOREIGN KEY ("demografi_regency_id") REFERENCES "demografi_regencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswas" ADD CONSTRAINT "siswas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perusahaans" ADD CONSTRAINT "perusahaans_kumiai_id_fkey" FOREIGN KEY ("kumiai_id") REFERENCES "kumiais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_orders" ADD CONSTRAINT "job_orders_kumiai_id_fkey" FOREIGN KEY ("kumiai_id") REFERENCES "kumiais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_orders" ADD CONSTRAINT "job_orders_perusahaan_id_fkey" FOREIGN KEY ("perusahaan_id") REFERENCES "perusahaans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_orders" ADD CONSTRAINT "job_orders_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_magangs" ADD CONSTRAINT "siswa_magangs_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demografi_regencies" ADD CONSTRAINT "demografi_regencies_demografi_province_id_fkey" FOREIGN KEY ("demografi_province_id") REFERENCES "demografi_provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiswaToJobOrder" ADD CONSTRAINT "_SiswaToJobOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "job_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiswaToJobOrder" ADD CONSTRAINT "_SiswaToJobOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "siswas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
