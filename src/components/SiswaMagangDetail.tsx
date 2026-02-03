
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { SiswaMagang } from "@/hooks/useSiswaMagang";
import { SiswaMagangDetailProfileHeader } from "@/components/SiswaMagangDetailProfileHeader";
import { SiswaMagangDetailScheduleCard } from "@/components/SiswaMagangDetailScheduleCard";
import { SiswaMagangDetailInfoCards } from "@/components/SiswaMagangDetailInfoCards";
import { SiswaMagangDetailMetadata } from "@/components/SiswaMagangDetailMetadata";

interface SiswaMagangDetailProps {
  siswaMagang: SiswaMagang;
  onClose: () => void;
}

export function SiswaMagangDetail({ siswaMagang, onClose }: SiswaMagangDetailProps) {
  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Selesai': return 'secondary';
      case 'Dipulangkan': return 'destructive';
      case 'Cuti': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-7xl max-h-[90vh] animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b shrink-0">
          <CardTitle className="text-xl font-bold">Detail Siswa Magang</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <ScrollArea className="flex-1">
          <CardContent className="p-6 space-y-6">
            {/* Main Profile Header with Schedule Card - Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Profile Header - Takes 3/5 of the width */}
              <div className="lg:col-span-3">
                <SiswaMagangDetailProfileHeader 
                  siswaMagang={siswaMagang}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </div>
              
              {/* Schedule Card - Takes 2/5 of the width */}
              <div className="lg:col-span-2">
                <SiswaMagangDetailScheduleCard 
                  siswaMagang={siswaMagang}
                  formatDate={formatDate}
                  getStatusBadgeVariant={getStatusBadgeVariant}
                />
              </div>
            </div>

            {/* Four Column Information Grid */}
            <SiswaMagangDetailInfoCards 
              siswaMagang={siswaMagang}
              formatCurrency={formatCurrency}
            />

            {/* Additional Details Section */}
            <SiswaMagangDetailMetadata 
              siswaMagang={siswaMagang}
              formatDate={formatDate}
            />
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
