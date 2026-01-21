
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Upload, FileDown, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { exportToExcel, createImportTemplate, parseExcelFile, type ExportColumn } from '@/utils/excelUtils';

interface ExportImportActionsProps<T> {
  data: T[];
  columns: ExportColumn[];
  filename: string;
  onImport: (data: T[]) => Promise<void>;
  isImporting?: boolean;
}

export function ExportImportActions<T>({ 
  data, 
  columns, 
  filename, 
  onImport,
  isImporting = false 
}: ExportImportActionsProps<T>) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<T[] | null>(null);

  const handleExport = () => {
    try {
      if (!data || data.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      console.log('Starting export process for', data.length, 'records');
      
      // Check for potentially problematic data
      const hasLongData = data.some(item => 
        Object.values(item || {}).some(value => 
          typeof value === 'string' && value.length > 30000
        )
      );

      if (hasLongData) {
        toast.warning('Data mengandung teks panjang yang akan dipotong sesuai batas Excel', {
          description: 'Data yang terpotong akan ditandai dengan ...[cut]'
        });
      }

      exportToExcel(data, columns, filename);
      toast.success(`Data berhasil diekspor ke ${filename}.xlsx`, {
        description: `${data.length} record berhasil diekspor`
      });
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes('32767') || errorMessage.includes('character')) {
        toast.error('Data terlalu panjang untuk Excel', {
          description: 'Beberapa field akan dipotong agar sesuai dengan batas Excel'
        });
      } else {
        toast.error('Gagal mengekspor data', {
          description: errorMessage
        });
      }
    }
  };

  const handleDownloadTemplate = () => {
    try {
      createImportTemplate(columns, filename);
      toast.success(`Template berhasil diunduh: ${filename}_template.xlsx`, {
        description: 'Silakan isi template sesuai format yang disediakan'
      });
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Gagal mengunduh template', {
        description: (error as Error).message
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Format file tidak didukung', {
          description: 'Hanya file Excel (.xlsx, .xls) yang diperbolehkan'
        });
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File terlalu besar', {
          description: 'Maksimal ukuran file adalah 10MB'
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Preview data
      try {
        toast.info('Memproses file...', {
          description: 'Sedang membaca dan memvalidasi data'
        });
        
        const parsedData = await parseExcelFile<T>(file, columns);
        setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows for preview
        
        if (parsedData.length === 0) {
          toast.warning('File kosong atau tidak memiliki data valid');
        } else {
          toast.success(`File berhasil dibaca: ${parsedData.length} baris data`, {
            description: 'Preview data ditampilkan di bawah'
          });
        }
      } catch (error) {
        console.error('File preview error:', error);
        toast.error('Error membaca file', {
          description: (error as Error).message
        });
        setSelectedFile(null);
        setPreviewData(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    setIsProcessing(true);
    try {
      const parsedData = await parseExcelFile<T>(selectedFile, columns);
      console.log('Parsed import data:', parsedData);
      
      if (parsedData.length === 0) {
        toast.error('File tidak memiliki data yang valid');
        return;
      }

      // Check for truncated data warning
      const hasTruncatedData = JSON.stringify(parsedData).includes('...[cut]');
      if (hasTruncatedData) {
        toast.warning('Beberapa data terpotong terdeteksi', {
          description: 'Data yang terpotong mungkin tidak lengkap'
        });
      }

      await onImport(parsedData);
      setImportDialogOpen(false);
      setSelectedFile(null);
      setPreviewData(null);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Gagal mengimpor data', {
        description: (error as Error).message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setImportDialogOpen(false);
    setSelectedFile(null);
    setPreviewData(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileDown className="w-4 h-4" />
            Export/Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel ({data?.length || 0} data)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownloadTemplate}>
            <FileDown className="w-4 h-4 mr-2" />
            Download Template
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={importDialogOpen} onOpenChange={resetDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Data dari Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Petunjuk Import:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Download template Excel terlebih dahulu</li>
                    <li>Isi data sesuai format yang disediakan</li>
                    <li>Pastikan kolom wajib diisi dengan benar</li>
                    <li>Upload file Excel yang sudah diisi</li>
                    <li>Maksimal ukuran file: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Excel limitations warning */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Perhatian:</p>
                  <p>Excel memiliki batas 32,767 karakter per sel. Data yang terlalu panjang akan dipotong otomatis.</p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="file-upload">Pilih File Excel</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Format yang didukung: .xlsx, .xls (Maksimal ukuran file: 10MB)
              </p>
            </div>
            
            {selectedFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      File berhasil dipilih: {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {previewData && previewData.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <p className="text-sm font-medium">Preview Data (5 baris pertama)</p>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {columns.slice(0, 8).map((col, index) => (
                          <th key={index} className="px-3 py-2 text-left font-medium">
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row: any, index) => (
                        <tr key={index} className="border-t">
                          {columns.slice(0, 8).map((col, colIndex) => {
                            const value = col.key.split('.').reduce((obj, key) => obj?.[key], row);
                            const displayValue = value || '-';
                            const isTruncated = typeof displayValue === 'string' && displayValue.includes('...[cut]');
                            return (
                              <td key={colIndex} className="px-3 py-2">
                                <span className={isTruncated ? 'text-amber-600' : ''}>
                                  {displayValue}
                                </span>
                                {isTruncated && (
                                  <span className="text-xs text-amber-500 ml-1">(terpotong)</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetDialog}
                disabled={isProcessing || isImporting}
              >
                Batal
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isProcessing || isImporting}
                className="min-w-24"
              >
                {isProcessing || isImporting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  'Import'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
