
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";
import { SiswaRegulerGridControls } from "./SiswaRegulerGridControls";
import type { SiswaColumnConfig } from "@/hooks/useSiswaColumnVisibility";
import type { ViewMode, SortDirection } from "./SiswaRegulerGridControls";

interface SiswaRegulerCardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
  isEditing: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: string;
  sortDirection: SortDirection;
  onSortChange: (field: string) => void;
  totalItems: number;
  columns: SiswaColumnConfig[];
  onToggleColumn: (key: string) => void;
  onRefresh?: () => void;
}

export function SiswaRegulerCardHeader({
  searchTerm,
  onSearchChange,
  onCreateNew,
  isEditing,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  totalItems,
  columns,
  onToggleColumn,
  onRefresh
}: SiswaRegulerCardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="text-xl font-bold">
          Data Siswa Magang ({totalItems} data)
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              className="bg-gray-50 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
          <Button 
            onClick={onCreateNew} 
            disabled={isEditing}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Siswa Magang
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari siswa, kumiai, perusahaan, atau lokasi..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>
      
      <SiswaRegulerGridControls
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        columns={columns}
        onToggleColumn={onToggleColumn}
        totalItems={totalItems}
      />
    </div>
  );
}
