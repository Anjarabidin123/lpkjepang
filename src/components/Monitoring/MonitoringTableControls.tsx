
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { MonitoringTableData } from '@/types/monitoring';

interface MonitoringTableControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: keyof MonitoringTableData;
  onSortFieldChange: (value: keyof MonitoringTableData) => void;
}

export function MonitoringTableControls({
  searchTerm,
  onSearchChange,
  sortField,
  onSortFieldChange
}: MonitoringTableControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari berdasarkan nama atau kategori..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 text-responsive-sm"
        />
      </div>
      <div className="flex gap-2">
        <Select value={sortField} onValueChange={(value) => onSortFieldChange(value as keyof MonitoringTableData)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nama">Nama</SelectItem>
            <SelectItem value="kategori">Kategori</SelectItem>
            <SelectItem value="target">Target</SelectItem>
            <SelectItem value="pencapaian">Pencapaian</SelectItem>
            <SelectItem value="persentase">Persentase</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
