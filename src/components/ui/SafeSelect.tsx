
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming this is your shadcn select import

interface SafeSelectOption {
  [key: string]: any; // Allow any other properties
}

interface SafeSelectProps<T extends SafeSelectOption> {
  data: T[] | undefined | null;
  value: string | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  labelField?: keyof T | ((item: T) => string);
  valueField?: keyof T | ((item: T) => string | number);
  disabled?: boolean;
  className?: string;
}

export function SafeSelect<T extends SafeSelectOption>({
  data,
  value,
  onChange,
  placeholder,
  labelField = "name",
  valueField = "id",
  disabled = false,
  className,
}: SafeSelectProps<T>) {
  
  const getValue = (item: T): string | number => {
    if (typeof valueField === 'function') {
      return valueField(item);
    }
    return item[valueField];
  };

  const getLabel = (item: T): string => {
    if (typeof labelField === 'function') {
      return labelField(item);
    }
    return item[labelField] || 'Unnamed Item';
  };

  const safeData = (data || [])
    .map(item => {
      // Ensure item is an object and has the value field
      if (typeof item !== 'object' || item === null || getValue(item) === undefined || getValue(item) === null) {
        return null;
      }
      const val = String(getValue(item));
      // Ensure the string value is not empty
      if (val.trim() === "") {
        return null;
      }
      return { ...item, safeValue: val, safeLabel: getLabel(item) };
    })
    .filter(Boolean) as ({ safeValue: string; safeLabel: string } & T)[];

  // Ensure a valid string for the Select value, or an empty string for placeholder behavior
  const selectValue = (value && String(value).trim() !== "") ? String(value) : undefined;

  return (
    <Select value={selectValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {safeData.length > 0 ? (
          safeData.map((item, index) => (
            <SelectItem
              key={item.safeValue || `safe-select-item-${index}`} // Use safeValue for key if possible
              value={item.safeValue}
            >
              {item.safeLabel}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-options-available" disabled>
            {placeholder && safeData.length === 0 && !data ? "Carregando..." : (placeholder || "Nenhuma opção disponível")}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

