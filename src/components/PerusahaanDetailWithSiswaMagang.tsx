
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SiswaMagangTable } from "./SiswaMagangTable";
import { useSiswaMagang } from "@/hooks/useSiswaMagang";

interface PerusahaanDetailProps {
  perusahaan: {
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    bidang_usaha: string | null;
    kapasitas: number | null;
    tanggal_kerjasama: string | null;
  };
  onEdit: () => void;
  onBack: () => void;
  onViewSiswaMagang?: (siswaMagang: any) => void;
  onEditSiswaMagang?: (siswaMagang: any) => void;
}

export function PerusahaanDetailWithSiswaMagang({ 
  perusahaan, 
  onEdit, 
  onBack, 
  onViewSiswaMagang,
  onEditSiswaMagang 
}: PerusahaanDetailProps) {
  const { siswaMagang, isLoading } = useSiswaMagang();

  // Filter siswa magang by perusahaan
  const siswaMagangFiltered = siswaMagang?.filter(
    (item) => item.perusahaan_id === perusahaan.id
  ) || [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <CardTitle>Detail Perusahaan</CardTitle>
        </div>
        <Button onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Perusahaan Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Nama Perusahaan</h3>
            <p className="text-lg">{perusahaan.nama}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kode Perusahaan</h3>
            <p className="text-lg">{perusahaan.kode}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Alamat</h3>
            <p className="text-sm">{perusahaan.alamat || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Telepon</h3>
            <p className="text-sm">{perusahaan.telepon || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Email</h3>
            <p className="text-sm">{perusahaan.email || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Bidang Usaha</h3>
            <p className="text-sm">{perusahaan.bidang_usaha || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kapasitas</h3>
            <p className="text-sm">{perusahaan.kapasitas || 0}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Kerjasama</h3>
            <p className="text-sm">{perusahaan.tanggal_kerjasama || '-'}</p>
          </div>
        </div>

        <Separator />

        {/* Siswa Magang Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Siswa Magang ({siswaMagangFiltered.length})
            </h4>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <SiswaMagangTable
              siswaMagang={siswaMagangFiltered}
              onView={onViewSiswaMagang}
              onEdit={onEditSiswaMagang}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
