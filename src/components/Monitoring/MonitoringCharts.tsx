
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartData {
  period: string;
  siswaMagang: number;
  target: number;
  pencapaian: number;
}

interface TrendData {
  period: string;
  value: number;
  category: string;
}

interface MonitoringChartsProps {
  chartData: ChartData[];
  trendData: TrendData[];
  period: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function MonitoringCharts({ chartData, trendData, period }: MonitoringChartsProps) {
  // Process trend data for line chart
  const processedTrendData = trendData.reduce((acc, item) => {
    const existing = acc.find(a => a.period === item.period);
    if (existing) {
      existing[item.category.replace(/\s+/g, '')] = item.value;
    } else {
      acc.push({
        period: item.period,
        [item.category.replace(/\s+/g, '')]: item.value
      });
    }
    return acc;
  }, [] as any[]);

  // Process data for pie chart - status distribution
  const statusDistribution = [
    { name: 'Aktif', value: 45, color: '#10b981' },
    { name: 'Selesai', value: 30, color: '#3b82f6' },
    { name: 'Cuti', value: 15, color: '#f59e0b' },
    { name: 'Dipulangkan', value: 10, color: '#ef4444' },
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case 'monthly': return 'Bulanan';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Tahunan';
      default: return 'Bulanan';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Target vs Pencapaian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Target vs Pencapaian ({getPeriodLabel()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="target" 
                fill="#e0e7ff" 
                name="Target"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="pencapaian" 
                fill="#3b82f6" 
                name="Pencapaian"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="siswaMagang" 
                fill="#10b981" 
                name="Siswa Magang"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Analisis Trend ({getPeriodLabel()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="SiswaMagang" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Siswa Magang"
              />
              <Line 
                type="monotone" 
                dataKey="Kumiai" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Kumiai"
              />
              <Line 
                type="monotone" 
                dataKey="LPKMitra" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="LPK Mitra"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribusi Status Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Total Siswa Magang</span>
              <span className="text-2xl font-bold text-blue-600">
                {chartData.reduce((sum, item) => sum + item.siswaMagang, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Target Achievement</span>
              <span className="text-2xl font-bold text-green-600">
                {chartData.length > 0 ? 
                  Math.round((chartData.reduce((sum, item) => sum + item.pencapaian, 0) / 
                  chartData.reduce((sum, item) => sum + item.target, 0)) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-800">Growth Rate</span>
              <span className="text-2xl font-bold text-purple-600">+12.5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
