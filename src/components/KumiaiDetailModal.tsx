
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  Edit,
  X
} from 'lucide-react';
import { Kumiai } from '@/hooks/useKumiai';
import { formatDate } from '@/lib/formatDate';

interface KumiaiDetailModalProps {
  kumiai: Kumiai | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (kumiai: Kumiai) => void;
}

export function KumiaiDetailModal({ kumiai, isOpen, onClose, onEdit }: KumiaiDetailModalProps) {
  if (!kumiai) return null;

  const handleEdit = () => {
    onEdit(kumiai);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            Detail Kumiai
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleEdit} size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">{kumiai.nama}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Kode: {kumiai.kode}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telepon</p>
                    <p className="text-gray-900">{kumiai.telepon || '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900">{kumiai.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alamat</p>
                    <p className="text-gray-900">{kumiai.alamat || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Person In Charge (PIC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nama PIC</p>
                    <p className="text-gray-900">{kumiai.pic_nama || '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telepon PIC</p>
                    <p className="text-gray-900">{kumiai.pic_telepon || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                Informasi Bisnis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {kumiai.jumlah_perusahaan || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Jumlah Perusahaan
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Tanggal Kerjasama
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(kumiai.tanggal_kerjasama)}
                  </div>
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
                  <p className="text-gray-900">{formatDate(kumiai.created_at)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Terakhir diupdate:</p>
                  <p className="text-gray-900">{formatDate(kumiai.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
