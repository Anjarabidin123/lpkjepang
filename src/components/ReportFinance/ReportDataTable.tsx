
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown } from 'lucide-react';
import { type FinanceReportData } from '@/hooks/useFinanceReport';
import { formatCurrency } from '@/lib/formatCurrency';

interface ReportDataTableProps {
  data: FinanceReportData;
}

export function ReportDataTable({ data }: ReportDataTableProps) {
  const [incomeSearch, setIncomeSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [incomeSort, setIncomeSort] = useState<'asc' | 'desc'>('desc');
  const [expenseSort, setExpenseSort] = useState<'asc' | 'desc'>('desc');

  const filteredIncomeData = data.incomeByCategory
    .filter(item => 
      item.kategori.toLowerCase().includes(incomeSearch.toLowerCase())
    )
    .sort((a, b) => incomeSort === 'asc' ? a.total - b.total : b.total - a.total);

  const filteredExpenseData = data.expenseByCategory
    .filter(item => 
      item.kategori.toLowerCase().includes(expenseSearch.toLowerCase())
    )
    .sort((a, b) => expenseSort === 'asc' ? a.total - b.total : b.total - a.total);

  const formatMonthLabel = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Tren Bulanan</TabsTrigger>
          <TabsTrigger value="income">Pemasukan per Kategori</TabsTrigger>
          <TabsTrigger value="expense">Pengeluaran per Kategori</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Data Tren Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan</TableHead>
                      <TableHead className="text-right">Pemasukan</TableHead>
                      <TableHead className="text-right">Pengeluaran</TableHead>
                      <TableHead className="text-right">Laba/Rugi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.monthlyTrends.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          Tidak ada data bulanan
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.monthlyTrends.map((item) => (
                        <TableRow key={item.month}>
                          <TableCell className="font-medium">
                            {formatMonthLabel(item.month)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-green-600">
                            {formatCurrency(item.income)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-red-600">
                            {formatCurrency(item.expense)}
                          </TableCell>
                          <TableCell className={`text-right font-mono font-semibold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.profit)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Data Pemasukan per Kategori</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kategori..."
                    value={incomeSearch}
                    onChange={(e) => setIncomeSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIncomeSort(incomeSort === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort {incomeSort === 'asc' ? 'Terkecil' : 'Terbesar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncomeData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          {incomeSearch ? 'Tidak ada kategori yang cocok' : 'Tidak ada data pemasukan'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIncomeData.map((item) => (
                        <TableRow key={item.kategori}>
                          <TableCell className="font-medium">
                            {item.kategori}
                          </TableCell>
                          <TableCell className="text-right font-mono text-green-600">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            {((item.total / data.totalIncome) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>Data Pengeluaran per Kategori</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kategori..."
                    value={expenseSearch}
                    onChange={(e) => setExpenseSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setExpenseSort(expenseSort === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort {expenseSort === 'asc' ? 'Terkecil' : 'Terbesar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenseData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          {expenseSearch ? 'Tidak ada kategori yang cocok' : 'Tidak ada data pengeluaran'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenseData.map((item) => (
                        <TableRow key={item.kategori}>
                          <TableCell className="font-medium">
                            {item.kategori}
                          </TableCell>
                          <TableCell className="text-right font-mono text-red-600">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            {((item.total / data.totalExpense) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
