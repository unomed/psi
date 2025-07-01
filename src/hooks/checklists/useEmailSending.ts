
import { useState } from "react";
import { toast } from "sonner";
import { generateAssessmentLink, sendAssessmentEmail } from "@/services/assessment";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "@/types/employee";

// Interface local para garantir que o email seja obrigatório no contexto de envio de emails
interface EmailEmployee extends Employee {
  email: string; // Tornando o email obrigatório neste contexto
}

interface SendEmailParams {
  templateId: string;
  employees: EmailEmployee[];
  subject: string;
  body: string;
  scheduledDate: Date;
}

export function useEmailSending() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendChecklistEmails = async ({ templateId, employees, subject, body, scheduledDate }: SendEmailParams) => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    setIsLoading(true);
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    try {
      // Buscar informações da empresa do usuário logado
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      let companyName = 'Sua Empresa';

      if (userCompanies && !userCompaniesError) {
        // Buscar nome da empresa
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('name')
          .eq('id', userCompanies.company_id)
          .single();

        if (company && !companyError) {
          companyName = company.name;
        }
      }

      if (userCompaniesError) {
        console.warn('Erro ao buscar dados da empresa do usuário:', userCompaniesError);
      }

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
              scheduled_date: scheduledDate.toISOString(),
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

        } catch (error) {
          console.error(`[EmailSending] Erro para ${employee.name}:`, error);
          
          results.push({
            employee: employee.name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
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

    } catch (error) {
      console.error("[EmailSending] Erro geral:", error);
      toast.error(`Erro geral no envio: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
