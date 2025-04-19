
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

  // Verificar se a data é válida
  const isValidDate = (d: any): boolean => {
    return d instanceof Date && !isNaN(d.getTime());
  };

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
    
    // Tentar analisar a data do input
    if (value.trim() === '') {
      // Se o campo estiver vazio, definir a data como undefined
      console.log("DatePicker: Input vazio, definindo data como undefined");
      onSelect(undefined);
      setHasError(false);
      return;
    }
    
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado em Date
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const parsedDate = new Date(year, month, day);
        parsedDate.setHours(0, 0, 0, 0); // Garantir que a hora seja 00:00:00
        
        console.log("DatePicker: Data analisada do input:", parsedDate, 
          "Dia:", day, "Mês:", month, "Ano:", year,
          "Timestamp:", parsedDate.getTime());
        
        // Verificar se é uma data válida
        if (
          parsedDate.getDate() === day &&
          parsedDate.getMonth() === month &&
          parsedDate.getFullYear() === year &&
          isValidDate(parsedDate) &&
          (!disabled || !disabled(parsedDate))
        ) {
          // Se a data for válida, notificar o componente pai
          console.log("DatePicker: Data válida do input, notificando componente pai");
          onSelect(parsedDate);
          setHasError(false);
        } else {
          console.log("DatePicker: Data inválida do input", 
            "getDate():", parsedDate.getDate(), 
            "getMonth():", parsedDate.getMonth(), 
            "getFullYear():", parsedDate.getFullYear(),
            "isValidDate:", isValidDate(parsedDate),
            "disabled:", disabled ? disabled(parsedDate) : false);
          // Se a data for inválida, manter o valor no input mas não notificar o componente pai
          setHasError(true);
        }
      } else {
        console.log("DatePicker: Partes da data não são números", day, month, year);
        // Se os valores não forem números, manter o valor no input mas não notificar o componente pai
        setHasError(true);
      }
    } else {
      console.log("DatePicker: Formato não é DD/MM/YYYY", parts);
      // Se o formato não for DD/MM/YYYY, marcar como erro apenas se não estiver vazio
      setHasError(value.length > 0);
    }
  };

  const handleCalendarSelect = (newDate: Date | undefined) => {
    console.log("DatePicker: Data selecionada no calendário:", newDate,
      newDate instanceof Date ? `Timestamp: ${newDate.getTime()}` : "");
    
    // Verificar se a data é válida antes de notificar o componente pai
    if (newDate === undefined || isValidDate(newDate)) {
      if (newDate && isValidDate(newDate)) {
        // Criar uma nova instância de Date para evitar problemas de referência
        const safeDate = new Date(newDate.getTime());
        safeDate.setHours(0, 0, 0, 0); // Garantir que a hora seja 00:00:00
        
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
    } else {
      console.error("DatePicker: Tentativa de selecionar data inválida:", newDate);
      setHasError(true);
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
