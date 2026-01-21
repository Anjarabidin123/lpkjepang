
export function formatCurrency(value: number | string, currency: 'IDR' | 'JPY' = 'IDR'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return currency === 'IDR' ? 'Rp 0' : '¥0';
  }
  
  if (currency === 'IDR') {
    // Format with Indonesian Rupiah currency
    const formattedNumber = Math.abs(numValue).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
    
    return `Rp ${formattedNumber}`;
  } else {
    // Format with Japanese Yen currency
    const formattedNumber = Math.abs(numValue).toLocaleString('ja-JP', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
    
    return `¥${formattedNumber}`;
  }
}

export function formatNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue === null || numValue === undefined) return '0';
  
  // Format with Indonesian locale for Rupiah-based system
  return Math.abs(numValue).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  });
}

export function parseFormattedNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  
  // Remove currency symbols and non-numeric characters except comma and dot
  const cleanValue = value
    .replace(/[¥￥Rp]/g, '') // Remove yen and rupiah symbols
    .replace(/[^\d,.-]/g, '') // Remove everything except digits, comma, dot, minus
    .replace(/,/g, '') // Remove commas (thousand separators)
    .replace(/\./g, ''); // Remove dots if used as thousand separators
    
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
}

export function formatNumberInput(value: string): string {
  if (!value || value.trim() === '') return '';
  
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  
  if (numericValue === '') return '';
  
  // Parse and format with Indonesian locale
  const numValue = parseInt(numericValue);
  return numValue.toLocaleString('id-ID', {
    useGrouping: true
  });
}

// Specific formatters for different modules
export function formatIDRCurrency(value: number | string): string {
  return formatCurrency(value, 'IDR');
}

export function formatJPYCurrency(value: number | string): string {
  return formatCurrency(value, 'JPY');
}
