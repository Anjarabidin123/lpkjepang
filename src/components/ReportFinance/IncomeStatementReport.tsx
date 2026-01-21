
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatCurrency';
import { FinanceReportDataEnhanced } from '@/hooks/useFinanceReportEnhanced';

interface IncomeStatementReportProps {
  data: FinanceReportDataEnhanced;
}

export function IncomeStatementReport({ data }: IncomeStatementReportProps) {
  const { incomeStatement } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Statement</CardTitle>
        <p className="text-sm text-gray-600">Profit & Loss statement</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Revenue Section */}
            <TableRow>
              <TableCell colSpan={2} className="font-medium text-sm text-gray-600 bg-gray-50">
                REVENUE
              </TableCell>
            </TableRow>
            {incomeStatement.revenue.map((revenue, index) => (
              <TableRow key={`revenue-${index}`}>
                <TableCell className="pl-4">{revenue.account}</TableCell>
                <TableCell className="text-right font-mono text-green-600">
                  {formatCurrency(revenue.amount)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-b">
              <TableCell className="font-medium">Total Revenue</TableCell>
              <TableCell className="text-right font-mono font-medium text-green-600">
                {formatCurrency(incomeStatement.totalRevenue)}
              </TableCell>
            </TableRow>

            {/* Expenses Section */}
            <TableRow>
              <TableCell colSpan={2} className="font-medium text-sm text-gray-600 bg-gray-50">
                EXPENSES
              </TableCell>
            </TableRow>
            {incomeStatement.expenses.map((expense, index) => (
              <TableRow key={`expense-${index}`}>
                <TableCell className="pl-4">{expense.account}</TableCell>
                <TableCell className="text-right font-mono text-red-600">
                  {formatCurrency(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-b">
              <TableCell className="font-medium">Total Expenses</TableCell>
              <TableCell className="text-right font-mono font-medium text-red-600">
                {formatCurrency(incomeStatement.totalExpenses)}
              </TableCell>
            </TableRow>

            {/* Net Income */}
            <TableRow className="border-t-2 font-bold text-lg">
              <TableCell>Net Income</TableCell>
              <TableCell className={`text-right font-mono ${
                incomeStatement.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(incomeStatement.netIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
