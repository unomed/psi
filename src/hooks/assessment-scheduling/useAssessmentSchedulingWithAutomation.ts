
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecurrenceType, ChecklistTemplate } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { generateEmployeePortalLink } from "@/services/assessment/portalLinkGeneration";
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

interface ScheduleAssessmentParams {
  employee: any;
  checklist: ChecklistTemplate;
  schedulingDetails: {
    scheduledDate: Date;
    recurrenceType: RecurrenceType;
    phoneNumber: string;
    sendEmail: boolean;
    sendWhatsApp: boolean;
  };
}

export function useAssessmentSchedulingWithAutomation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
        console.log('Executando agendamento com dados:', assessmentData);

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

        // Create the scheduled assessment record first
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
            created_by: user?.id
          })
          .select()
          .single();

        if (scheduleError) {
          console.error("Error creating scheduled assessment:", scheduleError);
          throw new Error(`Erro ao criar agendamento: ${scheduleError.message}`);
        }

        // Generate portal link using the assessment ID
        const linkResult = await generateEmployeePortalLink(
          assessmentData.employeeId,
          scheduledAssessment.id
        );

        if (!linkResult) {
          throw new Error("Falha ao gerar link do portal");
        }

        // Update the assessment with the portal link
        const { error: updateError } = await supabase
          .from('scheduled_assessments')
          .update({ 
            link_url: linkResult.linkUrl,
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', scheduledAssessment.id);

        if (updateError) {
          console.error("Error updating assessment with portal link:", updateError);
          throw new Error("Erro ao salvar link do portal");
        }

        // Schedule automated email reminders if email is enabled
        if (assessmentData.sendEmail && assessmentData.employeeEmail) {
          try {
            await scheduleAssessmentReminders(
              scheduledAssessment.id,
              assessmentData.scheduledDate,
              assessmentData.employeeEmail,
              assessmentData.employeeName,
              assessmentData.templateTitle,
              linkResult.linkUrl
            );
          } catch (reminderError) {
            console.warn("Falha ao agendar lembretes automáticos:", reminderError);
            // Não falhar o agendamento se os lembretes falharem
          }
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
      toast.success("Avaliação agendada com sucesso! Link do portal foi gerado.");
    },
    onError: (error: any) => {
      console.error("Schedule assessment error:", error);
      toast.error(error.message || "Erro ao agendar avaliação");
    }
  });

  const scheduleAssessment = async (params: ScheduleAssessmentParams) => {
    const { employee, checklist, schedulingDetails: details } = params;

    console.log('Dados recebidos para agendamento:', {
      employee,
      checklist,
      details
    });

    // Validação robusta dos dados
    if (!employee) {
      console.error('Funcionário não informado');
      throw new Error("Funcionário não selecionado");
    }

    if (!checklist) {
      console.error('Checklist não informado');
      throw new Error("Checklist não selecionado");
    }

    if (!details.scheduledDate) {
      console.error('Data não informada');
      throw new Error("Data de agendamento não informada");
    }

    if (!employee.id) {
      console.error('ID do funcionário não encontrado', employee);
      throw new Error("ID do funcionário inválido");
    }

    if (!checklist.id) {
      console.error('ID do checklist não encontrado', checklist);
      throw new Error("ID do checklist inválido");
    }

    const companyId = employee.companyId || employee.company_id;
    if (!companyId) {
      console.error('Company ID não encontrado', employee);
      throw new Error("Company ID do funcionário inválido");
    }

    // Verificar se o template existe na base de dados
    const { data: templateExists, error: templateError } = await supabase
      .from('checklist_templates')
      .select('id')
      .eq('id', checklist.id)
      .single();

    if (templateError || !templateExists) {
      console.error('Template não encontrado na base de dados:', checklist.id);
      throw new Error("Template de avaliação não encontrado. Verifique se o template está salvo corretamente.");
    }

    console.log('Validação passou, preparando dados para agendamento');

    const assessmentData: ScheduleAssessmentWithAutomationData = {
      employeeId: employee.id,
      templateId: checklist.id,
      scheduledDate: details.scheduledDate,
      recurrenceType: details.recurrenceType,
      phoneNumber: details.phoneNumber,
      sendEmail: details.sendEmail,
      sendWhatsApp: details.sendWhatsApp,
      companyId: companyId,
      employeeName: employee.name,
      employeeEmail: employee.email || '',
      templateTitle: checklist.title,
      checklistTemplate: checklist
    };

    console.log('Dados finais para mutation:', assessmentData);

    return scheduleAssessmentMutation.mutateAsync(assessmentData);
  };

  return {
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading: scheduleAssessmentMutation.isPending
  };
}
