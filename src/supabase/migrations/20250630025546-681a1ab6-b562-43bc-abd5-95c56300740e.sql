
-- Update pembayaran table to support up to 12 digits (with 2 decimal places)
-- Current: decimal(15,2) should be sufficient for 12 digits + 2 decimal places
-- But let's make sure it's optimal for Indonesian currency format

-- Check current precision and scale for pembayaran table
-- decimal(15,2) = 13 digits before decimal, 2 after = total 15 digits
-- For 12 digit numbers with 2 decimals, we need decimal(14,2) minimum
-- Let's use decimal(16,2) to be safe for future growth

ALTER TABLE public.pembayaran 
ALTER COLUMN nominal TYPE decimal(16,2);

-- Also update arus_kas table for consistency
ALTER TABLE public.arus_kas 
ALTER COLUMN nominal TYPE decimal(16,2);

-- Update invoice table for consistency  
ALTER TABLE public.invoice 
ALTER COLUMN nominal TYPE decimal(16,2);

-- Update invoice_items table for consistency
ALTER TABLE public.invoice_items 
ALTER COLUMN nominal_fee TYPE decimal(16,2);

-- Update siswa_magang table for gaji field
ALTER TABLE public.siswa_magang 
ALTER COLUMN gaji TYPE decimal(16,2);

-- Update siswa_kontak_keluarga for penghasilan_per_bulan
ALTER TABLE public.siswa_kontak_keluarga 
ALTER COLUMN penghasilan_per_bulan TYPE decimal(16,2);
