
import * as XLSX from 'xlsx';

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
}

// Excel cell character limit
const EXCEL_CELL_LIMIT = 32767;

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  // Create worksheet data with headers
  const wsData = [
    columns.map(col => col.header),
    ...data.map(item => 
      columns.map(col => {
        const value = getNestedValue(item, col.key);
        return formatCellValue(value);
      })
    )
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map(col => ({ width: col.width || 20 }));
  ws['!cols'] = colWidths;

  // Style headers
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E2E8F0' } }
    };
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function createImportTemplate(
  columns: ExportColumn[],
  filename: string
): void {
  const wsData = [columns.map(col => col.header)];
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  const colWidths = columns.map(col => ({ width: col.width || 20 }));
  ws['!cols'] = colWidths;
  
  // Style headers
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E2E8F0' } }
    };
  }
  
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, `${filename}_template.xlsx`);
}

export function parseExcelFile<T>(
  file: File,
  columns: ExportColumn[]
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error('File harus memiliki header dan minimal 1 baris data'));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as any[][];
        
        const parsedData = dataRows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map(row => {
            const item: any = {};
            columns.forEach((col, index) => {
              const headerIndex = headers.findIndex(h => h === col.header);
              if (headerIndex !== -1) {
                const cellValue = row[headerIndex];
                const parsedValue = parseCellValue(cellValue, col.key);
                setNestedValue(item, col.key, parsedValue);
              }
            });
            return item as T;
          });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error('Error parsing Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsBinaryString(file);
  });
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

function formatCellValue(value: any): any {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Ya' : 'Tidak';
  }
  
  if (typeof value === 'object' && value !== null) {
    const jsonString = JSON.stringify(value);
    // Truncate if exceeds Excel limit
    return jsonString.length > EXCEL_CELL_LIMIT 
      ? jsonString.substring(0, EXCEL_CELL_LIMIT - 10) + '...[cut]'
      : jsonString;
  }
  
  if (typeof value === 'string') {
    // Truncate long strings to fit Excel cell limit
    return value.length > EXCEL_CELL_LIMIT 
      ? value.substring(0, EXCEL_CELL_LIMIT - 10) + '...[cut]'
      : value;
  }
  
  return value;
}

function parseCellValue(value: any, key: string): any {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  // Handle boolean fields
  if (key.includes('buta_warna') || key.includes('is_available')) {
    const strValue = String(value).toLowerCase();
    return strValue === 'ya' || strValue === 'true' || strValue === '1';
  }
  
  // Handle numeric fields
  if (key.includes('umur') || key.includes('tinggi_badan') || key.includes('berat_badan') || 
      key.includes('ukuran_sepatu') || key.includes('tahun_masuk') || key.includes('tahun_lulus') ||
      key.includes('gaji') || key.includes('ukuran_kepala') || key.includes('ukuran_pinggang')) {
    const numValue = Number(value);
    return isNaN(numValue) ? null : numValue;
  }
  
  // Handle date fields
  if (key.includes('tanggal_')) {
    if (typeof value === 'number') {
      // Excel date serial number
      const date = new Date((value - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    if (typeof value === 'string' && value.includes('/')) {
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const parts = value.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      }
    }
    return value;
  }
  
  // Handle truncated values during import
  const stringValue = String(value);
  if (stringValue.endsWith('...[cut]')) {
    console.warn(`Warning: Truncated data detected for field ${key}. Original data may be incomplete.`);
    return stringValue.replace('...[cut]', '');
  }
  
  return stringValue.trim();
}
