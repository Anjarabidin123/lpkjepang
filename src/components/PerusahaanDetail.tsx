
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";

// Use the proper type that includes joined data from the hook
type PerusahaanWithKumiai = {
  id: string;
  nama: string;
  kode: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  bidang_usaha: string | null;
  kapasitas: number | null;
  status: string | null;
  tanggal_kerjasama: string | null;
  kumiai: {
    id: string;
    nama: string;
    kode: string;
  } | null;
};

interface PerusahaanDetailProps {
  perusahaan: PerusahaanWithKumiai;
  onEdit: () => void;
  onBack: () => void;
}

export function PerusahaanDetail({ perusahaan, onEdit, onBack }: PerusahaanDetailProps) {
  const getStatusBadge = (status: string) => {
    return status === "Aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detail Perusahaan</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div>
          <h3 className="font-semibold text-sm text-gray-500 mb-1">Alamat</h3>
          <p>{perusahaan.alamat || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Telepon</h3>
            <p>{perusahaan.telepon || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Email</h3>
            <p>{perusahaan.email || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kumiai</h3>
            <p>{perusahaan.kumiai?.nama || '-'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Bidang Usaha</h3>
            <p>{perusahaan.bidang_usaha || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Kapasitas</h3>
            <p>{perusahaan.kapasitas}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Status</h3>
            <Badge className={getStatusBadge(perusahaan.status || 'Nonaktif')}>
              {perusahaan.status}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Kerjasama</h3>
            <p>{perusahaan.tanggal_kerjasama || '-'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
