import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { SiswaMagangDetailProfileHeader } from "@/components/SiswaMagangDetailProfileHeader";
import { SiswaMagangDetailScheduleCard } from "@/components/SiswaMagangDetailScheduleCard";
import { SiswaMagangDetailInfoCards } from "@/components/SiswaMagangDetailInfoCards";
import { SiswaMagangDetailMetadata } from "@/components/SiswaMagangDetailMetadata";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaRegulerInlineDetailProps {
  siswaMagang: SiswaMagang;
  onBack: () => void;
  onEdit: () => void;
}

export function SiswaRegulerInlineDetail({ siswaMagang, onBack, onEdit }: SiswaRegulerInlineDetailProps) {
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <CardTitle>Detail Siswa Magang</CardTitle>
        </div>
        <Button onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
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
    </Card>
  );
}
