
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { LocationSelector as BaseLocationSelector } from '@/components/LocationSelector/LocationSelector';

interface LocationSelectorProps {
  form: UseFormReturn<FormData>;
}

export function LocationSelector({ form }: LocationSelectorProps) {
  return (
    <BaseLocationSelector
      form={form}
      countryCode="JP"
      provinceFieldName="demografi_province_id"
      regencyFieldName="demografi_regency_id"
      required={false}
    />
  );
}
