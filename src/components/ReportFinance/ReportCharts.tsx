
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { type FinanceReportData } from '@/hooks/useFinanceReport';
import { formatCurrency } from '@/lib/formatCurrency';

interface ReportChartsProps {
  data: FinanceReportData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function ReportCharts({ data }: ReportChartsProps) {
  const formatTooltipValue = (value: number) => formatCurrency(value);
  
  const formatMonthLabel = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const monthlyTrendsFormatted = data.monthlyTrends.map(item => ({
    ...item,
    monthLabel: formatMonthLabel(item.month)
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Monthly Trends Line Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Tren Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendsFormatted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="monthLabel" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('Rp ', 'Rp')}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [formatTooltipValue(value), '']}
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="Pemasukan"
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#FF8042" 
                strokeWidth={2}
                name="Pengeluaran"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#0088FE" 
                strokeWidth={2}
                name="Laba/Rugi"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income by Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pemasukan per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.incomeByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ kategori, percent }) => `${kategori} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {data.incomeByCategory.map((entry, index) => (
                  <Cell key={`income-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Total']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense by Category Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.expenseByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ kategori, percent }) => `${kategori} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {data.expenseByCategory.map((entry, index) => (
                  <Cell key={`expense-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [formatTooltipValue(value), 'Total']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income vs Expense Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Perbandingan Pemasukan vs Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrendsFormatted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="monthLabel" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('Rp ', 'Rp')}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [formatTooltipValue(value), '']}
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" fill="#00C49F" name="Pemasukan" />
              <Bar dataKey="expense" fill="#FF8042" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
