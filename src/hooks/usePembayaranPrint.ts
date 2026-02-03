
import { useToast } from '@/hooks/use-toast';
import { formatIDRCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

export function usePembayaranPrint() {
  const { toast } = useToast();

  const printReceipt = (pembayaran: any) => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked');
      }

      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Kwitansi Pembayaran</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .amount { font-size: 18px; font-weight: bold; color: #059669; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>KWITANSI PEMBAYARAN</h2>
            <p>No. ${pembayaran.id}</p>
          </div>
          
          <div class="content">
            <div class="row">
              <span>Nama Siswa:</span>
              <span><strong>${pembayaran.siswa?.nama || 'N/A'}</strong></span>
            </div>
            <div class="row">
              <span>Item Pembayaran:</span>
              <span>${pembayaran.item_pembayaran?.nama_item || 'N/A'}</span>
            </div>
            <div class="row">
              <span>Tanggal Pembayaran:</span>
              <span>${formatDate(pembayaran.tanggal_pembayaran)}</span>
            </div>
            <div class="row">
              <span>Metode Pembayaran:</span>
              <span>${pembayaran.metode_pembayaran}</span>
            </div>
            <hr>
            <div class="row">
              <span>Jumlah Dibayar:</span>
              <span class="amount">${formatIDRCurrency(pembayaran.nominal)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Dicetak pada: ${new Date().toLocaleString('en-US')}</p>
            <p>Terima kasih atas pembayaran Anda</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

      toast({
        title: "Berhasil",
        description: "Kwitansi berhasil dicetak",
      });
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast({
        title: "Error",
        description: "Gagal mencetak kwitansi",
        variant: "destructive",
      });
    }
  };

  return {
    printReceipt,
  };
}
