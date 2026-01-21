
-- Create job_orders table
CREATE TABLE IF NOT EXISTS public.job_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_job_order text NOT NULL,
    kumiai_id uuid REFERENCES public.kumiai(id) ON DELETE SET NULL,
    jenis_kerja_id uuid REFERENCES public.jenis_kerja(id) ON DELETE SET NULL,
    catatan text,
    status public.status_umum DEFAULT 'Aktif'::public.status_umum,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view job orders
CREATE POLICY "Users can view job orders" ON public.job_orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert job orders
CREATE POLICY "Users can insert job orders" ON public.job_orders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update job orders
CREATE POLICY "Users can update job orders" ON public.job_orders
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete job orders
CREATE POLICY "Users can delete job orders" ON public.job_orders
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER handle_job_orders_updated_at
    BEFORE UPDATE ON public.job_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
