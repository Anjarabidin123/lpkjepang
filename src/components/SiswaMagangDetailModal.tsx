
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign,
  Building2,
  Edit,
  X
} from 'lucide-react';
import { formatDate } from '@/lib/formatDate';

interface SiswaMagangDetailModalProps {
  siswaMagang: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (siswaMagang: any) => void;
}

export function SiswaMagangDetailModal({ siswaMagang, isOpen, onClose, onEdit }: SiswaMagangDetailModalProps) {
  if (!siswaMagang) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(siswaMagang);
      onClose();
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'Aktif':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'Selesai':
        return <Badge className="bg-blue-100 text-blue-800">Selesai</Badge>;
      case 'Cuti':
        return <Badge className="bg-yellow-100 text-yellow-800">Cuti</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            Detail Siswa Magang
          </DialogTitle>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button onClick={handleEdit} size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {siswaMagang.siswa?.nama || 'Nama tidak tersedia'}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    NIK: {siswaMagang.siswa?.nik || '-'}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(siswaMagang.status_magang)}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Work Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  Informasi Kerja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lokasi</p>
                    <p className="text-gray-900">{siswaMagang.lokasi || '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gaji</p>
                    <p className="text-gray-900">{formatCurrency(siswaMagang.gaji)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Periode Kerja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tanggal Mulai</p>
                    <p className="text-gray-900">
                      {siswaMagang.tanggal_mulai_kerja ? formatDate(siswaMagang.tanggal_mulai_kerja) : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tanggal Pulang</p>
                    <p className="text-gray-900">
                      {siswaMagang.tanggal_pulang_kerja ? formatDate(siswaMagang.tanggal_pulang_kerja) : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-600">Email:</p>
                  <p className="text-gray-900">{siswaMagang.siswa?.email || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Telepon:</p>
                  <p className="text-gray-900">{siswaMagang.siswa?.telepon || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-600">Dibuat pada:</p>
                  <p className="text-gray-900">
                    {siswaMagang.created_at ? formatDate(siswaMagang.created_at) : '-'}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Terakhir diupdate:</p>
                  <p className="text-gray-900">
                    {siswaMagang.updated_at ? formatDate(siswaMagang.updated_at) : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
