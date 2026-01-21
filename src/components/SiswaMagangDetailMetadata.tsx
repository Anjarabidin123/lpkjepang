
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { SiswaMagang } from "@/hooks/useSiswaMagang";

interface SiswaMagangDetailMetadataProps {
  siswaMagang: SiswaMagang;
  formatDate: (dateString: string | null) => string;
}

export function SiswaMagangDetailMetadata({ 
  siswaMagang, 
  formatDate 
}: SiswaMagangDetailMetadataProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Detail Pekerjaan */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span>Detail Pekerjaan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Jenis Kerja:</span>
            <span className="font-medium text-gray-900 text-right">
              {siswaMagang.jenis_kerja?.nama || '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Kode Posisi:</span>
            <span className="font-medium text-gray-900">
              {siswaMagang.posisi_kerja?.kode || '-'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Dibuat:</span>
            <span className="text-gray-600">{formatDate(siswaMagang.created_at || null)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Diperbarui:</span>
            <span className="text-gray-600">{formatDate(siswaMagang.updated_at || null)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
