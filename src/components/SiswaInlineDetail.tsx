
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, User, Calendar, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { Siswa } from "@/hooks/useSiswa";
import { SiswaDetailSections } from "./SiswaDetailSections";

interface SiswaInlineDetailProps {
  siswa: Siswa;
  onClose: () => void;
}

export function SiswaInlineDetail({ siswa, onClose }: SiswaInlineDetailProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Diterima': return 'secondary';
      case 'Proses': return 'outline';
      case 'Ditolak': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <TableRow className="bg-blue-50 border-l-4 border-blue-500">
      <TableCell colSpan={8} className="p-6">
        {/* Updated layout: Opsi moved to left sidebar, CV form expanded to right */}
        <div className="flex gap-6">
          {/* Left sidebar with profile completion and options */}
          <div className="w-80 flex-shrink-0 space-y-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">Detail Siswa</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Kelengkapan Profil */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Kelengkapan Profil</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Data Pribadi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Data Pendidikan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Data Pengalaman Kerja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Data Keluarga Yang Bisa Dihubungi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Data Keluarga di Indonesia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Data Keluarga/Saudara/Teman di Jepang</span>
                </div>
              </div>
            </div>

            {/* Opsi buttons */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Opsi</h4>
              <div className="space-y-2">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Ubah Data Pribadi
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  + Tambah Pendidikan
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  + Tambah Pengalaman Kerja
                </Button>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Ubah Keluarga Yang Bisa Dihubungi
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  + Tambah Keluarga di Indonesia
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  + Tambah Keluarga/Saudara/Teman di Jepang
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  + Tambah Attachment
                </Button>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Hapus Data
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Verified Now
                </Button>
                <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">
                  Print CV
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - expanded biodata CV form */}
          <div className="flex-1 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
              <Avatar className="w-20 h-20">
                <AvatarImage src={siswa.foto_url || undefined} alt={siswa.nama} />
                <AvatarFallback>
                  <User className="w-10 h-10 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold">履歴書</h2>
                  <h3 className="text-xl font-semibold">BIODATA - CV</h3>
                </div>
                <p className="text-center text-gray-600 mb-2">NIK: {siswa.nik}</p>
                <div className="text-center">
                  <Badge variant={getStatusBadgeVariant(siswa.status)} className="text-sm">
                    ({siswa.status === 'Aktif' ? 'SUDAH BERANGKAT' : siswa.status}) {siswa.nama}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Biodata table format */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">Nama 氏名</TableCell>
                    <TableCell className="w-1/4">: {siswa.nama}</TableCell>
                    <TableCell className="font-medium w-1/4">Umur 年齢</TableCell>
                    <TableCell className="w-1/4">: {siswa.umur || '-'} Tahun</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Lahir 生年月日</TableCell>
                    <TableCell>: {formatDate(siswa.tanggal_lahir)}</TableCell>
                    <TableCell className="font-medium">Status Pernikahan 配偶者</TableCell>
                    <TableCell>: {siswa.status_pernikahan || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jenis Kelamin 性別</TableCell>
                    <TableCell>: {siswa.jenis_kelamin || '-'}</TableCell>
                    <TableCell className="font-medium">No Telp 電話番号</TableCell>
                    <TableCell>: {siswa.telepon || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tempat Lahir 出生地</TableCell>
                    <TableCell>: {siswa.tempat_lahir || '-'}</TableCell>
                    <TableCell className="font-medium"></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/2">Alamat Rumah 本国の住所地</TableCell>
                    <TableCell className="font-medium w-1/2">Agama 宗教</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>: {siswa.alamat || '-'}</TableCell>
                    <TableCell>: {siswa.agama || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Detail Sections */}
            <SiswaDetailSections siswa={siswa} />

            {/* Metadata */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="font-medium text-gray-900 mb-3">Metadata</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <label className="font-medium">Dibuat pada</label>
                  <p>{formatDate(siswa.created_at)}</p>
                </div>
                <div>
                  <label className="font-medium">Terakhir diperbarui</label>
                  <p>{formatDate(siswa.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
