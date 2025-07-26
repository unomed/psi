/**
 * FASE 3: HOOK PARA AGENDAMENTO COLETIVO
 * RESPONSABILIDADE: Gerenciar estado e operações do agendamento em massa
 * 
 * FUNCIONALIDADES:
 * - Estado do workflow de agendamento coletivo
 * - Operações de agendamento em lote
 * - Integração com sistema de notificações
 * - Validações e tratamento de erros
 * - Progress tracking
 * 
 * INTEGRAÇÃO:
 * - Reutiliza serviços existentes de agendamento individual
 * - Compatible com sistema de notificações
 * - Integra com React Query para cache
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { generateUniqueAssessmentLink } from "@/services/assessment/linkGeneration";
import { useAuth } from "@/contexts/AuthContext";

export interface Employee {
  id: string;
  name: string;
  email: string;
  sector_id: string;
  role_id: string;
  status: string;
  sectors?: { id: string; name: string };
  roles?: { id: string; name: string };
}

export interface CollectiveSchedulingData {
  template: ChecklistTemplate;
  employees: Employee[];
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  sendEmail: boolean;
  sendWhatsApp: boolean;
  companyId: string;
}

export interface SchedulingResult {
  success: boolean;
  employeeId: string;
  employeeName: string;
  assessmentId?: string;
  linkUrl?: string;
  error?: string;
}

export interface CollectiveSchedulingProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  results: SchedulingResult[];
  isProcessing: boolean;
  progress: number; // 0-100
}

export function useCollectiveScheduling() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Estado do progresso
  const [progress, setProgress] = useState<CollectiveSchedulingProgress>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    results: [],
    isProcessing: false,
    progress: 0
  });

  /**
   * FUNÇÃO PRINCIPAL: Processar agendamento coletivo
   * RESPONSABILIDADE: Executar agendamentos em lote com feedback de progresso
   */
  const processCollectiveScheduling = useMutation({
    mutationFn: async (data: CollectiveSchedulingData) => {
      const { template, employees, scheduledDate, recurrenceType, sendEmail, sendWhatsApp, companyId } = data;

      console.log('🚀 [FASE 3] Iniciando agendamento coletivo:', {
        template: template.title,
        employeeCount: employees.length,
        date: scheduledDate,
        companyId
      });

      // Inicializar progresso
      setProgress({
        total: employees.length,
        processed: 0,
        successful: 0,
        failed: 0,
        results: [],
        isProcessing: true,
        progress: 0
      });

      const results: SchedulingResult[] = [];

      // Processar cada funcionário individualmente
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];

        try {
          console.log(`📋 [FASE 3] Processando ${i + 1}/${employees.length}: ${employee.name}`);

          // 1. Gerar link único para a avaliação
          const linkResult = await generateUniqueAssessmentLink(
            template.id,
            employee.id,
            7 // expira em 7 dias
          );

          if (!linkResult) {
            throw new Error("Falha ao gerar link de avaliação");
          }

          // 2. Criar agendamento na base
          const { data: scheduledAssessment, error: scheduleError } = await supabase
            .from('scheduled_assessments')
            .insert({
              employee_id: employee.id,
              employee_name: employee.name,
              template_id: template.id,
              scheduled_date: scheduledDate.toISOString(),
              due_date: scheduledDate.toISOString(),
              status: 'scheduled',
              recurrence_type: recurrenceType,
              company_id: companyId,
              link_url: linkResult.linkUrl,
              created_by: user?.id
            })
            .select()
            .single();

          if (scheduleError) {
            throw new Error(`Erro ao agendar: ${scheduleError.message}`);
          }

          // 3. Enviar notificações se solicitado
          if (sendEmail || sendWhatsApp) {
            try {
              await sendCollectiveNotification({
                assessmentId: scheduledAssessment.id,
                linkUrl: linkResult.linkUrl,
                employeeName: employee.name,
                employeeEmail: employee.email,
                templateTitle: template.title,
                scheduledDate,
                sendEmail,
                sendWhatsApp
              });
            } catch (notificationError) {
              console.warn(`⚠️ [FASE 3] Erro ao enviar notificação para ${employee.name}:`, notificationError);
              // Não falha o agendamento por causa da notificação
            }
          }

          // Sucesso
          results.push({
            success: true,
            employeeId: employee.id,
            employeeName: employee.name,
            assessmentId: scheduledAssessment.id,
            linkUrl: linkResult.linkUrl
          });

          console.log(`✅ [FASE 3] Sucesso para ${employee.name}`);

        } catch (error) {
          console.error(`❌ [FASE 3] Erro para ${employee.name}:`, error);

          results.push({
            success: false,
            employeeId: employee.id,
            employeeName: employee.name,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }

        // Atualizar progresso
        const processed = i + 1;
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        const progressPercent = (processed / employees.length) * 100;

        setProgress({
          total: employees.length,
          processed,
          successful,
          failed,
          results: [...results],
          isProcessing: true,
          progress: progressPercent
        });

        // Pequena pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Finalizar
      setProgress(prev => ({ ...prev, isProcessing: false }));

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      console.log('📊 [FASE 3] Resultado final:', {
        total: employees.length,
        successful: successCount,
        failed: errorCount,
        results
      });

      return {
        total: employees.length,
        successful: successCount,
        failed: errorCount,
        results
      };
    },
    onSuccess: (result) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessmentMetrics'] });

      // Toast de resultado
      if (result.successful > 0) {
        toast.success(`Agendamento coletivo concluído!`, {
          description: `${result.successful} sucessos, ${result.failed} erros de ${result.total} funcionários`
        });
      } else {
        toast.error("Nenhum agendamento foi realizado com sucesso.");
      }
    },
    onError: (error: Error) => {
      console.error('❌ [FASE 3] Erro geral no agendamento coletivo:', error);
      toast.error(`Erro no agendamento coletivo: ${error.message}`);
      
      setProgress(prev => ({ ...prev, isProcessing: false }));
    }
  });

  /**
   * Enviar notificação para agendamento individual
   */
  const sendCollectiveNotification = async ({
    assessmentId,
    linkUrl,
    employeeName,
    employeeEmail,
    templateTitle,
    scheduledDate,
    sendEmail,
    sendWhatsApp
  }: {
    assessmentId: string;
    linkUrl: string;
    employeeName: string;
    employeeEmail?: string;
    templateTitle: string;
    scheduledDate: Date;
    sendEmail: boolean;
    sendWhatsApp: boolean;
  }) => {
    // Mock implementation - integrar com sistema real de notificações
    console.log('📧 [FASE 3] Enviando notificação:', {
      assessmentId,
      employeeName,
      templateTitle,
      scheduledDate,
      sendEmail,
      sendWhatsApp
    });

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 100));

    // Em produção, aqui integraria com:
    // - Serviço de email (Resend/SendGrid)
    // - API do WhatsApp Business
    // - Sistema de templates de notificação
  };

  /**
   * Função para resetar estado do progresso
   */
  const resetProgress = () => {
    setProgress({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      results: [],
      isProcessing: false,
      progress: 0
    });
  };

  /**
   * Validar dados antes do agendamento
   */
  const validateCollectiveScheduling = (data: Partial<CollectiveSchedulingData>): string[] => {
    const errors: string[] = [];

    if (!data.template) {
      errors.push('Template é obrigatório');
    }

    if (!data.employees || data.employees.length === 0) {
      errors.push('Pelo menos um funcionário deve ser selecionado');
    }

    if (!data.scheduledDate) {
      errors.push('Data de agendamento é obrigatória');
    } else if (data.scheduledDate < new Date()) {
      errors.push('Data de agendamento deve ser futura');
    }

    if (!data.companyId) {
      errors.push('ID da empresa é obrigatório');
    }

    return errors;
  };

  /**
   * Função utilitária para obter resumo do progresso
   */
  const getProgressSummary = () => {
    const { total, successful, failed, isProcessing, progress: progressPercent } = progress;
    
    return {
      isComplete: !isProcessing && total > 0,
      hasErrors: failed > 0,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      progressPercent,
      summary: `${successful} sucessos, ${failed} erros de ${total} total`
    };
  };

  return {
    // Estado
    progress,
    
    // Mutations
    processCollectiveScheduling,
    
    // Utilities
    resetProgress,
    validateCollectiveScheduling,
    getProgressSummary,
    
    // Status
    isProcessing: processCollectiveScheduling.isPending || progress.isProcessing
  };
}