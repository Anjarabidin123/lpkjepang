
-- First, let's check if there are any existing unique constraints and add the missing ones

-- Add unique constraint for kabupaten_indonesia table
ALTER TABLE public.kabupaten_indonesia 
ADD CONSTRAINT kabupaten_indonesia_kode_provinsi_unique 
UNIQUE (kode, provinsi_id);

-- Add unique constraint for kabupaten table  
ALTER TABLE public.kabupaten 
ADD CONSTRAINT kabupaten_kode_provinsi_unique 
UNIQUE (kode, provinsi_id);

-- Also ensure we handle any potential duplicates by updating the sync logic
