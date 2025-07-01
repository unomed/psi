
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
import { isValidDate, parseDateString, createSafeDate } from "@/utils/dateUtils";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  allowInput?: boolean;
}

export function DatePicker({ date, onSelect, disabled, allowInput = true }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(date ? format(date, 'dd/MM/yyyy') : '');
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Garantir que a data inicial seja definida corretamente
  React.useEffect(() => {
    if (date && isValidDate(date)) {
      const formattedDate = format(date, 'dd/MM/yyyy');
      console.log("DatePicker: Atualizando inputValue com data formatada:", formattedDate, 
        "Data original:", date, "Timestamp:", date.getTime());
      setInputValue(formattedDate);
      setHasError(false);
    } else if (date === undefined) {
      console.log("DatePicker: Data é undefined, limpando input");
      setInputValue('');
      setHasError(false);
    } else if (date !== undefined && !isValidDate(date)) {
      console.log("DatePicker: Data inválida detectada:", date, 
        "instanceof Date:", date instanceof Date,
        "isNaN check:", date instanceof Date ? isNaN(date.getTime()) : "N/A");
      setInputValue('');
      setHasError(true);
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If input is empty, reset date
    if (value.trim() === '') {
      console.log("DatePicker: Input vazio, definindo data como undefined");
      onSelect(undefined);
      setHasError(false);
      return;
    }
    
    // Use our utility to parse date string
    const parsedDate = parseDateString(value);
    
    if (parsedDate) {
      console.log("DatePicker: Data analisada do input:", parsedDate, "Timestamp:", parsedDate.getTime());
      
      // Check if date is disabled
      if (disabled && disabled(parsedDate)) {
        console.log("DatePicker: Data desabilitada:", parsedDate);
        setHasError(true);
        return;
      }
      
      // Date is valid and enabled
      console.log("DatePicker: Data válida do input, notificando componente pai");
      onSelect(parsedDate);
      setHasError(false);
    } else {
      // Only show error if user has typed something
      setHasError(value.length > 0);
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    console.log("DatePicker: Data selecionada no calendário:", newDate,
      newDate instanceof Date ? `Timestamp: ${newDate.getTime()}` : "");
    
    // Use our utility to validate and safely create a date
    if (newDate && isValidDate(newDate)) {
      const safeDate = createSafeDate(newDate);
      
      console.log("DatePicker: Criando nova instância de data:", safeDate, "Timestamp:", safeDate.getTime());
      onSelect(safeDate);
      setInputValue(format(safeDate, 'dd/MM/yyyy'));
      setHasError(false);
    } else {
      console.log("DatePicker: Data undefined ou inválida do calendário");
      onSelect(undefined);
      setInputValue('');
      setHasError(false);
    }
    
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {allowInput ? (
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder="DD/MM/AAAA"
              className={cn(
                "w-full pr-10",
                hasError && "border-red-500 focus:border-red-500"
              )}
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
              !date && "text-muted-foreground",
              hasError && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && isValidDate(date) ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date && isValidDate(date) ? date : undefined}
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
