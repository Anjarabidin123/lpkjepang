
import React from 'react';
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface SiswaMagangErrorStateProps {
  error: Error;
}

export function SiswaMagangErrorState({ error }: SiswaMagangErrorStateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <GraduationCap className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terjadi kesalahan saat memuat data
          </h3>
          <p className="text-gray-500 mb-4">
            {error.message || 'Tidak dapat memuat data siswa magang'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Muat Ulang
          </Button>
        </div>
      </div>
    </div>
  );
}
