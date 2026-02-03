
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useKumiaiNotification() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const sendInvoiceToKumiai = async (invoice: any) => {
        try {
            setLoading(true);
            console.log('Simulating sending invoice to Kumiai via API:', invoice.id);

            // In a real implementation with Laravel, we would call an endpoint like:
            // await fetch(`${endpoints.invoices}/${invoice.id}/send`, { method: 'POST' });

            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Berhasil",
                description: "Invoice telah dikirim ke Kumiai",
            });
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Terjadi kesalahan saat mengirim invoice",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        sendInvoiceToKumiai,
        loading
    };
}
