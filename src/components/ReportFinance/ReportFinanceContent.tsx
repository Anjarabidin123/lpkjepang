
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, TrendingUp, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';
import { useFinanceReport } from '@/hooks/useFinanceReport';
import { formatCurrency } from '@/lib/formatCurrency';
import { ReportCharts } from './ReportCharts';
import { ReportDataTable } from './ReportDataTable';

export function ReportFinanceContent() {
  const { reportData, loading, fetchReportData } = useFinanceReport();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleFilterApply = () => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchReportData(dateRange.startDate, dateRange.endDate);
    } else {
      fetchReportData();
    }
  };

  const handleResetFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    fetchReportData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilterApply} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={handleResetFilter}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportData && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.totalIncome)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(reportData.totalExpense)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <DollarSign className={`w-8 h-8 ${reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className={`text-2xl font-bold ${reportData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(reportData.netProfit)}
                    </p>
                    <p className="text-sm text-muted-foreground">Laba/Rugi Bersih</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <ReportCharts data={reportData} />

          {/* Data Table Section */}
          <ReportDataTable data={reportData} />
        </>
      )}

      {!reportData && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada data laporan tersedia</p>
              <Button onClick={() => fetchReportData()} className="mt-4">
                Muat Ulang Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
