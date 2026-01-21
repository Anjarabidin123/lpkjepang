
import React from 'react';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '@/hooks/useSiswaMagangForm';

interface Option {
  id: string;
  label: string;
  value: string;
}

interface BaseFormFieldProps {
  form: UseFormReturn<FormData>;
  name: FieldPath<FormData>;
  label: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  options?: Option[];
  required?: boolean;
}

export function BaseFormField({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  options = [],
  required = false
}: BaseFormFieldProps) {
  console.log(`BaseFormField render for ${name}:`, {
    type,
    currentValue: form.watch(name),
    options: options?.length || 0,
    optionsData: options
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {type === 'select' ? (
              <Select
                value={field.value || ''}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder || `Pilih ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                value={field.value || ''}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                value={field.value || ''}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
