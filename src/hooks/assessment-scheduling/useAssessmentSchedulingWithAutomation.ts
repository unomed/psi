
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
        console.log('Executando agendamento com automação:', assessmentData);

        // Calcular próxima data agendada se houver recorrência
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

        // Verificar se já existe agendamento para este funcionário, template e data específica
        const { data: existingAssessment, error: checkError } = await supabase
          .from('scheduled_assessments')
          .select('id, scheduled_date')
          .eq('employee_id', assessmentData.employeeId)
          .eq('template_id', assessmentData.templateId)
          .eq('scheduled_date', assessmentData.scheduledDate.toISOString().split('T')[0])
          .neq('status', 'completed')
          .maybeSingle();

        if (checkError) {
          console.error("Erro ao verificar agendamento existente:", checkError);
        }

        if (existingAssessment) {
          throw new Error(`Já existe um agendamento para ${assessmentData.employeeName} na data ${new Date(assessmentData.scheduledDate).toLocaleDateString('pt-BR')} com este template. Para reagendar, escolha uma data diferente.`);
        }

        // Criar o registro de agendamento primeiro
        const { data: scheduledAssessment, error: scheduleError } = await supabase
          .from('scheduled_assessments')
          .insert({
            employee_id: assessmentData.employeeId,
            template_id: assessmentData.templateId,
            scheduled_date: assessmentData.scheduledDate.toISOString(),
            due_date: assessmentData.scheduledDate.toISOString(), // Definir due_date igual ao scheduled_date
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
          console.error("Erro ao criar agendamento:", scheduleError);
          throw new Error(`Erro ao criar agendamento: ${scheduleError.message}`);
        }

        // Gerar link do portal com dados completos
        const linkResult = await generateEmployeePortalLink(
          assessmentData.employeeId,
          scheduledAssessment.id,
          assessmentData.templateId,
          assessmentData.templateTitle
        );

        if (!linkResult) {
          throw new Error("Falha ao gerar link do portal");
        }

        // Atualizar o agendamento com o link gerado
        const { error: updateError } = await supabase
          .from('scheduled_assessments')
          .update({ 
            link_url: linkResult.linkUrl,
            portal_token: linkResult.portalToken,
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', scheduledAssessment.id);

        if (updateError) {
          console.error("Erro ao atualizar agendamento com link:", updateError);
          throw new Error("Erro ao salvar link do portal");
        }

        // Agendar lembretes automáticos por email se habilitado
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

        console.log('Agendamento criado com sucesso:', {
          assessmentId: scheduledAssessment.id,
          linkUrl: linkResult.linkUrl,
          employeeName: assessmentData.employeeName,
          templateTitle: assessmentData.templateTitle
        });

        return {
          success: true,
          assessmentId: scheduledAssessment.id,
          linkUrl: linkResult.linkUrl,
          employeeName: assessmentData.employeeName,
          templateTitle: assessmentData.templateTitle
        };
      } catch (error) {
        console.error("Erro no agendamento com automação:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success(`Avaliação "${data.templateTitle}" agendada com sucesso para ${data.employeeName}! Link personalizado foi gerado.`);
    },
    onError: (error: any) => {
      console.error("Erro no agendamento:", error);
      toast.error(error.message || "Erro ao agendar avaliação");
    }
  });

  const scheduleAssessment = async (params: ScheduleAssessmentParams) => {
    const { employee, checklist, schedulingDetails: details } = params;

    console.log('Iniciando agendamento com dados:', {
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
      .select('id, title')
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
      templateTitle: templateExists.title,
      checklistTemplate: checklist
    };

    console.log('Dados finais para agendamento:', assessmentData);

    return scheduleAssessmentMutation.mutateAsync(assessmentData);
  };

  return {
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading: scheduleAssessmentMutation.isPending
  };
}
