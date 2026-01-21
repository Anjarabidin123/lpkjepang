
import React from 'react';
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobOrderPesertaStatsProps {
  pesertaCount: number;
  kuota: number;
  selectedCount: number;
  onAddPeserta: () => void;
  isAddingPeserta: boolean;
}

export function JobOrderPesertaStats({ 
  pesertaCount, 
  kuota, 
  selectedCount, 
  onAddPeserta,
  isAddingPeserta 
}: JobOrderPesertaStatsProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-medium text-blue-900">
              {pesertaCount} dari {kuota || 0} peserta terdaftar
            </span>
            {selectedCount > 0 && (
              <div className="text-sm text-blue-700">
                {selectedCount} siswa dipilih untuk ditambahkan
              </div>
            )}
          </div>
        </div>
        {selectedCount > 0 && (
          <Button 
            onClick={onAddPeserta}
            disabled={isAddingPeserta}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Peserta ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
