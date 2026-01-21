
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { JournalEntry } from '@/hooks/useJournal';

interface JournalTableProps {
  data: JournalEntry[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function JournalTable({ data, loading, onEdit, onDelete }: JournalTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Posted':
        return <Badge variant="default">Posted</Badge>;
      case 'Draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDelete = (id: string, kode_jurnal: string) => {
    if (window.confirm(`Are you sure you want to delete journal entry ${kode_jurnal}?`)) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Journal Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Total Debit</TableHead>
            <TableHead className="text-right">Total Credit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No journal entries found
              </TableCell>
            </TableRow>
          ) : (
            data.map((journal) => (
              <TableRow key={journal.id}>
                <TableCell>{formatDate(journal.tanggal)}</TableCell>
                <TableCell className="font-medium">{journal.kode_jurnal}</TableCell>
                <TableCell className="max-w-xs truncate" title={journal.deskripsi}>
                  {journal.deskripsi}
                </TableCell>
                <TableCell>{journal.referensi || '-'}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(journal.total_debit)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(journal.total_kredit)}
                </TableCell>
                <TableCell>{getStatusBadge(journal.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(journal.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(journal.id, journal.kode_jurnal)}
                      disabled={journal.status === 'Posted'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
