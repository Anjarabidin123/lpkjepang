
export const formatRibuan = (value: string | number): string => {
    if (!value) return '';
    const val = value.toString().replace(/\D/g, '');
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseRibuan = (value: string): number => {
    return parseInt(value.replace(/\./g, '')) || 0;
};

export const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: number) => void) => {
    const formatted = formatRibuan(e.target.value);
    e.target.value = formatted;
    onChange(parseRibuan(formatted));
};
