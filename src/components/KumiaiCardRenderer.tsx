
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Building2, Users, Phone, Mail, Calendar } from "lucide-react";

interface KumiaiCardRendererProps {
  item: any;
  onEdit: (item: any) => void;
  onView: (item: any) => void;
  onDelete: (id: string) => void;
}

export function KumiaiCardRenderer({ 
  item, 
  onEdit, 
  onView 
}: KumiaiCardRendererProps) {
  const getStatusBadge = (status: string) => {
    return status === "Aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{item.nama}</h3>
              <p className="text-sm text-gray-500">Kode: {item.kode}</p>
            </div>
          </div>
          <Badge className={getStatusBadge(item.status)}>
            {item.status}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">PIC:</span>
            <span className="font-medium">{item.pic_nama || '-'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600">Telepon:</span>
            <span className="font-medium">{item.pic_telepon || '-'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-xs">{item.email || '-'}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-gray-600">Kerjasama:</span>
            <span className="font-medium">{formatDate(item.tanggal_kerjasama)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          <div>
            <span className="font-medium">Jumlah Perusahaan:</span>
            <p className="text-lg font-bold text-blue-600">{item.jumlah_perusahaan || 0}</p>
          </div>
          <div>
            <span className="font-medium">Alamat:</span>
            <p className="truncate">{item.alamat || '-'}</p>
          </div>
        </div>

        {/* Action buttons at the bottom */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(item)}
            className="flex items-center space-x-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          >
            <Eye className="w-4 h-4" />
            <span>Detail</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex items-center space-x-1 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
