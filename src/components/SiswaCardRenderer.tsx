
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Phone, Mail, Calendar, MapPin, School, Camera, Ruler, Target, Cigarette, Wine } from "lucide-react";

interface SiswaCardRendererProps {
  item: any;
  onEdit: (item: any) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
}

export function SiswaCardRenderer({ 
  item, 
  onEdit, 
  onView 
}: SiswaCardRendererProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Proses': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Selesai': return 'bg-primary/10 text-primary border-primary/20';
      case 'Nonaktif': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="flat-card group hover:bg-muted/30 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border border-border">
                <AvatarImage 
                  src={item.foto_siswa || item.foto_url || ''} 
                  alt={`Foto ${item.nama}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {item.nama?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              {(item.foto_siswa || item.foto_url) && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background flex items-center justify-center">
                  <Camera className="w-1.5 h-1.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item.nama}</h3>
              <p className="text-sm text-muted-foreground">{item.nik}</p>
            </div>
          </div>
          <Badge className={getStatusBadgeVariant(item.status)}>
            {item.status}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-green-600" />
            <span className="text-muted-foreground">Telepon:</span>
            <span className="font-medium text-foreground">{item.telepon || '-'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground text-xs">{item.email || '-'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-muted-foreground">Umur:</span>
            <span className="font-medium text-foreground">{calculateAge(item.tanggal_lahir)} tahun</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-muted-foreground">Provinsi:</span>
            <span className="font-medium text-foreground">{item.provinsi_name || '-'}</span>
          </div>
        </div>

        {/* Ukuran Fisik */}
        <div className="border-t border-border pt-3 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Ruler className="w-4 h-4 mr-1 text-muted-foreground" />
            Ukuran Fisik
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Sepatu:</span>
              <p>{item.ukuran_sepatu || '-'}</p>
            </div>
            <div>
              <span className="font-medium">Kepala:</span>
              <p>{item.ukuran_kepala || '-'}</p>
            </div>
            <div>
              <span className="font-medium">Pinggang:</span>
              <p>{item.ukuran_pinggang || '-'}</p>
            </div>
          </div>
        </div>

        {/* Kebiasaan */}
        <div className="border-t border-border pt-3 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Cigarette className="w-4 h-4 mr-1 text-muted-foreground" />
            Kebiasaan
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium flex items-center">
                <Cigarette className="w-3 h-3 mr-1" />
                Merokok:
              </span>
              <p>Sekarang: {item.merokok_sekarang || '-'}</p>
              <p>Jepang: {item.merokok_jepang || '-'}</p>
            </div>
            <div>
              <span className="font-medium flex items-center">
                <Wine className="w-3 h-3 mr-1" />
                Sake:
              </span>
              <p>{item.minum_sake || '-'}</p>
            </div>
          </div>
        </div>

        {/* Target dan Tujuan */}
        <div className="border-t border-border pt-3 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1 text-muted-foreground" />
            Target & Tujuan
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Tujuan Jepang:</span>
              <p className="truncate" title={item.tujuan_jepang}>
                {item.tujuan_jepang || '-'}
              </p>
            </div>
            <div>  
              <span className="font-medium">Target Menabung:</span>
              <p className="truncate" title={item.target_menabung}>
                {item.target_menabung || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Pendidikan */}
        <div className="border-t border-border pt-3 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <School className="w-4 h-4 mr-1 text-muted-foreground" />
            Pendidikan
          </h4>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{item.nama_sekolah || '-'}</p>
            <p>{item.jurusan || '-'}</p>
            <p>{item.tahun_masuk_sekolah} - {item.tahun_lulus_sekolah}</p>
          </div>
        </div>

        {/* Action buttons at the bottom */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(item)}
            className="flat-button hover:bg-primary/10 hover:text-primary hover:border-primary/20"
          >
            <Eye className="w-4 h-4" />
            <span>Detail</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flat-button hover:bg-primary/10 hover:text-primary hover:border-primary/20"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
