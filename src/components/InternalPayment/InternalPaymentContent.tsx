
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { InternalPaymentTable } from './InternalPaymentTable';
import { InternalPaymentForm } from './InternalPaymentForm';
import { InternalPaymentDetail } from './InternalPaymentDetail';
import { InternalPaymentFilters } from './InternalPaymentFilters';
import { useInternalPayment, type InternalPayment } from '@/hooks/useInternalPayment';
import { usePembayaranPrint } from '@/hooks/usePembayaranPrint';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';

export function InternalPaymentContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<InternalPayment | null>(null);
  const [viewingPayment, setViewingPayment] = useState<InternalPayment | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    metode_pembayaran: '',
    tanggal_dari: '',
    tanggal_sampai: ''
  });
  
  const { 
    payments, 
    loading, 
    deletePayment, 
    fetchPayments,
    isAuthenticated 
  } = useInternalPayment();
  
  const { printReceipt } = usePembayaranPrint();
  const { toast } = useToast();

  // Filter payments based on filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !filters.search || 
      payment.siswa?.nama?.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.item_pembayaran?.nama_item?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || payment.status === filters.status;
    
    const matchesMetode = !filters.metode_pembayaran || 
      payment.metode_pembayaran === filters.metode_pembayaran;
    
    const matchesTanggalDari = !filters.tanggal_dari || 
      new Date(payment.tanggal_pembayaran) >= new Date(filters.tanggal_dari);
    
    const matchesTanggalSampai = !filters.tanggal_sampai || 
      new Date(payment.tanggal_pembayaran) <= new Date(filters.tanggal_sampai);
    
    return matchesSearch && matchesStatus && matchesMetode && matchesTanggalDari && matchesTanggalSampai;
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField as keyof InternalPayment];
    let bValue = b[sortField as keyof InternalPayment];
    
    // Handle nested objects
    if (sortField === 'siswa.nama') {
      aValue = a.siswa?.nama || '';
      bValue = b.siswa?.nama || '';
    } else if (sortField === 'item_pembayaran.nama_item') {
      aValue = a.item_pembayaran?.nama_item || '';
      bValue = b.item_pembayaran?.nama_item || '';
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleEdit = (payment: InternalPayment) => {
    setEditingPayment(payment);
    setShowForm(true);
    setViewingPayment(null);
  };

  const handleView = (payment: InternalPayment) => {
    setViewingPayment(payment);
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseDetail = () => {
    setViewingPayment(null);
  };

  const handleFormSubmit = () => {
    handleCloseForm();
  };

  const handlePrint = (payment: InternalPayment) => {
    try {
      const printData = {
        id: payment.id,
        siswa: payment.siswa,
        item_pembayaran: payment.item_pembayaran,
        nominal: payment.nominal,
        tanggal_pembayaran: payment.tanggal_pembayaran,
        metode_pembayaran: payment.metode_pembayaran
      };
      printReceipt(printData);
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast({
        title: "Error",
        description: "Gagal mencetak kwitansi",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
      try {
        await deletePayment(id);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  if (showForm) {
    return (
      <ErrorBoundary>
        <InternalPaymentForm
          editingPayment={editingPayment}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      </ErrorBoundary>
    );
  }

  if (viewingPayment) {
    return (
      <ErrorBoundary>
        <InternalPaymentDetail
          payment={viewingPayment}
          onClose={handleCloseDetail}
          onPrint={handlePrint}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Manajemen Biaya Pelatihan</h2>
            <p className="text-sm text-gray-600">Kelola transaksi pembayaran biaya pelatihan siswa</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Perbarui
            </Button>
            <Button onClick={() => setShowForm(true)} disabled={!isAuthenticated}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pembayaran
            </Button>
          </div>
        </div>

        <InternalPaymentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <InternalPaymentTable
          data={sortedPayments}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onPrint={handlePrint}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </ErrorBoundary>
  );
}
