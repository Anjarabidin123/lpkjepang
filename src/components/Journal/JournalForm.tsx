
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { formatCurrency } from '@/lib/formatCurrency';

interface JournalFormProps {
  editingId: string | null;
  onSubmit: (journalData: any, details: any[]) => Promise<void>;
  onCancel: () => void;
}

export function JournalForm({ editingId, onSubmit, onCancel }: JournalFormProps) {
  const { chartOfAccounts, getJournalDetails } = useJournal();
  const [loading, setLoading] = useState(false);
  
  const [journalData, setJournalData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kode_jurnal: '',
    deskripsi: '',
    referensi: '',
    status: 'Draft'
  });

  const [details, setDetails] = useState([
    { akun_id: '', deskripsi: '', debit: 0, kredit: 0 }
  ]);

  useEffect(() => {
    if (editingId) {
      loadJournalData();
    }
  }, [editingId]);

  const loadJournalData = async () => {
    if (!editingId) return;
    
    setLoading(true);
    try {
      const journalDetails = await getJournalDetails(editingId);
      // Load journal data and details here
      // This would require additional API calls to get the journal header
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDetailRow = () => {
    setDetails([...details, { akun_id: '', deskripsi: '', debit: 0, kredit: 0 }]);
  };

  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const updateDetail = (index: number, field: string, value: any) => {
    const updatedDetails = details.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    );
    setDetails(updatedDetails);
  };

  const getTotalDebit = () => details.reduce((sum, detail) => sum + Number(detail.debit), 0);
  const getTotalKredit = () => details.reduce((sum, detail) => sum + Number(detail.kredit), 0);
  const isBalanced = () => getTotalDebit() === getTotalKredit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced()) {
      alert('Journal entry must be balanced (Total Debit = Total Kredit)');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(journalData, details);
    } finally {
      setLoading(false);
    }
  };

  const getAccountOptions = () => {
    return chartOfAccounts.filter(account => account.kategori === 'Detail');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h2>
          <p className="text-sm text-gray-600">Create or edit double-entry journal entries</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Journal Header */}
        <Card>
          <CardHeader>
            <CardTitle>Journal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tanggal">Date</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={journalData.tanggal}
                  onChange={(e) => setJournalData({ ...journalData, tanggal: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="kode_jurnal">Journal Code</Label>
                <Input
                  id="kode_jurnal"
                  value={journalData.kode_jurnal}
                  onChange={(e) => setJournalData({ ...journalData, kode_jurnal: e.target.value })}
                  placeholder="e.g., JV-001"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deskripsi">Description</Label>
              <Textarea
                id="deskripsi"
                value={journalData.deskripsi}
                onChange={(e) => setJournalData({ ...journalData, deskripsi: e.target.value })}
                placeholder="Journal entry description"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="referensi">Reference</Label>
                <Input
                  id="referensi"
                  value={journalData.referensi}
                  onChange={(e) => setJournalData({ ...journalData, referensi: e.target.value })}
                  placeholder="Reference number or document"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={journalData.status}
                  onValueChange={(value) => setJournalData({ ...journalData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Posted">Posted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Journal Details</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addDetailRow}>
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {details.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="lg:col-span-4">
                    <Label>Account</Label>
                    <Select
                      value={detail.akun_id}
                      onValueChange={(value) => updateDetail(index, 'akun_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAccountOptions().map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.kode_akun} - {account.nama_akun}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="lg:col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={detail.deskripsi}
                      onChange={(e) => updateDetail(index, 'deskripsi', e.target.value)}
                      placeholder="Line description"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label>Debit</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.debit}
                      onChange={(e) => updateDetail(index, 'debit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label>Credit</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.kredit}
                      onChange={(e) => updateDetail(index, 'kredit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="lg:col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDetailRow(index)}
                      disabled={details.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Total Debit: {formatCurrency(getTotalDebit())}</strong>
                </div>
                <div>
                  <strong>Total Credit: {formatCurrency(getTotalKredit())}</strong>
                </div>
                <div className={`font-bold ${isBalanced() ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced() ? '✓ Balanced' : '✗ Not Balanced'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !isBalanced()}>
            {loading ? 'Saving...' : editingId ? 'Update Entry' : 'Create Entry'}
          </Button>
        </div>
      </form>
    </div>
  );
}
