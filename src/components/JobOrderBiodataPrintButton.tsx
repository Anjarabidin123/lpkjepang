
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobOrder } from '@/types/jobOrder';
import { JobOrderBiodataPdfService } from '@/services/jobOrderBiodataPdfService';
import { useJobOrderPeserta } from '@/hooks/useJobOrderPeserta';
import { FileText } from "lucide-react";

interface JobOrderBiodataPrintButtonProps {
  jobOrder: JobOrder;
}

export function JobOrderBiodataPrintButton({ jobOrder }: JobOrderBiodataPrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const { peserta, isLoading: isLoadingParticipants } = useJobOrderPeserta(jobOrder.id);

  const handlePrintBiodata = async () => {
    if (!peserta || peserta.length === 0) {
      toast({
        title: "Error",
        description: "Tidak ada peserta untuk dicetak biodatanya",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting biodata PDF generation for participants:', peserta.length);
      await JobOrderBiodataPdfService.generateBiodataPdf(jobOrder, peserta);
      
      toast({
        title: "Berhasil",
        description: `PDF biodata untuk ${peserta.length} peserta berhasil dibuat dan diunduh`,
      });
    } catch (error) {
      console.error('Error generating biodata PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat PDF biodata",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePrintBiodata}
      disabled={isGenerating || isLoadingParticipants || !peserta || peserta.length === 0}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <FileText className="w-4 h-4" />
      {isGenerating ? 'Membuat PDF Biodata...' : 'Print Biodata CV'}
    </Button>
  );
}
