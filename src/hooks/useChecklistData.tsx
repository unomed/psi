
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult, ScheduledAssessment } from "@/types";

export function useChecklistData() {
  const queryClient = useQueryClient();

  // Fetch checklist templates
  const { data: checklists, isLoading: checklistsLoading, refetch: refetchChecklists } = useQuery({
    queryKey: ['checklist-templates'],
    queryFn: async (): Promise<ChecklistTemplate[]> => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklist templates:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        name: item.title, // Usar title do banco como name na interface
        title: item.title,
        description: item.description,
        type: item.type,
        scale_type: item.scale_type,
        is_active: item.is_active,
        is_standard: item.is_standard || false,
        estimated_time_minutes: item.estimated_time_minutes,
        version: item.version,
        company_id: item.company_id,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: 'default' // Propriedade obrigatória
      }));
    }
  });

  // Fetch results
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ['checklist-results'],
    queryFn: async (): Promise<ChecklistResult[]> => {
      const { data, error } = await supabase
        .from('assessment_responses')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklist results:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        templateId: item.template_id,
        employeeId: item.employee_id,
        employeeName: item.employee_name,
        completedAt: new Date(item.completed_at),
        results: item.response_data || {}, // Aceitar qualquer tipo como object
        dominantFactor: item.dominant_factor || 'Unknown',
        responses: item.response_data,
        score: item.raw_score || 0
      }));
    }
  });

  // Fetch scheduled assessments
  const { data: scheduledAssessments, isLoading: scheduledLoading, refetch } = useQuery({
    queryKey: ['scheduled-assessments'],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees:employee_id (
            name,
            email,
            phone
          ),
          checklist_templates:template_id (
            title
          )
        `)
        .order('scheduled_date', { ascending: false });

      if (error) {
        console.error('Error fetching scheduled assessments:', error);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        employeeId: item.employee_id,
        employee_id: item.employee_id,
        templateId: item.template_id,
        template_id: item.template_id,
        scheduledDate: new Date(item.scheduled_date),
        scheduled_date: item.scheduled_date,
        status: item.status, // String flexível
        sentAt: item.sent_at ? new Date(item.sent_at) : null,
        sent_at: item.sent_at,
        completedAt: item.completed_at ? new Date(item.completed_at) : null,
        completed_at: item.completed_at,
        linkUrl: item.link_url || '',
        link_url: item.link_url,
        company_id: item.company_id,
        employee_name: item.employee_name,
        employees: Array.isArray(item.employees) ? item.employees[0] : item.employees,
        checklist_templates: Array.isArray(item.checklist_templates) ? item.checklist_templates[0] : item.checklist_templates,
        checklist_template_id: item.template_id,
        employee_ids: [item.employee_id],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    }
  });

  // Create template mutation
  const createTemplate = useMutation({
    mutationFn: async (templateData: Omit<ChecklistTemplate, "id" | "createdAt">) => {
      // Mapear tipo corretamente
      const dbType = templateData.type === 'stress' ? 'psicossocial' : templateData.type;
      
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert({
          title: templateData.name, // Usar name como title no banco
          description: templateData.description,
          type: dbType, // Usar tipo mapeado
          scale_type: 'likert5', // Fixed: usar valor válido do banco
          is_active: templateData.is_active,
          is_standard: templateData.is_standard || false,
          estimated_time_minutes: templateData.estimated_time_minutes,
          version: templateData.version,
          company_id: templateData.company_id,
          created_by: templateData.created_by
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      toast.success('Template criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error creating template:', error);
      toast.error('Erro ao criar template');
    }
  });

  // Update template mutation
  const updateTemplate = useMutation({
    mutationFn: async (template: ChecklistTemplate) => {
      const dbType = template.type === 'stress' ? 'psicossocial' : template.type;
      
      const { data, error } = await supabase
        .from('checklist_templates')
        .update({
          title: template.name, // Usar name como title no banco
          description: template.description,
          type: dbType,
          scale_type: 'likert5', // Fixed: usar valor válido do banco
          is_active: template.is_active,
          estimated_time_minutes: template.estimated_time_minutes,
          version: template.version
        })
        .eq('id', template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      toast.success('Template atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error updating template:', error);
      toast.error('Erro ao atualizar template');
    }
  });

  // Copy template mutation
  const copyTemplate = useMutation({
    mutationFn: async (template: ChecklistTemplate) => {
      const { data, error } = await supabase
        .rpc('copy_template_for_company', {
          template_id: template.id,
          company_id: template.company_id,
          new_title: `Cópia de ${template.name}`
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      toast.success('Template copiado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error copying template:', error);
      toast.error('Erro ao copiar template');
    }
  });

  // Delete template mutation
  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('checklist_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      toast.success('Template excluído com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error deleting template:', error);
      toast.error('Erro ao excluir template');
    }
  });

  // Save assessment result mutation
  const saveAssessmentResult = useMutation({
    mutationFn: async (resultData: any) => {
      const { data, error } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: resultData.templateId,
          employee_id: resultData.employeeId,
          employee_name: resultData.employeeName,
          response_data: resultData.results,
          dominant_factor: resultData.dominantFactor,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-results'] });
      toast.success('Resultado salvo com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error saving result:', error);
      toast.error('Erro ao salvar resultado');
    }
  });

  // Send email mutation
  const sendEmail = useMutation({
    mutationFn: async (emailData: any) => {
      // Implement email sending logic here
      console.log('Sending email:', emailData);
      return true;
    },
    onSuccess: () => {
      toast.success('Email enviado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error sending email:', error);
      toast.error('Erro ao enviar email');
    }
  });

  const isLoading = checklistsLoading || resultsLoading || scheduledLoading;

  return {
    checklists,
    results,
    scheduledAssessments,
    isLoading,
    handleCreateTemplate: async (templateData: Omit<ChecklistTemplate, "id" | "createdAt">) => {
      try {
        await createTemplate.mutateAsync(templateData);
        return true;
      } catch (error) {
        return false;
      }
    },
    handleUpdateTemplate: async (template: ChecklistTemplate) => {
      try {
        await updateTemplate.mutateAsync(template);
        return true;
      } catch (error) {
        return false;
      }
    },
    handleDeleteTemplate: async (template: ChecklistTemplate) => {
      try {
        await deleteTemplate.mutateAsync(template.id);
        return true;
      } catch (error) {
        return false;
      }
    },
    handleCopyTemplate: async (template: ChecklistTemplate) => {
      try {
        await copyTemplate.mutateAsync(template);
        return true;
      } catch (error) {
        return false;
      }
    },
    handleSaveAssessmentResult: async (resultData: any) => {
      try {
        await saveAssessmentResult.mutateAsync(resultData);
        return true;
      } catch (error) {
        return false;
      }
    },
    handleSendEmail: async (emailData: any) => {
      try {
        await sendEmail.mutateAsync(emailData);
        return true;
      } catch (error) {
        return false;
      }
    },
    refetchChecklists,
    refetch
  };
}
