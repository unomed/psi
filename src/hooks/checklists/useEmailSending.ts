
import { useState } from "react";
import { toast } from "sonner";
import { generateAssessmentLink, sendAssessmentEmail } from "@/services/assessment";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  roles?: { name: string };
  sectors?: { name: string };
}

interface SendEmailParams {
  templateId: string;
  employees: Employee[];
  subject: string;
  body: string;
}

export function useEmailSending() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendChecklistEmails = async ({ templateId, employees, subject, body }: SendEmailParams) => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    setIsLoading(true);
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      // Buscar informações da empresa do usuário logado
      const { data: userRole, error: userRoleError } = await supabase
        .from('user_roles')
        .select(`
          company_id,
          companies (
            name,
            address,
            phone
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (userRoleError || !userRole?.companies?.name) {
        console.warn('Erro ao buscar dados da empresa do usuário:', userRoleError);
      }

      const companyName = userRole?.companies?.name || 'Sua Empresa';
      console.log('Company name retrieved for emails:', companyName);

      for (const employee of employees) {
        try {
          console.log(`[EmailSending] Processando funcionário: ${employee.name}`);

          // 1. Criar o agendamento de avaliação
          const { data: scheduledData, error: scheduleError } = await supabase
            .from('scheduled_assessments')
            .insert({
              employee_id: employee.id,
              template_id: templateId,
              scheduled_date: new Date().toISOString(),
              status: 'scheduled',
              employee_name: employee.name,
              created_by: user.id
            })
            .select()
            .single();

          if (scheduleError) {
            throw new Error(`Erro ao criar agendamento: ${scheduleError.message}`);
          }

          console.log(`[EmailSending] Agendamento criado:`, scheduledData);

          // 2. Gerar link único de avaliação
          const linkUrl = await generateAssessmentLink(employee.id, templateId);
          if (!linkUrl) {
            throw new Error("Falha ao gerar link de avaliação");
          }

          console.log(`[EmailSending] Link gerado: ${linkUrl}`);

          // 3. Atualizar o agendamento com o link
          const { error: updateError } = await supabase
            .from('scheduled_assessments')
            .update({
              link_url: linkUrl,
              status: 'sent'
            })
            .eq('id', scheduledData.id);

          if (updateError) {
            throw new Error(`Erro ao atualizar agendamento: ${updateError.message}`);
          }

          // 4. Enviar email via edge function com o nome correto da empresa
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email-resend', {
            body: {
              employeeId: employee.id,
              employeeName: employee.name,
              employeeEmail: employee.email,
              assessmentId: scheduledData.id,
              templateId: templateId,
              templateName: subject,
              linkUrl: linkUrl,
              companyName: companyName,
              customSubject: subject.replace(/\{\{companyName\}\}/g, companyName),
              customBody: body
                .replace(/\{\{employeeName\}\}/g, employee.name)
                .replace(/\{\{templateName\}\}/g, subject)
                .replace(/\{\{linkUrl\}\}/g, linkUrl)
                .replace(/\{\{companyName\}\}/g, companyName)
            }
          });

          if (emailError) {
            throw new Error(`Erro ao enviar email: ${emailError.message}`);
          }

          if (!emailData?.success) {
            throw new Error(emailData?.error || "Falha ao enviar email");
          }

          console.log(`[EmailSending] Email enviado com sucesso para: ${employee.name}`);
          
          results.push({
            employee: employee.name,
            status: 'success',
            assessmentId: scheduledData.id
          });
          successCount++;

        } catch (error: any) {
          console.error(`[EmailSending] Erro para ${employee.name}:`, error);
          
          results.push({
            employee: employee.name,
            status: 'error',
            error: error.message
          });
          errorCount++;
        }
      }

      // Mostrar resultado final com o nome correto da empresa
      if (successCount > 0) {
        toast.success(`${successCount} email(s) enviado(s) com sucesso para funcionários da ${companyName}!`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} erro(s) no envio de emails. Verifique o console para detalhes.`);
        console.error("[EmailSending] Resumo de erros:", results.filter(r => r.status === 'error'));
      }

      return {
        success: successCount > 0,
        successCount,
        errorCount,
        results
      };

    } catch (error: any) {
      console.error("[EmailSending] Erro geral:", error);
      toast.error(`Erro geral no envio: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendChecklistEmails,
    isLoading
  };
}
