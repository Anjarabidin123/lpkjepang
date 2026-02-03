/**
 * Menformat angka menjadi format ribuan dengan koma atau titik
 * Contoh: 1000000 -> 1,000,000
 */
export const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '0';

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) return '0';

    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Menformat angka menjadi format Rupiah atau Mata Uang lainnya
 * Contoh: 1000000 -> Rp 1,000,000
 */
export const formatCurrency = (value: number | string | null | undefined, currency: string = 'Rp'): string => {
    return `${currency} ${formatNumber(value)}`;
};

/**
 * Khusus untuk Yen Jepang (biasanya tanpa desimal)
 */
export const formatYen = (value: number | string | null | undefined): string => {
    return `¥ ${formatNumber(value)}`;
};
