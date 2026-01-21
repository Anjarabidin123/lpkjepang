
-- Create job_order_peserta table to store participants data
CREATE TABLE IF NOT EXISTS public.job_order_peserta (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_order_id uuid REFERENCES public.job_orders(id) ON DELETE CASCADE NOT NULL,
    siswa_id uuid REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Lulus', 'Tidak Lulus', 'Cadangan', 'Batal')),
    keterangan text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure unique combination of job_order and siswa
    UNIQUE(job_order_id, siswa_id)
);

-- Enable RLS
ALTER TABLE public.job_order_peserta ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view job order peserta" ON public.job_order_peserta
    FOR SELECT USING (true);

CREATE POLICY "Users can insert job order peserta" ON public.job_order_peserta
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update job order peserta" ON public.job_order_peserta
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete job order peserta" ON public.job_order_peserta
    FOR DELETE USING (true);

-- Create updated_at trigger
CREATE TRIGGER handle_job_order_peserta_updated_at
    BEFORE UPDATE ON public.job_order_peserta
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_job_order_peserta_job_order_id ON public.job_order_peserta(job_order_id);
CREATE INDEX idx_job_order_peserta_siswa_id ON public.job_order_peserta(siswa_id);

-- Log success
SELECT 'job_order_peserta table created successfully' as result;
