
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate, RecurrenceType } from "@/types";

export function useAssessmentCreation() {
  const handleSaveAssessment = async (
    selectedEmployee: string | null,
    selectedTemplate: ChecklistTemplate | null,
    scheduledDate: Date | undefined
  ) => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist.");
      return false;
    }

    if (!scheduledDate) {
      toast.error("Selecione uma data para a avaliação.");
      return false;
    }

    try {
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('id', selectedEmployee)
        .single();

      if (employeeError || !employeeData) {
        console.error("Erro ao verificar funcionário:", employeeError);
        toast.error(`Funcionário não encontrado: ${employeeError?.message || "Nenhum registro encontrado"}`);
        return false;
      }

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
      let suggestedRecurrenceType = 'none';

      if (riskLevel && periodicitySettings) {
        switch (riskLevel.toLowerCase()) {
          case 'high':
            suggestedRecurrenceType = periodicitySettings.risk_high_periodicity;
            break;
          case 'medium':
            suggestedRecurrenceType = periodicitySettings.risk_medium_periodicity;
            break;
          case 'low':
            suggestedRecurrenceType = periodicitySettings.risk_low_periodicity;
            break;
          default:
            suggestedRecurrenceType = periodicitySettings.default_periodicity;
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

      const { data: scheduledData, error: scheduledError } = await supabase
        .from('scheduled_assessments')
        .insert({
          employee_id: selectedEmployee,
          employee_name: employeeData.name,
          template_id: selectedTemplate.id,
          scheduled_date: scheduledDate.toISOString(),
          status: 'scheduled',
          recurrence_type: suggestedRecurrenceType,
          next_scheduled_date: nextScheduledDate?.toISOString()
        })
        .select();

      if (scheduledError) {
        console.error("Erro ao salvar em scheduled_assessments:", scheduledError);
        toast.error(`Erro ao agendar avaliação: ${scheduledError.message}`);
        return false;
      }

      console.log("Avaliação agendada com sucesso:", scheduledData);
      toast.success("Avaliação agendada com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro geral:", error);
      toast.error("Erro ao salvar avaliação.");
      return false;
    }
  };

  return {
    handleSaveAssessment
  };
}
