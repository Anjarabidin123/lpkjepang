import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '@/lib/api-client';
import { endpoints } from '@/config/api';

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
        profit: number;
    }>;
}

export function useFinanceReport() {
    const [reportData, setReportData] = useState<FinanceReportData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReportData = useCallback(async (startDate?: string, endDate?: string) => {
        try {
            setLoading(true);

            // Fetch all required data for calculation
            const [incomeRes, expenseRes] = await Promise.all([
                authFetch(endpoints.pemasukan),
                authFetch(endpoints.pengeluaran)
            ]);

            const income = await incomeRes.json();
            const expense = await expenseRes.json();

            // Filter by date if provided
            const filterByDate = (items: any[]) => {
                if (!startDate && !endDate) return items;
                return items.filter(item => {
                    const date = new Date(item.tanggal || item.created_at).getTime();
                    const start = startDate ? new Date(startDate).getTime() : 0;
                    const end = endDate ? new Date(endDate).getTime() : Infinity;
                    return date >= start && date <= end;
                });
            };

            const filteredIncome = filterByDate(income);
            const filteredExpense = filterByDate(expense);

            // Calculations
            const totalIncome = filteredIncome.reduce((sum: number, item: any) => sum + Number(item.jumlah), 0);
            const totalExpense = filteredExpense.reduce((sum: number, item: any) => sum + Number(item.jumlah), 0);

            // Group by category
            const incomeByCategory = Object.entries(
                filteredIncome.reduce((acc: any, item: any) => {
                    const cat = item.kategori?.nama || 'Lainnya';
                    acc[cat] = (acc[cat] || 0) + Number(item.jumlah);
                    return acc;
                }, {})
            ).map(([kategori, total]) => ({ kategori, total: total as number }));

            const expenseByCategory = Object.entries(
                filteredExpense.reduce((acc: any, item: any) => {
                    const cat = item.kategori?.nama || 'Lainnya';
                    acc[cat] = (acc[cat] || 0) + Number(item.jumlah);
                    return acc;
                }, {})
            ).map(([kategori, total]) => ({ kategori, total: total as number }));

            // Monthly Trends (simple logic for now)
            const monthlyData: Record<string, { income: number; expense: number }> = {};

            filteredIncome.forEach((item: any) => {
                const month = new Date(item.tanggal || item.created_at).toISOString().substring(0, 7);
                if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
                monthlyData[month].income += Number(item.jumlah);
            });

            filteredExpense.forEach((item: any) => {
                const month = new Date(item.tanggal || item.created_at).toISOString().substring(0, 7);
                if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
                monthlyData[month].expense += Number(item.jumlah);
            });

            const monthlyTrends = Object.entries(monthlyData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, data]) => ({
                    month,
                    income: data.income,
                    expense: data.expense,
                    profit: data.income - data.expense
                }));

            setReportData({
                totalIncome,
                totalExpense,
                netProfit: totalIncome - totalExpense,
                incomeByCategory,
                expenseByCategory,
                monthlyTrends
            });
        } catch (error) {
            console.error('Error calculating finance report:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    return {
        reportData,
        loading,
        fetchReportData
    };
}
