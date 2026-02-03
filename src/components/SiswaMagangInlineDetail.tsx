
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, User, Calendar, MapPin, Building, GraduationCap, Briefcase, DollarSign, Phone, Mail } from "lucide-react";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaMagangInlineDetailProps {
  siswaMagang: SiswaMagang;
  onClose: () => void;
}

export function SiswaMagangInlineDetail({ siswaMagang, onClose }: SiswaMagangInlineDetailProps) {
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
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    if (!siswaMagang.tanggal_mulai_kerja || !siswaMagang.tanggal_pulang_kerja) return '-';
    
    const startDate = new Date(siswaMagang.tanggal_mulai_kerja);
    const endDate = new Date(siswaMagang.tanggal_pulang_kerja);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    if (months > 0) {
      return `${months} bulan${days > 0 ? ` ${days} hari` : ''}`;
    }
    return `${days} hari`;
  };

  return (
    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
      <TableCell colSpan={13} className="p-6">
        <div className="space-y-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-blue-900">Detail Siswa Magang</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center space-x-6 p-6 bg-white rounded-xl shadow-sm border border-blue-100">
            <Avatar className="w-20 h-20 border-4 border-blue-200">
              <AvatarImage src={siswaMagang.avatar_url || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900">{siswaMagang.siswa?.nama || '-'}</h4>
              <p className="text-gray-600 text-lg">NIK: {siswaMagang.siswa?.nik || '-'}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant={getStatusBadgeVariant(siswaMagang.status_magang)} className="text-sm px-3 py-1">
                  {siswaMagang.status_magang || 'Aktif'}
                </Badge>
                <div className="text-sm text-gray-500">
                  Durasi: {calculateDuration()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Siswa Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span>Informasi Siswa</span>
              </h5>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Nama</label>
                  <p className="font-semibold text-gray-900">{siswaMagang.siswa?.nama || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">NIK</label>
                  <p className="text-gray-700">{siswaMagang.siswa?.nik || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </label>
                  <p className="text-gray-700">{siswaMagang.siswa?.email || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>Telepon</span>
                  </label>
                  <p className="text-gray-700">{siswaMagang.siswa?.telepon || '-'}</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-green-600" />
                </div>
                <span>Informasi Perusahaan</span>
              </h5>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Kumiai</label>
                  <p className="font-semibold text-gray-900">{siswaMagang.kumiai?.nama || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Perusahaan</label>
                  <p className="text-gray-700">{siswaMagang.perusahaan?.nama || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Lokasi</span>
                  </label>
                  <p className="text-gray-700">{siswaMagang.lokasi || '-'}</p>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
                <span>Informasi Kerja</span>
              </h5>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Program</label>
                  <p className="text-gray-700">{siswaMagang.program?.nama || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Jenis Kerja</label>
                  <p className="text-gray-700">{siswaMagang.jenis_kerja?.nama || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium">Posisi Kerja</label>
                  <p className="text-gray-700">{siswaMagang.posisi_kerja?.posisi || '-'}</p>
                </div>
                <div className="flex justify-between">
                  <label className="text-gray-500 font-medium flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Gaji</span>
                  </label>
                  <p className="font-semibold text-green-600">{formatCurrency(siswaMagang.gaji)}</p>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <span>Jadwal Magang</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <label className="text-gray-500 font-medium block mb-2">Tanggal Mulai Kerja</label>
                  <p className="font-semibold text-gray-900">{formatDate(siswaMagang.tanggal_mulai_kerja)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <label className="text-gray-500 font-medium block mb-2">Tanggal Pulang Kerja</label>
                  <p className="font-semibold text-gray-900">{formatDate(siswaMagang.tanggal_pulang_kerja)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <label className="text-gray-500 font-medium block mb-2">Status Magang</label>
                  <Badge variant={getStatusBadgeVariant(siswaMagang.status_magang)} className="text-sm">
                    {siswaMagang.status_magang || 'Aktif'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-gray-600" />
                </div>
                <span>Metadata</span>
              </h5>
              <div className="space-y-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <label className="font-medium">Dibuat pada</label>
                  <p>{formatDate(siswaMagang.created_at)}</p>
                </div>
                <div className="flex justify-between">
                  <label className="font-medium">Terakhir diperbarui</label>
                  <p>{formatDate(siswaMagang.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="px-6">
              Tutup
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
