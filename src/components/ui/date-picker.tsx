
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
  const [hasError, setHasError] = React.useState(false);

  // Garantir que a data inicial seja definida corretamente
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, 'dd/MM/yyyy'));
      setHasError(false);
    } else {
      setInputValue('');
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Tentar analisar a data do input
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado em Date
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month, day);
        console.log("Data analisada do input:", parsedDate);
        
        // Verificar se é uma data válida
        if (
          parsedDate.getDate() === day &&
          parsedDate.getMonth() === month &&
          parsedDate.getFullYear() === year &&
          (!disabled || !disabled(parsedDate))
        ) {
          onSelect(parsedDate);
          setHasError(false);
        } else {
          setHasError(true);
        }
      } else {
        setHasError(true);
      }
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    console.log("Data selecionada no calendário:", newDate);
    onSelect(newDate);
    if (newDate) {
      setInputValue(format(newDate, 'dd/MM/yyyy'));
      setHasError(false);
    } else {
      setInputValue('');
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
