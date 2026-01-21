
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Mail, 
  Printer, 
  Send,
  Edit
} from 'lucide-react';
import { useKumiaiNotification } from '@/hooks/useKumiaiNotification';

interface InvoiceQuickActionsProps {
  invoice: any;
  onEdit: (id: string) => void;
}

export function InvoiceQuickActions({ invoice, onEdit }: InvoiceQuickActionsProps) {
  const { sendInvoiceToKumiai, loading } = useKumiaiNotification();

  const handleSendToKumiai = async () => {
    try {
      await sendInvoiceToKumiai(invoice);
    } catch (error) {
      console.error('Failed to send invoice to Kumiai:', error);
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked for invoice:', invoice.id);
    onEdit(invoice.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleEditClick} 
          className="w-full justify-start"
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Invoice
        </Button>
        
        <Button 
          onClick={handleSendToKumiai}
          disabled={loading}
          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Mengirim...' : 'Kirim ke Kumiai'}
        </Button>
        
        <Button className="w-full justify-start" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        
        <Button className="w-full justify-start" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Kirim Email
        </Button>
        
        <Button className="w-full justify-start" variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
