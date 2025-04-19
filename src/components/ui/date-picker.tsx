
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  allowInput?: boolean;
}

export function DatePicker({ date, onSelect, disabled, allowInput = true }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(date ? format(date, 'dd/MM/yyyy') : '');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the date from the input
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month, day);
        
        // Check if it's a valid date (some combinations like 31/02/2023 would create a valid Date object but with wrong month)
        if (
          parsedDate.getDate() === day &&
          parsedDate.getMonth() === month &&
          parsedDate.getFullYear() === year &&
          (!disabled || !disabled(parsedDate))
        ) {
          onSelect(parsedDate);
        }
      }
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    onSelect(newDate);
    if (newDate) {
      setInputValue(format(newDate, 'dd/MM/yyyy'));
    } else {
      setInputValue('');
    }
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, 'dd/MM/yyyy'));
    } else {
      setInputValue('');
    }
  }, [date]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {allowInput ? (
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              className="w-full pr-10"
              onClick={() => setIsOpen(true)}
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer" 
                        onClick={() => setIsOpen(true)} />
          </div>
        ) : (
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleCalendarSelect}
          disabled={disabled}
          locale={ptBR}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
