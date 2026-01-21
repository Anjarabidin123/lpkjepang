
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobOrder } from '@/types/jobOrder';
import { JobOrderPdfService } from '@/services/jobOrderPdfService';
import { useJobOrderPeserta } from '@/hooks/useJobOrderPeserta';
import { Printer } from "lucide-react";

interface JobOrderPrintButtonProps {
  jobOrder: JobOrder;
}

export function JobOrderPrintButton({ jobOrder }: JobOrderPrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const { data: participants, isLoading: isLoadingParticipants } = useJobOrderPeserta(jobOrder.id);

  const handlePrintPdf = async () => {
    if (!participants) {
      toast({
        title: "Error",
        description: "Data peserta belum tersedia",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting PDF generation for participants:', participants.length);
      await JobOrderPdfService.generateParticipantListPdf(jobOrder, participants);
      
      toast({
        title: "Berhasil",
        description: "PDF berhasil dibuat dan diunduh",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePrintPdf}
      disabled={isGenerating || isLoadingParticipants}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Printer className="w-4 h-4" />
      {isGenerating ? 'Membuat PDF...' : 'Print PDF'}
    </Button>
  );
}
