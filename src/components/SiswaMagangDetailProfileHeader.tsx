
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Camera } from "lucide-react";
import { SiswaMagang } from "@/hooks/useSiswaMagang";

interface SiswaMagangDetailProfileHeaderProps {
  siswaMagang: SiswaMagang;
  getStatusBadgeVariant: (status: string | null) => "default" | "secondary" | "destructive" | "outline";
}

export function SiswaMagangDetailProfileHeader({
  siswaMagang,
  getStatusBadgeVariant
}: SiswaMagangDetailProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border h-full">
      <div className="relative">
        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
          <AvatarImage
            src={siswaMagang.avatar_url || ''}
            alt={`Foto ${siswaMagang.siswa?.nama || 'Siswa'}`}
            className="object-cover"
            onError={(e) => {
              console.log('Profile avatar failed to load');
              (e.target as HTMLImageElement).src = '';
            }}
          />
          <AvatarFallback className="bg-blue-500 text-white text-xl">
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        {siswaMagang.avatar_url && (
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
            <Camera className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{siswaMagang.siswa?.nama || '-'}</h2>
        <p className="text-gray-600 mb-2">NIK: {siswaMagang.siswa?.nik || '-'}</p>
        <div className="flex items-center space-x-4">
          <Badge variant={getStatusBadgeVariant(siswaMagang.status_magang)} className="px-3 py-1">
            {siswaMagang.status_magang || 'Aktif'}
          </Badge>
          <span className="text-sm text-gray-500">ID: {siswaMagang.id.toString().slice(0, 8)}...</span>
          {siswaMagang.avatar_url && (
            <span className="text-sm text-green-600 font-medium">
              📷 Foto tersedia
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
