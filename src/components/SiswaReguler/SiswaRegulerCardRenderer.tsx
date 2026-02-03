
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, User, MapPin, Calendar, DollarSign, Camera } from "lucide-react";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaRegulerCardRendererProps {
  siswaMagang: SiswaMagang[];
  onEdit: (item: SiswaMagang) => void;
  onView: (item: SiswaMagang) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

export function SiswaRegulerCardRenderer({ 
  siswaMagang,
  onEdit, 
  onView,
  onDelete,
  searchTerm
}: SiswaRegulerCardRendererProps) {
  // Filter data based on search term
  const filteredData = siswaMagang.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.siswa?.nama?.toLowerCase().includes(searchLower) ||
      item.siswa?.nik?.toLowerCase().includes(searchLower) ||
      item.lokasi?.toLowerCase().includes(searchLower) ||
      item.kumiai?.nama?.toLowerCase().includes(searchLower) ||
      item.perusahaan?.nama?.toLowerCase().includes(searchLower)
    );
  });

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
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'Tidak ada data yang sesuai' : 'Belum ada data siswa magang'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Tambah siswa magang baru untuk memulai'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {filteredData.map((item) => (
        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-200 bg-white h-full">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10 border-2 border-gray-200">
                    <AvatarImage 
                      src={item.avatar_url || ''} 
                      alt={`Foto ${item.siswa?.nama || 'Siswa'}`}
                      className="object-cover"
                      onError={(e) => {
                        console.log('Avatar image failed to load');
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  {item.avatar_url && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Camera className="w-1.5 h-1.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{item.siswa?.nama || '-'}</h3>
                  <p className="text-xs text-gray-500 truncate">{item.siswa?.nik || '-'}</p>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(item.status_magang)} className="shrink-0 text-xs">
                {item.status_magang || 'Aktif'}
              </Badge>
            </div>

            <div className="space-y-2 mb-3 flex-1">
              <div className="flex items-center space-x-2 text-xs">
                <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600">Lokasi:</span>
                <span className="font-medium truncate">{item.lokasi || '-'}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs">
                <Calendar className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-gray-600">Mulai:</span>
                <span className="font-medium">{formatDate(item.tanggal_mulai_kerja)}</span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <DollarSign className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-600">Gaji:</span>
                <span className="font-medium truncate">{formatCurrency(item.gaji)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
              <div>
                <span className="font-medium">Kumiai:</span>
                <p className="truncate text-xs">{item.kumiai?.nama || '-'}</p>
              </div>
              <div>
                <span className="font-medium">Perusahaan:</span>
                <p className="truncate text-xs">{item.perusahaan?.nama || '-'}</p>
              </div>
            </div>

            {/* Action buttons at the bottom */}
            <div className="flex justify-end space-x-1 pt-2 border-t border-gray-100 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(item)}
                className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs px-2 py-1 h-7"
              >
                <Eye className="w-3 h-3" />
                <span>Detail</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
                className="flex items-center space-x-1 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-xs px-2 py-1 h-7"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
