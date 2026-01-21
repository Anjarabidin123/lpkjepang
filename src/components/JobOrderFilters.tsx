
import React from 'react';
import { Button } from "@/components/ui/button";
import { SelectWithPlaceholder } from "@/components/ui/select-with-placeholder";
import { SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useKumiai } from "@/hooks/useKumiai";
import { useJenisKerja } from "@/hooks/useJenisKerja";

interface JobOrderFiltersProps {
  filters: {
    status: string | null;
    kumiai_id: string | null;
    jenis_kerja_id: string | null;
  };
  onFiltersChange: (filters: { status: string | null; kumiai_id: string | null; jenis_kerja_id: string | null; }) => void;
  onClearFilters: () => void;
}

export function JobOrderFiltersComponent({ filters, onFiltersChange, onClearFilters }: JobOrderFiltersProps) {
  const { kumiai } = useKumiai();
  const { jenisKerja } = useJenisKerja();

  const hasActiveFilters = filters.status || filters.kumiai_id || filters.jenis_kerja_id;

  const handleFilterChange = (key: string, value: string | null) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? null : value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          
          <SelectWithPlaceholder
            value={filters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
          >
            <SelectItem value="">Semua Status</SelectItem>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Nonaktif">Non Aktif</SelectItem>
          </SelectWithPlaceholder>

          <SelectWithPlaceholder
            value={filters.kumiai_id || ''}
            onValueChange={(value) => handleFilterChange('kumiai_id', value)}
            placeholder="Kumiai"
          >
            <SelectItem value="">Semua Kumiai</SelectItem>
            {kumiai?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.kode} - {item.nama}
              </SelectItem>
            ))}
          </SelectWithPlaceholder>

          <SelectWithPlaceholder
            value={filters.jenis_kerja_id || ''}
            onValueChange={(value) => handleFilterChange('jenis_kerja_id', value)}
            placeholder="Jenis Kerja"
          >
            <SelectItem value="">Semua Jenis Kerja</SelectItem>
            {jenisKerja?.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.kode} - {item.nama}
              </SelectItem>
            ))}
          </SelectWithPlaceholder>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-8"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('status', null)}
              />
            </Badge>
          )}
          {filters.kumiai_id && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Kumiai: {kumiai?.find(k => k.id === filters.kumiai_id)?.nama || 'Unknown'}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('kumiai_id', null)}
              />
            </Badge>
          )}
          {filters.jenis_kerja_id && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Jenis Kerja: {jenisKerja?.find(jk => jk.id === filters.jenis_kerja_id)?.nama || 'Unknown'}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('jenis_kerja_id', null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
