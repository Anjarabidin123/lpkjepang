-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assigned_to" INTEGER,
    "created_by" INTEGER,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruitment_applications" (
    "id" SERIAL NOT NULL,
    "application_number" TEXT NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "program_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'new',
    "application_date" TIMESTAMP(3) NOT NULL,
    "interview_date" TIMESTAMP(3),
    "interview_notes" TEXT,
    "score" INTEGER,
    "rejection_reason" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruitment_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_trackings" (
    "id" SERIAL NOT NULL,
    "siswa_id" INTEGER NOT NULL,
    "passport_status" TEXT NOT NULL DEFAULT 'not_started',
    "passport_expiry" TIMESTAMP(3),
    "mcu_status" TEXT NOT NULL DEFAULT 'not_started',
    "mcu_date" TIMESTAMP(3),
    "language_cert_status" TEXT NOT NULL DEFAULT 'not_started',
    "language_cert_level" TEXT,
    "coe_status" TEXT NOT NULL DEFAULT 'not_submitted',
    "coe_number" TEXT,
    "coe_issue_date" TIMESTAMP(3),
    "visa_status" TEXT NOT NULL DEFAULT 'not_applied',
    "visa_expiry" TIMESTAMP(3),
    "flight_status" TEXT NOT NULL DEFAULT 'not_booked',
    "departure_datetime" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_templates" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT,
    "template_content" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_variables" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "source_table" TEXT NOT NULL,
    "source_field" TEXT NOT NULL,
    "format_type" TEXT NOT NULL DEFAULT 'text',
    "default_value" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa_documents" (
    "id" SERIAL NOT NULL,
    "siswa_magang_id" INTEGER NOT NULL,
    "document_template_id" TEXT,
    "nama" TEXT,
    "file_path" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recruitment_applications_application_number_key" ON "recruitment_applications"("application_number");

-- CreateIndex
CREATE UNIQUE INDEX "document_templates_kode_key" ON "document_templates"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "document_variables_nama_key" ON "document_variables"("nama");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruitment_applications" ADD CONSTRAINT "recruitment_applications_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruitment_applications" ADD CONSTRAINT "recruitment_applications_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruitment_applications" ADD CONSTRAINT "recruitment_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_trackings" ADD CONSTRAINT "document_trackings_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_documents" ADD CONSTRAINT "siswa_documents_siswa_magang_id_fkey" FOREIGN KEY ("siswa_magang_id") REFERENCES "siswa_magangs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa_documents" ADD CONSTRAINT "siswa_documents_document_template_id_fkey" FOREIGN KEY ("document_template_id") REFERENCES "document_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
