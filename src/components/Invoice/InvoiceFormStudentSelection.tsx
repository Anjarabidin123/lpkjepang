
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface InvoiceFormStudentSelectionProps {
  editingId: string | null;
  filteredSiswaMagang: any[];
  selectedSiswa: string[];
  selectedMonths: string[];
  selectedYear: string;
  onSiswaChange: (siswaId: string, checked: boolean) => void;
  onMonthChange: (month: string, checked: boolean) => void;
  onYearChange: (year: string) => void;
}

const months = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
];

const years = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() + i - 2;
  return { value: year.toString(), label: year.toString() };
});

export function InvoiceFormStudentSelection({
  editingId,
  filteredSiswaMagang,
  selectedSiswa,
  selectedMonths,
  selectedYear,
  onSiswaChange,
  onMonthChange,
  onYearChange
}: InvoiceFormStudentSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Pilih Siswa Magang</Label>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
          {filteredSiswaMagang.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada siswa magang aktif untuk kumiai ini</p>
          ) : (
            filteredSiswaMagang.map((siswa) => (
              <div key={siswa.id} className="flex items-center space-x-2">
                <Checkbox
                  id={siswa.id}
                  checked={selectedSiswa.includes(siswa.id)}
                  onCheckedChange={(checked) => onSiswaChange(siswa.id, checked as boolean)}
                />
                <Label htmlFor={siswa.id} className="text-sm font-normal">
                  {siswa.siswa?.nama || 'N/A'}
                </Label>
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Dipilih: {selectedSiswa.length} siswa
        </p>
      </div>

      {!editingId && (
        <>
          <div>
            <Label>Pilih Tahun</Label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Pilih Bulan</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {months.map((month) => (
                <div key={month.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={month.value}
                    checked={selectedMonths.includes(month.value)}
                    onCheckedChange={(checked) => onMonthChange(month.value, checked as boolean)}
                  />
                  <Label htmlFor={month.value} className="text-sm font-normal">
                    {month.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dipilih: {selectedMonths.length} bulan
            </p>
          </div>
        </>
      )}
    </div>
  );
}
