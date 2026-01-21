
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter as FilterIcon } from "lucide-react";

interface MonitoringFiltersProps {
  selectedKumiai: string;
  selectedLpkMitra: string;
  selectedStatus: string;
  selectedPeriod: string;
  onKumiaiChange: (value: string) => void;
  onLpkMitraChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onRefresh: () => void;
  kumiaiOptions: Array<{ id: string; nama: string; }>;
  lpkMitraOptions: Array<{ id: string; nama_lpk: string; }>;
}

export function MonitoringFilters({
  selectedKumiai,
  selectedLpkMitra,
  selectedStatus,
  selectedPeriod,
  onKumiaiChange,
  onLpkMitraChange,
  onStatusChange,
  onPeriodChange,
  onRefresh,
  kumiaiOptions,
  lpkMitraOptions
}: MonitoringFiltersProps) {
  const handleReset = () => {
    onKumiaiChange('all');
    onLpkMitraChange('all');
    onStatusChange('all');
    onPeriodChange('monthly');
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-base font-semibold">Filter & Period</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800 h-8 px-3 text-xs w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 h-8 px-3 text-xs w-full sm:w-auto"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Period</label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Pilih Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Kumiai</label>
            <Select value={selectedKumiai} onValueChange={onKumiaiChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Pilih Kumiai" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kumiai</SelectItem>
                {kumiaiOptions.map((kumiai) => (
                  <SelectItem key={kumiai.id} value={kumiai.id}>
                    {kumiai.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">LPK Mitra</label>
            <Select value={selectedLpkMitra} onValueChange={onLpkMitraChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Pilih LPK Mitra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua LPK</SelectItem>
                {lpkMitraOptions.map((lpk) => (
                  <SelectItem key={lpk.id} value={lpk.id}>
                    {lpk.nama_lpk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Status</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full h-8 text-sm">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Dipulangkan">Dipulangkan</SelectItem>
                <SelectItem value="Cuti">Cuti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
