
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { generateAssessmentLink } from "@/services/assessment/links";
import { sendSchedulingNotification } from "@/services/notification/schedulingNotificationService";

interface SchedulingDetails {
  scheduledDate?: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

export function useAssessmentScheduling() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [schedulingDetails, setSchedulingDetails] = useState<SchedulingDetails>({
    scheduledDate: undefined,
    recurrenceType: "none",
    phoneNumber: "",
    sendEmail: true,
    sendWhatsApp: false
  });

  const queryClient = useQueryClient();

  const scheduleAssessmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEmployee || !selectedTemplate || !schedulingDetails.scheduledDate) {
        throw new Error("Dados incompletos para agendamento");
      }

      // 1. Gerar link único
      const linkUrl = await generateAssessmentLink(selectedEmployee.id, selectedTemplate.id);
      if (!linkUrl) throw new Error("Erro ao gerar link de avaliação");

      // 2. Calcular próxima data (se recorrente)
      const nextScheduledDate = calculateNextDate(
        schedulingDetails.scheduledDate, 
        schedulingDetails.recurrenceType
      );

      // 3. Salvar agendamento
      const { data: scheduledAssessment, error } = await supabase
        .from('scheduled_assessments')
        .insert({
          employee_id: selectedEmployee.id,
          template_id: selectedTemplate.id,
          employee_name: selectedEmployee.name,
          scheduled_date: schedulingDetails.scheduledDate.toISOString(),
          recurrence_type: schedulingDetails.recurrenceType,
          next_scheduled_date: nextScheduledDate?.toISOString(),
          phone_number: schedulingDetails.phoneNumber || undefined,
          link_url: linkUrl,
          status: 'scheduled',
          company_id: selectedEmployee.company_id
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Enviar notificações
      if (schedulingDetails.sendEmail && selectedEmployee.email) {
        await sendSchedulingNotification({
          type: 'email',
          employeeName: selectedEmployee.name,
          employeeEmail: selectedEmployee.email,
          templateName: selectedTemplate.title,
          scheduledDate: schedulingDetails.scheduledDate,
          linkUrl,
          assessmentId: scheduledAssessment.id
        });
      }

      if (schedulingDetails.sendWhatsApp && schedulingDetails.phoneNumber) {
        await sendSchedulingNotification({
          type: 'whatsapp',
          employeeName: selectedEmployee.name,
          phoneNumber: schedulingDetails.phoneNumber,
          templateName: selectedTemplate.title,
          scheduledDate: schedulingDetails.scheduledDate,
          linkUrl,
          assessmentId: scheduledAssessment.id
        });
      }

      return scheduledAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
    }
  });

  const calculateNextDate = (date: Date, recurrence: RecurrenceType): Date | null => {
    if (recurrence === "none") return null;
    
    const nextDate = new Date(date);
    switch (recurrence) {
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "semiannual":
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case "annual":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    return nextDate;
  };

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment: scheduleAssessmentMutation.mutateAsync,
    isLoading: scheduleAssessmentMutation.isPending
  };
}
