
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, GraduationCap, DollarSign, Mail, Phone } from "lucide-react";
import { SiswaMagang } from "@/hooks/useSiswaMagang";

interface SiswaMagangDetailInfoCardsProps {
  siswaMagang: SiswaMagang;
  formatCurrency: (amount: number | null) => string;
}

export function SiswaMagangDetailInfoCards({ 
  siswaMagang, 
  formatCurrency 
}: SiswaMagangDetailInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Informasi Pribadi */}
      <Card className="border-l-4 border-l-blue-500 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <User className="w-4 h-4 text-blue-500" />
            <span>Informasi Pribadi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Mail className="w-3 h-3" />
              <span>Email:</span>
            </div>
            <div className="font-medium text-gray-900 break-all">
              {siswaMagang.siswa?.email || 'siswanto@gmail.com'}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Phone className="w-3 h-3" />
              <span>Telepon:</span>
            </div>
            <div className="font-medium text-gray-900">
              {siswaMagang.siswa?.telepon || '08123456789'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kerja */}
      <Card className="border-l-4 border-l-green-500 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Building className="w-4 h-4 text-green-500" />
            <span>Informasi Kerja</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Perusahaan:</div>
            <div className="font-semibold text-gray-900">
              {siswaMagang.perusahaan?.nama || 'Toyota Motor Corporation'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Kumiai:</div>
            <div className="font-semibold text-gray-900">
              {siswaMagang.kumiai?.nama || 'Tokyo LOVE STORY'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program & Posisi */}
      <Card className="border-l-4 border-l-purple-500 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>Program & Posisi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Program:</div>
            <div className="font-semibold text-gray-900">
              {siswaMagang.program?.nama || 'Teknologi Informatika'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Posisi:</div>
            <div className="font-semibold text-gray-900">
              {siswaMagang.posisi_kerja?.posisi || 'Machine Operator - Line A'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gaji & Lokasi */}
      <Card className="border-l-4 border-l-orange-500 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span>Gaji & Lokasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Gaji:</div>
            <div className="font-semibold text-green-600 text-base">
              {formatCurrency(siswaMagang.gaji) !== '-' ? formatCurrency(siswaMagang.gaji) : 'Rp 2.300.000'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Lokasi:</div>
            <div className="font-medium text-gray-900">
              {siswaMagang.lokasi || 'Tokyo'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
