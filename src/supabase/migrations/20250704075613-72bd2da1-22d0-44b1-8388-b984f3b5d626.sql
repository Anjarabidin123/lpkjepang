-- Create function to automatically sync internal payments to arus_kas
CREATE OR REPLACE FUNCTION public.sync_internal_payment_to_arus_kas()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.arus_kas (
      jenis, 
      kategori, 
      nominal, 
      tanggal, 
      keterangan, 
      referensi_tabel, 
      referensi_id
    ) VALUES (
      'Pemasukan',
      'Internal Payment',
      NEW.nominal,
      NEW.tanggal_pembayaran,
      COALESCE((SELECT nama_item FROM public.item_pembayaran WHERE id = NEW.item_pembayaran_id), 'Pembayaran') || 
      CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      'internal_payments',
      NEW.id
    );
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.arus_kas SET
      nominal = NEW.nominal,
      tanggal = NEW.tanggal_pembayaran,
      keterangan = COALESCE((SELECT nama_item FROM public.item_pembayaran WHERE id = NEW.item_pembayaran_id), 'Pembayaran') || 
                   CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      updated_at = now()
    WHERE referensi_tabel = 'internal_payments' AND referensi_id = NEW.id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'internal_payments' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for internal payments sync
CREATE TRIGGER sync_internal_payment_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.internal_payments
  FOR EACH ROW
  EXECUTE FUNCTION sync_internal_payment_to_arus_kas();

-- Create function to automatically sync invoices to arus_kas
CREATE OR REPLACE FUNCTION public.sync_invoice_to_arus_kas()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.arus_kas (
      jenis, 
      kategori, 
      nominal, 
      tanggal, 
      keterangan, 
      referensi_tabel, 
      referensi_id
    ) VALUES (
      'Pemasukan',
      'Invoice',
      NEW.nominal,
      NEW.tanggal_invoice,
      'Invoice ' || NEW.nomor_invoice || 
      CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      'invoice',
      NEW.id
    );
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.arus_kas SET
      nominal = NEW.nominal,
      tanggal = NEW.tanggal_invoice,
      keterangan = 'Invoice ' || NEW.nomor_invoice || 
                   CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      updated_at = now()
    WHERE referensi_tabel = 'invoice' AND referensi_id = NEW.id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'invoice' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice sync
CREATE TRIGGER sync_invoice_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice
  FOR EACH ROW
  EXECUTE FUNCTION sync_invoice_to_arus_kas();