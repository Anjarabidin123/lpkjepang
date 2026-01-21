
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatCurrency';
import { FinanceReportDataEnhanced } from '@/hooks/useFinanceReportEnhanced';

interface BalanceSheetReportProps {
  data: FinanceReportDataEnhanced;
}

export function BalanceSheetReport({ data }: BalanceSheetReportProps) {
  const { balanceSheet } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
          <p className="text-sm text-gray-600">Financial position statement</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Assets */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Assets</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheet.assets.map((asset, index) => (
                    <TableRow key={index}>
                      <TableCell>{asset.account}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(asset.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-semibold">
                    <TableCell>Total Assets</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(balanceSheet.totalAssets)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Liabilities & Equity */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Liabilities & Equity</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Liabilities */}
                  {balanceSheet.liabilities.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium text-sm text-gray-600 bg-gray-50">
                          LIABILITIES
                        </TableCell>
                      </TableRow>
                      {balanceSheet.liabilities.map((liability, index) => (
                        <TableRow key={`liability-${index}`}>
                          <TableCell className="pl-4">{liability.account}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(liability.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-b">
                        <TableCell className="font-medium">Total Liabilities</TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(balanceSheet.totalLiabilities)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Equity */}
                  {balanceSheet.equity.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium text-sm text-gray-600 bg-gray-50">
                          EQUITY
                        </TableCell>
                      </TableRow>
                      {balanceSheet.equity.map((equity, index) => (
                        <TableRow key={`equity-${index}`}>
                          <TableCell className="pl-4">{equity.account}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(equity.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-b">
                        <TableCell className="font-medium">Total Equity</TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(balanceSheet.totalEquity)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  <TableRow className="border-t-2 font-semibold">
                    <TableCell>Total Liabilities & Equity</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(balanceSheet.totalLiabilities + balanceSheet.totalEquity)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Balance Check */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Balance Check:</span>
              <span className={`font-bold ${
                Math.abs(balanceSheet.totalAssets - (balanceSheet.totalLiabilities + balanceSheet.totalEquity)) < 0.01
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(balanceSheet.totalAssets - (balanceSheet.totalLiabilities + balanceSheet.totalEquity)) < 0.01
                  ? '✓ Balanced' : '✗ Not Balanced'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
