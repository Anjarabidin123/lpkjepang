
export interface MonitoringTableData {
  id: string;
  nama: string;
  kategori: string;
  status: string;
  target: number;
  pencapaian: number;
  persentase: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonitoringKPI {
  target: number;
  pencapaian: number;
  pertumbuhan: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonitoringData {
  siswaMagangKPI: MonitoringKPI;
  kumiaiKPI: MonitoringKPI;
  lpkMitraKPI: MonitoringKPI;
  gajiKPI: MonitoringKPI;
  chartData: Array<{
    period: string;
    siswaMagang: number;
    target: number;
    pencapaian: number;
  }>;
  trendData: Array<{
    period: string;
    value: number;
    category: string;
  }>;
  tableData: MonitoringTableData[];
}

export interface MonitoringFilters {
  kumiai: string;
  lpkMitra: string;
  status: string;
  period: string;
}
