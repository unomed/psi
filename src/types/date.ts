
import { type DayPickerRangeProps } from 'react-day-picker';

// Define the DateRange type based on what react-day-picker uses
export interface DateRange {
  from: Date | undefined;
  to?: Date;
}

export type DateRangePickerProps = DayPickerRangeProps & {
  className?: string;
};
