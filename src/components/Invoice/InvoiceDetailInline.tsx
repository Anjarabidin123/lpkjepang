
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  Edit,
  Download,
  Printer,
  Mail
} from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { InvoiceQuickActions } from './InvoiceQuickActions';

interface InvoiceDetailInlineProps {
  invoice: any;
  onEdit: (id: string) => void;
  onClose: () => void;
}

export function InvoiceDetailInline({ invoice, onEdit, onClose }: InvoiceDetailInlineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return '✓';
      case 'Pending': return '⏳';
      case 'Overdue': return '⚠️';
      default: return '❓';
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked for invoice:', invoice.id);
    onEdit(invoice.id);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Invoice</h1>
                <p className="text-gray-600 font-mono text-lg">{invoice.nomor_invoice}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={getStatusColor(invoice.status)} className="text-sm px-3 py-1">
                <span className="mr-1">{getStatusIcon(invoice.status)}</span>
                {invoice.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button onClick={handleEditClick} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informasi Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Kumiai</p>
                      <p className="font-semibold text-lg">{invoice.kumiai?.nama || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{invoice.kumiai?.kode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Tanggal Invoice</p>
                      <p className="font-semibold">{formatDate(invoice.tanggal_invoice)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Jatuh Tempo</p>
                      <p className="font-semibold">
                        {invoice.tanggal_jatuh_tempo ? formatDate(invoice.tanggal_jatuh_tempo) : 'Tidak ditetapkan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                      <p className="font-semibold text-lg">{invoice.invoice_items?.length || 0} siswa</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          {invoice.invoice_items && invoice.invoice_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Daftar Siswa Magang ({invoice.invoice_items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.invoice_items.map((item: any, index: number) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.siswa_magang?.siswa?.nama || 'Nama tidak tersedia'}
                          </p>
                          {item.keterangan && (
                            <p className="text-sm text-gray-600 mt-1">{item.keterangan}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 font-mono text-lg">
                          {formatCurrency(item.nominal_fee)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keterangan */}
          {invoice.keterangan && (
            <Card>
              <CardHeader>
                <CardTitle>Keterangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 leading-relaxed">{invoice.keterangan}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Total Amount Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CreditCard className="h-5 w-5" />
                Total Nominal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-green-800 font-mono">
                  {formatCurrency(invoice.nominal)}
                </p>
                <p className="text-sm text-green-600">
                  {invoice.invoice_items?.length || 0} item pembayaran
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <InvoiceQuickActions invoice={invoice} onEdit={onEdit} />

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Invoice Dibuat</p>
                    <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                  </div>
                </div>
                {invoice.status === 'Paid' && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-700">Pembayaran Diterima</p>
                      <p className="text-xs text-green-600">Status: Lunas</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
