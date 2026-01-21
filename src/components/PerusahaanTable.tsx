
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, ChevronDown, ChevronRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiswaMagangTable } from "./SiswaMagangTable";
import { useSiswaMagang } from "@/hooks/useSiswaMagang";

interface PerusahaanTableProps {
  perusahaan: Array<{
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    bidang_usaha: string | null;
    kapasitas: number | null;
    tanggal_kerjasama: string | null;
  }>;
  onEdit?: (perusahaan: any) => void;
  onDelete?: (id: string) => void;
  onView?: (perusahaan: any) => void;
  onViewSiswaMagang?: (siswaMagang: any) => void;
  onEditSiswaMagang?: (siswaMagang: any) => void;
}

export function PerusahaanTable({ 
  perusahaan, 
  onEdit, 
  onDelete, 
  onView, 
  onViewSiswaMagang,
  onEditSiswaMagang 
}: PerusahaanTableProps) {
  const { siswaMagang, isLoading: isLoadingSiswa } = useSiswaMagang();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (perusahaanId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(perusahaanId)) {
      newExpanded.delete(perusahaanId);
    } else {
      newExpanded.add(perusahaanId);
    }
    setExpandedRows(newExpanded);
  };

  const getSiswaMagangForPerusahaan = (perusahaanId: string) => {
    return siswaMagang?.filter(siswa => siswa.perusahaan_id === perusahaanId) || [];
  };

  if (!perusahaan || perusahaan.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada perusahaan terdaftar</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Nama Perusahaan</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Bidang Usaha</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Tanggal Kerjasama</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perusahaan.map((item) => {
            const siswaMagangData = getSiswaMagangForPerusahaan(item.id);
            const isExpanded = expandedRows.has(item.id);
            
            return (
              <React.Fragment key={item.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(item.id)}
                      className="p-0 h-8 w-8"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Badge variant="outline">{item.kode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.nama}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {item.alamat || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.telepon || '-'}</div>
                      <div className="text-gray-600">{item.email || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.bidang_usaha || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.kapasitas || 0}</Badge>
                      {siswaMagangData.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {siswaMagangData.length}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.tanggal_kerjasama || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0 bg-gray-50/50">
                      <div className="p-4 border-t">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-blue-600" />
                          <h4 className="text-sm font-medium text-gray-900">
                            Siswa Magang ({siswaMagangData.length})
                          </h4>
                        </div>
                        
                        {isLoadingSiswa ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          </div>
                        ) : siswaMagangData.length > 0 ? (
                          <div className="bg-white rounded-lg border">
                            <SiswaMagangTable
                              siswaMagang={siswaMagangData}
                              onView={onViewSiswaMagang}
                              onEdit={onEditSiswaMagang}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 bg-white rounded-lg border">
                            <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm">Belum ada siswa magang di perusahaan ini</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
