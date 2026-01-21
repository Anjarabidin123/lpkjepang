
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FinanceReportData {
  id: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  created_at: string;
}

export interface FinanceReportDataEnhanced {
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
  balanceSheet: {
    assets: Array<{ account: string; balance: number }>;
    liabilities: Array<{ account: string; balance: number }>;
    equity: Array<{ account: string; balance: number }>;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
  };
  incomeStatement: {
    revenue: Array<{ account: string; amount: number }>;
    expenses: Array<{ account: string; amount: number }>;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  };
}

export function useFinanceReportEnhanced() {
  const [reportData, setReportData] = useState<FinanceReportDataEnhanced | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReportData = async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from arus_kas table for financial reporting
      const { data, error } = await supabase
        .from('arus_kas')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;

      // Filter by date if specified
      let filteredData = data || [];
      if (startDate && endDate) {
        filteredData = filteredData.filter(item => 
          item.tanggal >= startDate && item.tanggal <= endDate
        );
      }

      // Process the data for enhanced reporting
      let totalIncome = 0;
      let totalExpense = 0;

      const incomeData = filteredData.filter(item => item.jenis === 'Pemasukan');
      const expenseData = filteredData.filter(item => item.jenis === 'Pengeluaran');

      totalIncome = incomeData.reduce((sum, item) => sum + Number(item.nominal), 0);
      totalExpense = expenseData.reduce((sum, item) => sum + Number(item.nominal), 0);

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

      // Create enhanced report structure
      const enhancedData: FinanceReportDataEnhanced = {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        incomeByCategory: incomeByCategory.sort((a, b) => b.total - a.total),
        expenseByCategory: expenseByCategory.sort((a, b) => b.total - a.total),
        monthlyTrends: monthlyData,
        balanceSheet: {
          assets: [
            { account: 'Cash & Bank', balance: totalIncome - totalExpense }
          ],
          liabilities: [],
          equity: [
            { account: 'Retained Earnings', balance: totalIncome - totalExpense }
          ],
          totalAssets: totalIncome - totalExpense,
          totalLiabilities: 0,
          totalEquity: totalIncome - totalExpense
        },
        incomeStatement: {
          revenue: incomeData.map(item => ({
            account: item.kategori,
            amount: Number(item.nominal)
          })),
          expenses: expenseData.map(item => ({
            account: item.kategori,
            amount: Number(item.nominal)
          })),
          totalRevenue: totalIncome,
          totalExpenses: totalExpense,
          netIncome: totalIncome - totalExpense
        }
      };

      setReportData(enhancedData);
      
    } catch (err: any) {
      console.error('Error fetching finance report:', err);
      setError(err.message || 'Failed to fetch finance report');
      toast({
        title: "Error",
        description: "Failed to load finance report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return {
    reportData,
    loading: isLoading, // Alias for compatibility
    isLoading,
    error,
    fetchReportData,
  };
}
