
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { useDemografiCountries } from '@/hooks/useDemografiCountries';
import { useDemografiProvinces } from '@/hooks/useDemografiProvinces';
import { useDemografiRegencies } from '@/hooks/useDemografiRegencies';

interface LocationSelectorProps {
  form: UseFormReturn<any>;
  countryCode?: 'ID' | 'JP';
  provinceFieldName?: string;
  regencyFieldName?: string;
  required?: boolean;
}

export function LocationSelector({ 
  form, 
  countryCode = 'ID',
  provinceFieldName = 'demografi_province_id',
  regencyFieldName = 'demografi_regency_id',
  required = false
}: LocationSelectorProps) {
  const { countries } = useDemografiCountries();
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  // Get the selected country ID based on country code
  useEffect(() => {
    if (countries && countries.length > 0) {
      const country = countries.find(c => c.kode === countryCode);
      if (country) {
        setSelectedCountryId(country.id);
      }
    }
  }, [countries, countryCode]);

  const { provinces } = useDemografiProvinces(selectedCountryId || undefined);
  const { regencies } = useDemografiRegencies(selectedProvinceId || undefined);

  // Watch for province changes to update selected province ID
  const watchedProvinceId = form.watch(provinceFieldName);
  useEffect(() => {
    if (watchedProvinceId !== selectedProvinceId) {
      setSelectedProvinceId(watchedProvinceId);
      // Clear regency when province changes
      if (watchedProvinceId !== selectedProvinceId) {
        form.setValue(regencyFieldName, '');
      }
    }
  }, [watchedProvinceId, selectedProvinceId, form, regencyFieldName]);

  const countryLabel = countryCode === 'ID' ? 'Provinsi' : 'Prefecture';
  const regencyLabel = countryCode === 'ID' ? 'Kabupaten/Kota' : 'City/District';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={provinceFieldName}
        rules={required ? { required: `${countryLabel} wajib dipilih` } : undefined}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{countryLabel} {required && '*'}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedProvinceId(value);
                  // Clear regency when province changes
                  form.setValue(regencyFieldName, '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${countryLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.nama} ({province.kode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={regencyFieldName}
        rules={required ? { required: `${regencyLabel} wajib dipilih` } : undefined}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{regencyLabel} {required && '*'}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
                disabled={!selectedProvinceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${regencyLabel}`} />
                </SelectTrigger>
                <SelectContent>
                  {regencies?.map((regency) => (
                    <SelectItem key={regency.id} value={regency.id}>
                      {regency.nama} ({regency.kode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
