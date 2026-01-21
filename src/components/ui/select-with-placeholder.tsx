
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectWithPlaceholderProps {
  value?: string | null;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SelectWithPlaceholder({
  value,
  onValueChange,
  placeholder = "Pilih...",
  children,
  disabled,
  className
}: SelectWithPlaceholderProps) {
  // Convert empty string or null to undefined for proper placeholder display
  const selectValue = value === "" || value === null ? undefined : value;
  
  const handleValueChange = (newValue: string) => {
    // Handle the special empty placeholder value
    if (newValue === "__empty__") {
      onValueChange(undefined);
    } else {
      onValueChange(newValue);
    }
  };

  return (
    <Select value={selectValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__empty__">
          <span className="text-muted-foreground">{placeholder}</span>
        </SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}
