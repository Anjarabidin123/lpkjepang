
import React, { useState, useMemo } from 'react';
import { MonitoringTableData, MonitoringFilters } from '@/types/monitoring';
import { MonitoringTableControls } from './MonitoringTableControls';
import { MonitoringTableMobile } from './MonitoringTableMobile';
import { MonitoringTableDesktop } from './MonitoringTableDesktop';

interface MonitoringTableProps {
  data: MonitoringTableData[];
  filters: MonitoringFilters;
}

export function MonitoringTable({ data, filters }: MonitoringTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof MonitoringTableData>('nama');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter based on filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection, filters]);

  const handleSort = (field: keyof MonitoringTableData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-responsive">
      <MonitoringTableControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        onSortFieldChange={setSortField}
      />

      <MonitoringTableMobile data={filteredAndSortedData} />

      <MonitoringTableDesktop
        data={filteredAndSortedData}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Summary Information */}
      {filteredAndSortedData.length > 0 && (
        <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          Menampilkan {filteredAndSortedData.length} dari {data.length} data
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>
      )}
    </div>
  );
}
