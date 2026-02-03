
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { MonitoringTableData } from '@/types/monitoring';
import { getTrendIcon, getStatusBadge } from './MonitoringTableUtils';

interface MonitoringTableDesktopProps {
  data: MonitoringTableData[];
  sortField: keyof MonitoringTableData;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof MonitoringTableData) => void;
}

export function MonitoringTableDesktop({ 
  data, 
  sortField, 
  sortDirection, 
  onSort 
}: MonitoringTableDesktopProps) {
  const getSortIcon = (field: keyof MonitoringTableData) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? 
        <ChevronUp className="w-4 h-4" /> : 
        <ChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="hidden sm:block">
        <div className="text-center py-8 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-responsive-sm">Tidak ada data yang ditemukan</p>
          <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:block table-responsive">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-responsive-sm"
              onClick={() => onSort('nama')}
            >
              <div className="flex items-center gap-2">
                Nama
                {getSortIcon('nama')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-responsive-sm"
              onClick={() => onSort('kategori')}
            >
              <div className="flex items-center gap-2">
                Kategori
                {getSortIcon('kategori')}
              </div>
            </TableHead>
            <TableHead className="text-responsive-sm">Status</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right text-responsive-sm"
              onClick={() => onSort('target')}
            >
              <div className="flex items-center justify-end gap-2">
                Target
                {getSortIcon('target')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right text-responsive-sm"
              onClick={() => onSort('pencapaian')}
            >
              <div className="flex items-center justify-end gap-2">
                Pencapaian
                {getSortIcon('pencapaian')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right text-responsive-sm"
              onClick={() => onSort('persentase')}
            >
              <div className="flex items-center justify-end gap-2">
                Progress
                {getSortIcon('persentase')}
              </div>
            </TableHead>
            <TableHead className="text-center text-responsive-sm">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium text-responsive-sm">
                {item.nama}
              </TableCell>
              <TableCell className="text-responsive-sm">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {item.kategori}
                </span>
              </TableCell>
              <TableCell>
                {getStatusBadge(item.status)}
              </TableCell>
              <TableCell className="text-right font-mono text-responsive-sm">
                {item.target.toLocaleString('en-US')}
              </TableCell>
              <TableCell className="text-right font-mono text-responsive-sm">
                {item.pencapaian.toLocaleString('en-US')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.persentase >= 100 ? 'bg-green-500' : 
                        item.persentase >= 80 ? 'bg-blue-500' : 
                        item.persentase >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.persentase, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium min-w-[2.5rem]">
                    {item.persentase}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getTrendIcon(item.trend)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
