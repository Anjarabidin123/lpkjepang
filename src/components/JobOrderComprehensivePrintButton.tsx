
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobOrder } from '@/types/jobOrder';
import { JobOrderComprehensivePdfService } from '@/services/jobOrderComprehensivePdfService';
import { useJobOrderPeserta } from '@/hooks/useJobOrderPeserta';
import { Printer } from "lucide-react";

interface JobOrderComprehensivePrintButtonProps {
  jobOrder: JobOrder;
}

export function JobOrderComprehensivePrintButton({ jobOrder }: JobOrderComprehensivePrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const { data: participants, isLoading: isLoadingParticipants } = useJobOrderPeserta(jobOrder.id);

  const handlePrintComprehensive = async () => {
    if (!participants || participants.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada peserta untuk dicetak",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting comprehensive PDF generation for participants:', participants.length);
      await JobOrderComprehensivePdfService.generateComprehensivePdf(jobOrder, participants);
      
      toast({
        title: "Berhasil",
        description: `PDF lengkap dengan daftar kandidat dan biodata ${participants.length} peserta berhasil dibuat dan diunduh`,
      });
    } catch (error) {
      console.error('Error generating comprehensive PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat PDF lengkap",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePrintComprehensive}
      disabled={isGenerating || isLoadingParticipants || !participants || participants.length === 0}
      variant="default"
      size="sm"
      className="gap-2 bg-blue-600 hover:bg-blue-700"
    >
      <Printer className="w-4 h-4" />
      {isGenerating ? 'Membuat PDF Lengkap...' : 'Print PDF'}
    </Button>
  );
}
