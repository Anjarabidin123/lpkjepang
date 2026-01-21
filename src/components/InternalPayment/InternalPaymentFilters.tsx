
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface FilterProps {
  search: string;
  status: string;
  metode_pembayaran: string;
  tanggal_dari: string;
  tanggal_sampai: string;
}

interface InternalPaymentFiltersProps {
  filters: FilterProps;
  onFilterChange: (filters: FilterProps) => void;
}

export function InternalPaymentFilters({ filters, onFilterChange }: InternalPaymentFiltersProps) {
  const handleFilterChange = (key: keyof FilterProps, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      metode_pembayaran: '',
      tanggal_dari: '',
      tanggal_sampai: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter & Pencarian</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Hapus Filter
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari siswa atau item..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Status</SelectItem>
            <SelectItem value="Lunas">Lunas</SelectItem>
            <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.metode_pembayaran} onValueChange={(value) => handleFilterChange('metode_pembayaran', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Metode Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Metode</SelectItem>
            <SelectItem value="Tunai">Tunai</SelectItem>
            <SelectItem value="Transfer">Transfer</SelectItem>
            <SelectItem value="Kartu Kredit">Kartu Kredit</SelectItem>
            <SelectItem value="Kartu Debit">Kartu Debit</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="Tanggal Dari"
          value={filters.tanggal_dari}
          onChange={(e) => handleFilterChange('tanggal_dari', e.target.value)}
        />

        <Input
          type="date"
          placeholder="Tanggal Sampai"
          value={filters.tanggal_sampai}
          onChange={(e) => handleFilterChange('tanggal_sampai', e.target.value)}
        />
      </div>
    </div>
  );
}
