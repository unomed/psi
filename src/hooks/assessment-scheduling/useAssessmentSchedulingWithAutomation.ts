import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecurrenceType, ChecklistTemplate } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { generateUniqueAssessmentLink } from "@/services/assessment/linkGeneration";
import { scheduleAssessmentReminders } from "@/services/assessment/automationService";

interface ScheduleAssessmentWithAutomationData {
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
  companyId: string;
  employeeName: string;
  employeeEmail: string;
  templateTitle: string;
  checklistTemplate: ChecklistTemplate;
}

export function useAssessmentSchedulingWithAutomation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistTemplate | null>(null);
  const [schedulingDetails, setSchedulingDetails] = useState({
    scheduledDate: new Date(),
    recurrenceType: "none" as RecurrenceType,
    phoneNumber: "",
    sendEmail: true,
    sendWhatsApp: false
  });

  const scheduleAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: ScheduleAssessmentWithAutomationData) => {
      try {
        // Generate the assessment link
        const linkResult = await generateUniqueAssessmentLink(
          assessmentData.templateId,
          assessmentData.employeeId,
          7 // expires in 7 days
        );

        if (!linkResult) {
          throw new Error("Falha ao gerar link de avaliação");
        }

        // Calculate next scheduled date if recurrence is set
        let nextScheduledDate: Date | null = null;
        if (assessmentData.recurrenceType !== "none") {
          nextScheduledDate = new Date(assessmentData.scheduledDate);
          switch (assessmentData.recurrenceType) {
            case "monthly":
              nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
              break;
            case "quarterly":
              nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 3);
              break;
            case "semiannual":
              nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 6);
              break;
            case "annual":
              nextScheduledDate.setFullYear(nextScheduledDate.getFullYear() + 1);
              break;
          }
        }

        // Create the scheduled assessment record
        const { data: scheduledAssessment, error: scheduleError } = await supabase
          .from('scheduled_assessments')
          .insert({
            employee_id: assessmentData.employeeId,
            template_id: assessmentData.templateId,
            scheduled_date: assessmentData.scheduledDate.toISOString(),
            status: 'scheduled',
            recurrence_type: assessmentData.recurrenceType,
            next_scheduled_date: nextScheduledDate?.toISOString(),
            phone_number: assessmentData.phoneNumber,
            company_id: assessmentData.companyId,
            employee_name: assessmentData.employeeName,
            link_url: linkResult.linkUrl,
            created_by: user?.id
          })
          .select()
          .single();

        if (scheduleError) {
          console.error("Error creating scheduled assessment:", scheduleError);
          throw new Error("Erro ao agendar avaliação");
        }

        // Schedule automated email reminders if email is enabled
        if (assessmentData.sendEmail && assessmentData.employeeEmail) {
          await scheduleAssessmentReminders(
            scheduledAssessment.id,
            assessmentData.scheduledDate,
            assessmentData.employeeEmail,
            assessmentData.employeeName,
            assessmentData.templateTitle,
            linkResult.linkUrl
          );
        }

        return {
          success: true,
          assessmentId: scheduledAssessment.id,
          linkUrl: linkResult.linkUrl
        };
      } catch (error) {
        console.error("Error in scheduleAssessment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success("Avaliação agendada com sucesso! Emails automáticos foram configurados.");
    },
    onError: (error: any) => {
      console.error("Schedule assessment error:", error);
      toast.error(error.message || "Erro ao agendar avaliação");
    }
  });

  const scheduleAssessment = async () => {
    if (!selectedEmployee || !selectedChecklist || !schedulingDetails.scheduledDate) {
      throw new Error("Dados incompletos para agendamento");
    }

    const assessmentData: ScheduleAssessmentWithAutomationData = {
      employeeId: selectedEmployee.id,
      templateId: selectedChecklist.id,
      scheduledDate: schedulingDetails.scheduledDate,
      recurrenceType: schedulingDetails.recurrenceType,
      phoneNumber: schedulingDetails.phoneNumber,
      sendEmail: schedulingDetails.sendEmail,
      sendWhatsApp: schedulingDetails.sendWhatsApp,
      companyId: selectedEmployee.companyId || selectedEmployee.company_id,
      employeeName: selectedEmployee.name,
      employeeEmail: selectedEmployee.email || '',
      templateTitle: selectedChecklist.title,
      checklistTemplate: selectedChecklist
    };

    return scheduleAssessmentMutation.mutateAsync(assessmentData);
  };

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedChecklist,
    setSelectedChecklist,
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading: scheduleAssessmentMutation.isPending
  };
}
