
import { supabase } from "@/integrations/supabase/client";
import { RecurrenceType } from "@/types";

export function useAssessmentRecurrence() {
  const calculateRecurrence = async (
    selectedEmployee: string,
    scheduledDate: Date
  ) => {
    const { data: employeeWithRole } = await supabase
      .from('employees')
      .select(`
        id,
        roles (
          risk_level
        )
      `)
      .eq('id', selectedEmployee)
      .single();

    const { data: periodicitySettings } = await supabase
      .from('periodicity_settings')
      .select('*')
      .single();

    const riskLevel = employeeWithRole?.roles?.risk_level;
    let suggestedRecurrenceType: RecurrenceType = 'none';

    if (riskLevel && periodicitySettings) {
      switch (riskLevel.toLowerCase()) {
        case 'high':
          suggestedRecurrenceType = periodicitySettings.risk_high_periodicity as RecurrenceType;
          break;
        case 'medium':
          suggestedRecurrenceType = periodicitySettings.risk_medium_periodicity as RecurrenceType;
          break;
        case 'low':
          suggestedRecurrenceType = periodicitySettings.risk_low_periodicity as RecurrenceType;
          break;
        default:
          suggestedRecurrenceType = periodicitySettings.default_periodicity as RecurrenceType;
      }
    }

    let nextScheduledDate = null;
    if (suggestedRecurrenceType !== 'none') {
      nextScheduledDate = new Date(scheduledDate);
      switch (suggestedRecurrenceType) {
        case 'monthly':
          nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
          break;
        case 'semiannual':
          nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 6);
          break;
        case 'annual':
          nextScheduledDate.setFullYear(nextScheduledDate.getFullYear() + 1);
          break;
      }
    }

    return {
      suggestedRecurrenceType,
      nextScheduledDate
    };
  };

  return { calculateRecurrence };
}
