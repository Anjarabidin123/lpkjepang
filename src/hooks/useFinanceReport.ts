
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface FinanceReportData {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  incomeByCategory: Array<{ kategori: string; total: number }>;
  expenseByCategory: Array<{ kategori: string; total: number }>;
  monthlyTrends: Array<{ 
    month: string; 
    income: number; 
    expense: number; 
    profit: number 
  }>;
}

export function useFinanceReport() {
  const [reportData, setReportData] = useState<FinanceReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReportData = async (startDate?: string, endDate?: string) => {
    if (!user) {
      setReportData(null);
      return;
    }

    setLoading(true);
    try {
      // Build date filter condition
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `tanggal.gte.${startDate},tanggal.lte.${endDate}`;
      }

      // Fetch arus kas data
      const { data: arusKasData, error: arusKasError } = await supabase
        .from('arus_kas')
        .select('*')
        .order('tanggal', { ascending: false });

      if (arusKasError) throw arusKasError;

      // Filter by date if specified
      let filteredData = arusKasData || [];
      if (startDate && endDate) {
        filteredData = filteredData.filter(item => 
          item.tanggal >= startDate && item.tanggal <= endDate
        );
      }

      // Calculate totals
      const incomeData = filteredData.filter(item => item.jenis === 'Pemasukan');
      const expenseData = filteredData.filter(item => item.jenis === 'Pengeluaran');

      const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.nominal), 0);
      const totalExpense = expenseData.reduce((sum, item) => sum + Number(item.nominal), 0);
      const netProfit = totalIncome - totalExpense;

      // Income by category
      const incomeByCategory = incomeData.reduce((acc, item) => {
        const existing = acc.find(cat => cat.kategori === item.kategori);
        if (existing) {
          existing.total += Number(item.nominal);
        } else {
          acc.push({ kategori: item.kategori, total: Number(item.nominal) });
        }
        return acc;
      }, [] as Array<{ kategori: string; total: number }>);

      // Expense by category
      const expenseByCategory = expenseData.reduce((acc, item) => {
        const existing = acc.find(cat => cat.kategori === item.kategori);
        if (existing) {
          existing.total += Number(item.nominal);
        } else {
          acc.push({ kategori: item.kategori, total: Number(item.nominal) });
        }
        return acc;
      }, [] as Array<{ kategori: string; total: number }>);

      // Monthly trends
      const monthlyData = filteredData.reduce((acc, item) => {
        const month = new Date(item.tanggal).toISOString().substring(0, 7); // YYYY-MM
        const existing = acc.find(m => m.month === month);
        
        if (existing) {
          if (item.jenis === 'Pemasukan') {
            existing.income += Number(item.nominal);
          } else {
            existing.expense += Number(item.nominal);
          }
          existing.profit = existing.income - existing.expense;
        } else {
          acc.push({
            month,
            income: item.jenis === 'Pemasukan' ? Number(item.nominal) : 0,
            expense: item.jenis === 'Pengeluaran' ? Number(item.nominal) : 0,
            profit: item.jenis === 'Pemasukan' ? Number(item.nominal) : -Number(item.nominal)
          });
        }
        return acc;
      }, [] as Array<{ month: string; income: number; expense: number; profit: number }>);

      // Sort monthly trends by month
      monthlyData.sort((a, b) => a.month.localeCompare(b.month));

      setReportData({
        totalIncome,
        totalExpense,
        netProfit,
        incomeByCategory: incomeByCategory.sort((a, b) => b.total - a.total),
        expenseByCategory: expenseByCategory.sort((a, b) => b.total - a.total),
        monthlyTrends: monthlyData
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to load finance report data",
        variant: "destructive",
      });
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user]);

  return {
    reportData,
    loading,
    fetchReportData,
    isAuthenticated: !!user,
  };
}
