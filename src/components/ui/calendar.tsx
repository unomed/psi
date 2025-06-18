
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getButtonClasses } from "@/components/ui/button";

export interface CalendarProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => void;
  disabled?: (date: Date) => boolean;
  showOutsideDays?: boolean;
  initialFocus?: boolean;
  defaultMonth?: Date;
  numberOfMonths?: number;
  locale?: any; // Using any for locale since it can be from date-fns
}

function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  disabled,
  showOutsideDays = true,
  initialFocus,
  defaultMonth,
  numberOfMonths = 1,
  locale,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(defaultMonth || new Date());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      if (mode === "single") {
        onSelect?.(date);
      }
    }
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split('T')[0];
  };

  const getSelectedDate = () => {
    if (mode === "single" && selected instanceof Date) {
      return formatDateForInput(selected);
    }
    return "";
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    if (locale?.code === 'pt-BR' || locale?.formatLong) {
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className={cn("p-3 pointer-events-auto", className)} {...props}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <button
            type="button"
            className={cn(
              getButtonClasses({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
            )}
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="text-sm font-medium">
            {formatMonthYear(currentMonth)}
          </div>
          
          <button
            type="button"
            className={cn(
              getButtonClasses({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
            )}
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecionar data:</label>
          <input
            type="date"
            value={getSelectedDate()}
            onChange={handleDateChange}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
