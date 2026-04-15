-- CreateTable
CREATE TABLE "arus_kas" (
    "id" SERIAL NOT NULL,
    "jenis" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arus_kas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_pemasukan" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pemasukan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemasukan" (
    "id" SERIAL NOT NULL,
    "kategori_id" INTEGER,
    "nama_pemasukan" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal_pemasukan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemasukan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_pengeluaran" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengeluaran" (
    "id" SERIAL NOT NULL,
    "kategori_id" INTEGER,
    "nama_pengeluaran" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal_pengeluaran" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "kumiai_id" INTEGER NOT NULL,
    "nomor_invoice" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal_invoice" TIMESTAMP(3) NOT NULL,
    "tanggal_jatuh_tempo" TIMESTAMP(3),
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "siswa_magang_id" INTEGER NOT NULL,
    "nominal_fee" DECIMAL(15,2) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pembayaran" (
    "id" SERIAL NOT NULL,
    "nama_item" TEXT NOT NULL,
    "nominal_wajib" DECIMAL(15,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_payments" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "item_pembayaran_id" INTEGER NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal_pembayaran" TIMESTAMP(3) NOT NULL,
    "metode_pembayaran" TEXT NOT NULL DEFAULT 'Tunai',
    "status" TEXT NOT NULL DEFAULT 'Lunas',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kewajiban_pembayaran" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "item_pembayaran_id" INTEGER NOT NULL,
    "nominal_wajib" DECIMAL(15,2) NOT NULL,
    "nominal_terbayar" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "sisa_kewajiban" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Belum Lunas',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kewajiban_pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_nomor_invoice_key" ON "invoices"("nomor_invoice");

-- AddForeignKey
ALTER TABLE "pemasukan" ADD CONSTRAINT "pemasukan_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_pemasukan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengeluaran" ADD CONSTRAINT "pengeluaran_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_pengeluaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_kumiai_id_fkey" FOREIGN KEY ("kumiai_id") REFERENCES "kumiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_siswa_magang_id_fkey" FOREIGN KEY ("siswa_magang_id") REFERENCES "siswa_magangs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_payments" ADD CONSTRAINT "internal_payments_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_payments" ADD CONSTRAINT "internal_payments_item_pembayaran_id_fkey" FOREIGN KEY ("item_pembayaran_id") REFERENCES "item_pembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kewajiban_pembayaran" ADD CONSTRAINT "kewajiban_pembayaran_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kewajiban_pembayaran" ADD CONSTRAINT "kewajiban_pembayaran_item_pembayaran_id_fkey" FOREIGN KEY ("item_pembayaran_id") REFERENCES "item_pembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
