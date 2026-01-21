
-- Ensure job_orders table exists with proper structure
DO $$ 
BEGIN
    -- Check if table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_orders') THEN
        -- Create job_orders table
        CREATE TABLE public.job_orders (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            nama_job_order text NOT NULL,
            kumiai_id uuid REFERENCES public.kumiai(id) ON DELETE SET NULL,
            jenis_kerja_id uuid REFERENCES public.jenis_kerja(id) ON DELETE SET NULL,
            catatan text,
            status public.status_umum DEFAULT 'Aktif'::public.status_umum,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view job orders" ON public.job_orders
            FOR SELECT USING (auth.role() = 'authenticated');

        CREATE POLICY "Users can insert job orders" ON public.job_orders
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Users can update job orders" ON public.job_orders
            FOR UPDATE USING (auth.role() = 'authenticated');

        CREATE POLICY "Users can delete job orders" ON public.job_orders
            FOR DELETE USING (auth.role() = 'authenticated');

        -- Create updated_at trigger function if not exists
        CREATE OR REPLACE FUNCTION public.handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = timezone('utc'::text, now());
            RETURN NEW;
        END;
        $$ language plpgsql;

        -- Create trigger for updated_at
        CREATE TRIGGER handle_job_orders_updated_at
            BEFORE UPDATE ON public.job_orders
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();

        RAISE NOTICE 'job_orders table created successfully';
    ELSE
        RAISE NOTICE 'job_orders table already exists';
    END IF;
END $$;
