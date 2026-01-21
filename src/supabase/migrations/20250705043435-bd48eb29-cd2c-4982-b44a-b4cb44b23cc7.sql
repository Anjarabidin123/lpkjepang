
-- Drop all demografi-related tables and their dependencies

-- First, drop the new centralized tables if they exist
DROP TABLE IF EXISTS public.demografi_regencies CASCADE;
DROP TABLE IF EXISTS public.demografi_provinces CASCADE;
DROP TABLE IF EXISTS public.demografi_countries CASCADE;

-- Drop the legacy demografi tables
DROP TABLE IF EXISTS public.kabupaten CASCADE;
DROP TABLE IF EXISTS public.kabupaten_indonesia CASCADE;
DROP TABLE IF EXISTS public.provinsi CASCADE;
DROP TABLE IF EXISTS public.provinsi_indonesia CASCADE;

-- Remove any foreign key references in siswa_magang table
ALTER TABLE public.siswa_magang DROP COLUMN IF EXISTS provinsi_id CASCADE;
ALTER TABLE public.siswa_magang DROP COLUMN IF EXISTS kabupaten_id CASCADE;

-- Remove any foreign key references in siswa table
ALTER TABLE public.siswa DROP COLUMN IF EXISTS provinsi_indonesia_id CASCADE;
ALTER TABLE public.siswa DROP COLUMN IF EXISTS kabupaten_indonesia_id CASCADE;

-- Drop any related enums if they exist
DROP TYPE IF EXISTS status_umum CASCADE;
