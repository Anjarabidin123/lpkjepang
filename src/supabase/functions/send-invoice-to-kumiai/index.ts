
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceNotificationRequest {
  invoiceId: string;
  kumiaiId: string;
  invoiceNumber: string;
  amount: number;
  dueDate?: string;
  invoiceDate: string;
  kumiai: any;
  items: any[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      invoiceId, 
      kumiaiId, 
      invoiceNumber, 
      amount, 
      dueDate, 
      invoiceDate, 
      kumiai, 
      items 
    }: InvoiceNotificationRequest = await req.json();

    console.log('Processing invoice notification:', {
      invoiceId,
      kumiaiId,
      invoiceNumber,
      amount
    });

    // Create a notification record for the Kumiai
    const notificationData = {
      kumiai_id: kumiaiId,
      invoice_id: invoiceId,
      notification_type: 'invoice_sent',
      title: `Invoice Baru - ${invoiceNumber}`,
      message: `Invoice dengan nomor ${invoiceNumber} telah dibuat dengan total ${amount} Yen. Silakan periksa detail pembayaran.`,
      data: {
        invoiceNumber,
        amount,
        dueDate,
        invoiceDate,
        kumiaiName: kumiai?.nama,
        itemCount: items?.length || 0
      },
      status: 'sent',
      sent_at: new Date().toISOString()
    };

    // Insert notification into database
    const { data: notification, error: notificationError } = await supabase
      .from('kumiai_notifications')
      .insert([notificationData])
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue even if notification creation fails
    }

    console.log('Invoice notification sent successfully:', {
      invoiceId,
      notificationId: notification?.id
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invoice berhasil dikirim ke Kumiai',
        notificationId: notification?.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in send-invoice-to-kumiai function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
