
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Função utilitária para gerar link de avaliação
const generateAssessmentLink = (assessmentId: string, token?: string): string => {
  const baseUrl = window.location.origin;
  if (token) {
    return `${baseUrl}/assessment/${token}`;
  }
  return `${baseUrl}/employee-portal/assessment/${assessmentId}`;
};

export function useEmailSending() {
  const sendEmails = useMutation({
    mutationFn: async ({ 
      assessmentIds, 
      templateId, 
      emailTemplate 
    }: { 
      assessmentIds: string[]; 
      templateId: string; 
      emailTemplate: any; 
    }) => {
      // Buscar dados dos agendamentos
      const { data: assessments, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          id,
          employee_id,
          template_id,
          employee_name,
          checklist_templates!inner(title)
        `)
        .in('id', assessmentIds);

      if (error) throw error;

      // Buscar dados dos funcionários separadamente
      const employeeIds = assessments.map(a => a.employee_id);
      const { data: employees, error: employeeError } = await supabase
        .from('employees')
        .select('id, name, email')
        .in('id', employeeIds);

      if (employeeError) throw employeeError;

      // Enviar emails para cada avaliação
      const emailPromises = assessments.map(async (assessment) => {
        const employee = employees.find(e => e.id === assessment.employee_id);
        if (!employee) return;

        const link = generateAssessmentLink(assessment.id);
        
        // Substituir variáveis no template
        const personalizedSubject = emailTemplate.subject
          .replace('{{employee_name}}', employee.name)
          .replace('{{assessment_title}}', assessment.checklist_templates?.title || '');
          
        const personalizedBody = emailTemplate.body
          .replace('{{employee_name}}', employee.name)
          .replace('{{assessment_title}}', assessment.checklist_templates?.title || '')
          .replace('{{assessment_link}}', link);

        // Salvar email enviado
        return supabase
          .from('assessment_emails')
          .insert({
            scheduled_assessment_id: assessment.id,
            recipient_email: employee.email,
            subject: personalizedSubject,
            body: personalizedBody,
            sent_at: new Date().toISOString()
          });
      });

      await Promise.all(emailPromises);
      return assessments.length;
    },
    onSuccess: (count) => {
      toast.success(`${count} emails enviados com sucesso!`);
    },
    onError: (error: any) => {
      console.error('Erro ao enviar emails:', error);
      toast.error('Erro ao enviar emails');
    }
  });

  return {
    sendEmails: sendEmails.mutate,
    sendChecklistEmails: sendEmails.mutate, // Add alias for compatibility
    isSending: sendEmails.isPending
  };
}
