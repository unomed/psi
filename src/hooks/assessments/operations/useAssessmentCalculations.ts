
import { RecurrenceType } from "@/types";

export function useAssessmentCalculations() {
  const calculateNextScheduledDate = (currentDate: Date, recurrenceType: RecurrenceType): Date | null => {
    if (recurrenceType === "none") return null;
    
    const nextDate = new Date(currentDate);
    
    switch (recurrenceType) {
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "semiannual":
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case "annual":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return null;
    }
    
    return nextDate;
  };

  return {
    calculateNextScheduledDate
  };
}
