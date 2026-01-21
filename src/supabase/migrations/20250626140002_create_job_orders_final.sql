
-- Ensure the status_umum enum exists first
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_umum') THEN
        CREATE TYPE public.status_umum AS ENUM ('Aktif', 'Nonaktif');
    END IF;
END $$;

-- Drop table if exists and recreate to ensure clean state
DROP TABLE IF EXISTS public.job_orders CASCADE;

-- Create job_orders table with proper structure
CREATE TABLE public.job_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_job_order text NOT NULL,
    kumiai_id uuid,
    jenis_kerja_id uuid,
    catatan text,
    status public.status_umum DEFAULT 'Aktif'::public.status_umum,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraints if the referenced tables exist
DO $$ 
BEGIN
    -- Add kumiai foreign key if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'kumiai') THEN
        ALTER TABLE public.job_orders 
        ADD CONSTRAINT fk_job_orders_kumiai 
        FOREIGN KEY (kumiai_id) REFERENCES public.kumiai(id) ON DELETE SET NULL;
    END IF;
    
    -- Add jenis_kerja foreign key if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jenis_kerja') THEN
        ALTER TABLE public.job_orders 
        ADD CONSTRAINT fk_job_orders_jenis_kerja 
        FOREIGN KEY (jenis_kerja_id) REFERENCES public.jenis_kerja(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view job orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can insert job orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can update job orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can delete job orders" ON public.job_orders;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view job orders" ON public.job_orders
    FOR SELECT USING (true);

CREATE POLICY "Users can insert job orders" ON public.job_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update job orders" ON public.job_orders
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete job orders" ON public.job_orders
    FOR DELETE USING (true);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS handle_job_orders_updated_at ON public.job_orders;

-- Create trigger for updated_at
CREATE TRIGGER handle_job_orders_updated_at
    BEFORE UPDATE ON public.job_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample data for testing
INSERT INTO public.job_orders (nama_job_order, catatan, status) VALUES 
('Sample Job Order 1', 'This is a test job order', 'Aktif'),
('Sample Job Order 2', 'Another test job order', 'Aktif');

-- Log success
SELECT 'job_orders table created successfully with sample data' as result;
