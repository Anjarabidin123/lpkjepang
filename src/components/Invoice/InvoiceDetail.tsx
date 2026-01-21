
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Calendar, Building2, Users, FileText, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

interface InvoiceDetailProps {
  invoice: any;
  onClose: () => void;
}

export function InvoiceDetail({ invoice, onClose }: InvoiceDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl">Detail Invoice</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nomor Invoice</p>
                  <p className="font-mono font-semibold text-lg">{invoice.nomor_invoice}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Kumiai</p>
                  <p className="font-semibold">{invoice.kumiai?.nama || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{invoice.kumiai?.kode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusColor(invoice.status)} className="mt-1">
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Invoice</p>
                  <p className="font-semibold">{formatDate(invoice.tanggal_invoice)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Jatuh Tempo</p>
                  <p className="font-semibold">
                    {invoice.tanggal_jatuh_tempo ? formatDate(invoice.tanggal_jatuh_tempo) : 'Tidak ditetapkan'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Siswa Magang</p>
                  <p className="font-semibold text-lg">{invoice.invoice_items?.length || 0} siswa</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total Nominal</p>
                <p className="text-2xl font-bold text-green-800 font-mono">
                  {formatCurrency(invoice.nominal)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Invoice Items */}
          {invoice.invoice_items && invoice.invoice_items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Siswa Magang
                </h3>
                <div className="space-y-3">
                  {invoice.invoice_items.map((item: any, index: number) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.siswa_magang?.siswa?.nama || 'Nama tidak tersedia'}
                          </p>
                          {item.keterangan && (
                            <p className="text-sm text-gray-500">{item.keterangan}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 font-mono">
                          {formatCurrency(item.nominal_fee)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Keterangan */}
          {invoice.keterangan && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{invoice.keterangan}</p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
