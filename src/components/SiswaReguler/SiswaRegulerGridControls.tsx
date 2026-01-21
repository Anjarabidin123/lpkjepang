
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid2X2, Grid3X3, Columns2, SortAsc, SortDesc } from "lucide-react";
import { ColumnVisibilityControl } from "@/components/ColumnVisibilityControl";
import type { SiswaColumnConfig } from "@/hooks/useSiswaColumnVisibility";

export type ViewMode = 'table' | 'grid-2' | 'grid-3';
export type SortDirection = 'asc' | 'desc' | null;

interface SiswaRegulerGridControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortField: string | null;
  sortDirection: SortDirection;
  onSortChange: (field: string) => void;
  columns: SiswaColumnConfig[];
  onToggleColumn: (key: string) => void;
  totalItems: number;
}

export function SiswaRegulerGridControls({
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  columns,
  onToggleColumn,
  totalItems
}: SiswaRegulerGridControlsProps) {
  const sortOptions = [
    { value: '', label: 'Tanpa urutan' },
    { value: 'siswa.nama', label: 'Nama Siswa' },
    { value: 'kumiai.nama', label: 'Kumiai' },
    { value: 'perusahaan.nama', label: 'Perusahaan' },
    { value: 'program.nama', label: 'Program' },
    { value: 'lokasi', label: 'Lokasi' },
    { value: 'tanggal_mulai_kerja', label: 'Tanggal Mulai' },
    { value: 'tanggal_pulang_kerja', label: 'Tanggal Pulang' },
    { value: 'status_magang', label: 'Status' },
    { value: 'gaji', label: 'Gaji' }
  ];

  const handleSortFieldChange = (field: string) => {
    onSortChange(field);
  };

  const handleSortDirectionToggle = () => {
    if (sortField) {
      onSortChange(sortField);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
      {/* Left side controls - Sort and Column Visibility */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select onValueChange={handleSortFieldChange} value={sortField || ''}>
            <SelectTrigger className="w-48 bg-white/80 border-gray-200 focus:border-blue-400">
              <SelectValue placeholder="Urutkan berdasarkan..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {sortField && sortDirection && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortDirectionToggle}
              className="bg-white/80 border-gray-200 hover:bg-gray-50"
            >
              {sortDirection === 'asc' ? 
                <SortAsc className="w-4 h-4" /> : 
                <SortDesc className="w-4 h-4" />
              }
            </Button>
          )}
        </div>

        {/* Column Visibility Control - only show for table view */}
        {viewMode === 'table' && (
          <ColumnVisibilityControl
            columns={columns}
            onToggleColumn={onToggleColumn}
          />
        )}
      </div>

      {/* Right side controls - View Mode and Item Count */}
      <div className="flex items-center justify-between flex-1 gap-4">
        <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-2xl">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="rounded-xl px-4 py-2 font-medium transition-all duration-200"
          >
            <Columns2 className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button
            variant={viewMode === 'grid-2' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid-2')}
            className="rounded-xl px-4 py-2 font-medium transition-all duration-200"
          >
            <Grid2X2 className="w-4 h-4 mr-2" />
            2 Columns
          </Button>
          <Button
            variant={viewMode === 'grid-3' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid-3')}
            className="rounded-xl px-4 py-2 font-medium transition-all duration-200"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            3 Columns
          </Button>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50/80 rounded-2xl">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold text-blue-700">
            {totalItems} siswa
          </span>
        </div>
      </div>
    </div>
  );
}
