
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/formatCurrency';

interface PembayaranFormValidationProps {
  selectedKewajiban: any;
  nominalInput: string;
  errors: Record<string, string>;
}

export function PembayaranFormValidation({ 
  selectedKewajiban, 
  nominalInput, 
  errors 
}: PembayaranFormValidationProps) {
  if (!selectedKewajiban || !nominalInput) return null;

  const nominalValue = parseFloat(nominalInput.replace(/[^\d]/g, '')) || 0;
  const nominalWajib = selectedKewajiban.nominal_wajib || 0;
  const sisaKewajiban = selectedKewajiban.sisa_kewajiban || 0;
  
  const isOverpayment = nominalValue > sisaKewajiban;
  const isUnderpayment = nominalValue < sisaKewajiban && nominalValue > 0;
  const isExactPayment = nominalValue === sisaKewajiban;
  const isFullPayment = nominalValue >= nominalWajib;

  return (
    <div className="space-y-3">
      {/* Payment Status Alert */}
      {isExactPayment && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Pembayaran tepat untuk melunasi kewajiban ini
          </AlertDescription>
        </Alert>
      )}

      {isOverpayment && (
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Pembayaran melebihi sisa kewajiban sebesar {formatIDRCurrency(nominalValue - sisaKewajiban)}
          </AlertDescription>
        </Alert>
      )}

      {isUnderpayment && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Sisa kewajiban setelah pembayaran: {formatIDRCurrency(sisaKewajiban - nominalValue)}
          </AlertDescription>
        </Alert>
      )}

      {isFullPayment && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Status akan otomatis berubah menjadi "Lunas"
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {Object.values(errors)[0]}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
