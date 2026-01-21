
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

export interface FilterOptions {
  searchTerm: string;
  statusFilter: string;
  programFilter: string;
  kumiaiFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SiswaMagangFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  programs: Array<{ id: string; nama: string }>;
  kumiai: Array<{ id: string; nama: string }>;
}

export function SiswaMagangFilters({ 
  filters, 
  onFiltersChange, 
  programs, 
  kumiai 
}: SiswaMagangFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({
      searchTerm: '',
      statusFilter: '',
      programFilter: '',
      kumiaiFilter: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter & Sort</span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="search" className="text-xs">Search</Label>
            <Input
              id="search"
              placeholder="Cari siswa..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs">Status</Label>
            <Select 
              value={filters.statusFilter} 
              onValueChange={(value) => handleFilterChange('statusFilter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Berhenti">Berhenti</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Program</Label>
            <Select 
              value={filters.programFilter} 
              onValueChange={(value) => handleFilterChange('programFilter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Programs</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Kumiai</Label>
            <Select 
              value={filters.kumiaiFilter} 
              onValueChange={(value) => handleFilterChange('kumiaiFilter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Kumiai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Kumiai</SelectItem>
                {kumiai.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Sort By</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created Date</SelectItem>
                <SelectItem value="siswa.nama">Student Name</SelectItem>
                <SelectItem value="status_magang">Status</SelectItem>
                <SelectItem value="tanggal_mulai_kerja">Start Date</SelectItem>
                <SelectItem value="gaji">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Order</Label>
            <Select 
              value={filters.sortOrder} 
              onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
