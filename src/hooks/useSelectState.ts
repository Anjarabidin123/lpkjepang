
import { useState, useCallback } from 'react';

interface UseSelectStateOptions {
  initialValue?: string | null;
  onValueChange?: (value: string | undefined) => void;
}

export function useSelectState({ initialValue, onValueChange }: UseSelectStateOptions = {}) {
  const [value, setValue] = useState<string | undefined>(
    initialValue === null || initialValue === "" ? undefined : initialValue || undefined
  );

  const handleValueChange = useCallback((newValue: string | undefined) => {
    setValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const clearValue = useCallback(() => {
    setValue(undefined);
    onValueChange?.(undefined);
  }, [onValueChange]);

  return {
    value,
    setValue: handleValueChange,
    clearValue,
    hasValue: value !== undefined && value !== "",
  };
}
