import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, TrendingUp, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReportStats, useAvailableReports, useRecentReports, useGenerateReport } from '@/hooks/useReports';
import { AuthGuard } from '@/components/AuthGuard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Report() {
  const [generatedData, setGeneratedData] = useState<any>(null);
  const { data: stats, isLoading: isLoadingStats } = useReportStats();
  const { data: availableReports, isLoading: isLoadingAvailable } = useAvailableReports();
  const { data: recentReports, isLoading: isLoadingRecent } = useRecentReports();
  const generateReport = useGenerateReport();

  const handleGenerateReport = async (type: string) => {
    try {
      const result = await generateReport.mutateAsync(type);
      setGeneratedData(result);
    } catch (error) {
      alert('Failed to generate report');
    }
  };

  if (isLoadingStats || isLoadingAvailable || isLoadingRecent) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold">Report Center</h1>
              <p className="text-gray-600">Analisis data sistem secara real-time</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalReports || 0}</p>
                  <p className="text-sm text-muted-foreground">Reports Types</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats?.monthlyGrowth !== undefined ? `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%` : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.accuracyRate || 0}%</p>
                  <p className="text-sm text-muted-foreground">Data Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableReports?.map((report) => (
                <div key={report.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="font-semibold">{report.name}</span>
                    <p className="text-sm text-gray-500">{report.description}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{report.count} records detected</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    disabled={!report.available || generateReport.isPending}
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    {generateReport.isPending ? 'Processing...' : 'Generate'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports?.map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-gray-400">{report.type} • {report.generated_at}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {generatedData && (
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-orange-50/30">
              <CardTitle className="text-orange-900">
                Preview: {generatedData.type.replace('_', ' ').toUpperCase()}
              </CardTitle>
              <Button size="sm" className="bg-orange-600">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-72 w-full p-6">
                <pre className="text-xs font-mono bg-gray-900 text-green-400 p-4 rounded-md">
                  {JSON.stringify(generatedData.data, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}
