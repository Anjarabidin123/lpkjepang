
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Building, Plus, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PerusahaanInlineForm } from "@/components/PerusahaanInlineForm";
import { PerusahaanDetailWithSiswaMagang } from "@/components/PerusahaanDetailWithSiswaMagang";
import { PerusahaanTable } from "@/components/PerusahaanTable";
import { SiswaMagangDetailModal } from "@/components/SiswaMagangDetailModal";
import { usePerusahaan } from "@/hooks/usePerusahaan";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Tables } from "@/integrations/supabase/types";

interface KumiaiInlineDetailProps {
  kumiai: Tables<'kumiai'> & { 
    perusahaan?: Array<{
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
  };
  onEdit: () => void;
  onBack: () => void;
}

export function KumiaiInlineDetail({ kumiai, onEdit, onBack }: KumiaiInlineDetailProps) {
  const [showPerusahaanForm, setShowPerusahaanForm] = React.useState(false);
  const [editingPerusahaan, setEditingPerusahaan] = React.useState<any | null>(null);
  const [viewingPerusahaan, setViewingPerusahaan] = React.useState<any | null>(null);
  const [viewingSiswaMagang, setViewingSiswaMagang] = React.useState<any | null>(null);
  const [showSiswaMagangModal, setShowSiswaMagangModal] = React.useState(false);
  const { createPerusahaan, updatePerusahaan, deletePerusahaan, isCreating, isUpdating, isDeleting } = usePerusahaan();
  const { toast } = useToast();

  const handleAddPerusahaan = () => {
    setShowPerusahaanForm(true);
    setEditingPerusahaan(null);
    setViewingPerusahaan(null);
  };

  const handleEditPerusahaan = (perusahaan: any) => {
    setEditingPerusahaan(perusahaan);
    setShowPerusahaanForm(true);
    setViewingPerusahaan(null);
  };

  const handleViewPerusahaan = (perusahaan: any) => {
    setViewingPerusahaan(perusahaan);
    setShowPerusahaanForm(false);
    setEditingPerusahaan(null);
  };

  const handleDeletePerusahaan = async (id: string) => {
    try {
      await deletePerusahaan(id);
    } catch (error) {
      console.error('Failed to delete perusahaan:', error);
    }
  };

  const handleClosePerusahaanForm = () => {
    setShowPerusahaanForm(false);
    setEditingPerusahaan(null);
    setViewingPerusahaan(null);
  };

  const handleSuccessPerusahaan = () => {
    setShowPerusahaanForm(false);
    setEditingPerusahaan(null);
    setViewingPerusahaan(null);
    toast({
      title: "Berhasil",
      description: editingPerusahaan ? "Perusahaan berhasil diperbarui" : "Perusahaan berhasil ditambahkan"
    });
  };

  const handleBackFromDetail = () => {
    setViewingPerusahaan(null);
  };

  const handleEditFromDetail = () => {
    if (viewingPerusahaan) {
      setEditingPerusahaan(viewingPerusahaan);
      setShowPerusahaanForm(true);
      setViewingPerusahaan(null);
    }
  };

  const handleViewSiswaMagang = (siswaMagang: any) => {
    setViewingSiswaMagang(siswaMagang);
    setShowSiswaMagangModal(true);
  };

  const handleEditSiswaMagang = (siswaMagang: any) => {
    // For now, just show a toast - you can implement Siswa Magang editing later
    toast({
      title: "Info",
      description: "Fitur edit siswa magang akan segera tersedia"
    });
  };

  const handleCloseSiswaMagangModal = () => {
    setShowSiswaMagangModal(false);
    setViewingSiswaMagang(null);
  };

  // Show perusahaan detail view
  if (viewingPerusahaan) {
    return (
      <PerusahaanDetailWithSiswaMagang
        perusahaan={viewingPerusahaan}
        onEdit={handleEditFromDetail}
        onBack={handleBackFromDetail}
        onViewSiswaMagang={handleViewSiswaMagang}
        onEditSiswaMagang={handleEditSiswaMagang}
      />
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <CardTitle>Detail Kumiai</CardTitle>
          </div>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Nama Kumiai</h3>
              <p className="text-lg">{kumiai.nama}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Kode Kumiai</h3>
              <p className="text-lg">{kumiai.kode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Alamat</h3>
              <p className="text-sm">{kumiai.alamat || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Telepon</h3>
              <p className="text-sm">{kumiai.telepon || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-sm">{kumiai.email || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Tanggal Kerjasama</h3>
              <p className="text-sm">{kumiai.tanggal_kerjasama || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">PIC</h3>
              <p className="text-sm">{kumiai.pic_nama || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Telepon PIC</h3>
              <p className="text-sm">{kumiai.pic_telepon || '-'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Building className="h-4 w-4" />
                Perusahaan ({kumiai.perusahaan?.length || 0})
              </h4>
              <Button variant="outline" size="sm" onClick={handleAddPerusahaan}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Perusahaan
              </Button>
            </div>

            <PerusahaanTable
              perusahaan={kumiai.perusahaan || []}
              onEdit={handleEditPerusahaan}
              onDelete={(id) => {
                if (window.confirm("Apakah Anda yakin ingin menghapus perusahaan ini?")) {
                  handleDeletePerusahaan(id);
                }
              }}
              onView={handleViewPerusahaan}
              onViewSiswaMagang={handleViewSiswaMagang}
              onEditSiswaMagang={handleEditSiswaMagang}
            />
          </div>

          {showPerusahaanForm && (
            <div className="mt-6 p-4 border rounded-lg bg-blue-50">
              <PerusahaanInlineForm
                perusahaan={editingPerusahaan}
                kumiaiId={kumiai.id}
                onCancel={handleClosePerusahaanForm}
                onSuccess={handleSuccessPerusahaan}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <SiswaMagangDetailModal
        siswaMagang={viewingSiswaMagang}
        isOpen={showSiswaMagangModal}
        onClose={handleCloseSiswaMagangModal}
        onEdit={handleEditSiswaMagang}
      />
    </>
  );
}
