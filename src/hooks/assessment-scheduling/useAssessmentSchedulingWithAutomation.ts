
import { useState } from "react";
import { Employee, ChecklistTemplate, RecurrenceType } from "@/types";
import { useAssessmentScheduling } from "./useAssessmentScheduling";
import { useAssessmentSaveOperations } from "../assessments/operations/useAssessmentSaveOperations";

interface SchedulingDetails {
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

interface ScheduleAssessmentParams {
  employee: { id: string };
  checklist: ChecklistTemplate;
  schedulingDetails: SchedulingDetails;
}

export function useAssessmentSchedulingWithAutomation() {
  const baseScheduling = useAssessmentScheduling();
  const { saveAssessment, isSaving } = useAssessmentSaveOperations();
  
  const [schedulingDetails, setSchedulingDetails] = useState<SchedulingDetails>({
    scheduledDate: new Date(),
    recurrenceType: "none",
    phoneNumber: "",
    sendEmail: true,
    sendWhatsApp: false
  });

  const scheduleAssessment = async (params: ScheduleAssessmentParams) => {
    const { employee, checklist, schedulingDetails } = params;
    
    try {
      await saveAssessment({
        employeeId: employee.id,
        templateId: checklist.id,
        scheduledDate: schedulingDetails.scheduledDate,
        recurrenceType: schedulingDetails.recurrenceType,
        phoneNumber: schedulingDetails.phoneNumber
      });
    } catch (error) {
      throw error;
    }
  };
  
  return {
    ...baseScheduling,
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading: isSaving
  };
}
