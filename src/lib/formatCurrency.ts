
export function formatCurrency(value: number | string, currency: 'IDR' | 'JPY' = 'IDR'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return currency === 'IDR' ? 'Rp 0' : '¥0';
  }

  if (currency === 'IDR') {
    // Format with Rupiah but use comma separator (US Style) as requested
    const formattedNumber = Math.abs(numValue).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });

    return `Rp ${formattedNumber}`;
  } else {
    // Format with Japanese Yen currency
    const formattedNumber = Math.abs(numValue).toLocaleString('en-US', {
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

  // Format with comma separator
  return Math.abs(numValue).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  });
}

export function parseFormattedNumber(value: string): number {
  if (!value || value.trim() === '') return 0;

  // Remove currency symbols and non-numeric characters except comma and dot
  const cleanValue = value
    .replace(/[¥￥Rp]/g, '') // Remove symbols
    .replace(/[^\d]/g, ''); // Remove everything except digits

  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
}

export function formatNumberInput(value: string): string {
  if (!value || value.trim() === '') return '';

  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');

  if (numericValue === '') return '';

  // Parse and format with comma separator
  const numValue = parseInt(numericValue);
  return numValue.toLocaleString('en-US', {
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
