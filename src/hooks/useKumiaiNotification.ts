
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useKumiaiNotification() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendInvoiceToKumiai = async (invoiceData: any) => {
    setLoading(true);
    try {
      console.log('Sending invoice to Kumiai:', invoiceData);

      // Call the edge function to send notification to Kumiai
      const { data, error } = await supabase.functions.invoke('send-invoice-to-kumiai', {
        body: {
          invoiceId: invoiceData.id,
          kumiaiId: invoiceData.kumiai_id,
          invoiceNumber: invoiceData.nomor_invoice,
          amount: invoiceData.nominal,
          dueDate: invoiceData.tanggal_jatuh_tempo,
          invoiceDate: invoiceData.tanggal_invoice,
          kumiai: invoiceData.kumiai,
          items: invoiceData.invoice_items
        }
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Invoice berhasil dikirim ke akun Kumiai",
      });

      return data;
    } catch (error) {
      console.error('Error sending invoice to Kumiai:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim invoice ke Kumiai",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendInvoiceToKumiai,
    loading,
  };
}
