import { supabase } from "@/integrations/supabase/client";
import { AdvancedCalculationEngine } from "./advancedCalculationEngine";
import { IntelligentActionPlanner } from "./intelligentActionPlanner";

export interface ProcessingJob {
  id: string;
  assessment_response_id: string;
  company_id: string;
  status: string; // Mudei para string genérico
  priority: string; // Mudei para string genérico
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
}

export interface ProcessingResult {
  success: boolean;
  assessment_response_id: string;
  risk_analyses_created: number;
  action_plans_created: number;
  notifications_sent: number;
  processing_time_ms: number;
  error?: string;
}

export class BackgroundProcessor {
  private static isProcessing = false;
  private static processingQueue: ProcessingJob[] = [];
  private static readonly MAX_CONCURRENT_JOBS = 3;
  private static readonly RETRY_DELAYS = [1000, 5000, 15000]; // ms

  // Adicionar job à fila de processamento
  static async queueProcessingJob(
    assessmentResponseId: string,
    companyId: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<string> {
    
    try {
      // Verificar se já existe job para esta avaliação
      const { data: existingJob } = await supabase
        .from('psychosocial_processing_jobs')
        .select('id')
        .eq('assessment_response_id', assessmentResponseId)
        .eq('status', 'pending')
        .single();

      if (existingJob) {
        return existingJob.id;
      }

      // Criar novo job
      const { data: newJob, error } = await supabase
        .from('psychosocial_processing_jobs')
        .insert({
          assessment_response_id: assessmentResponseId,
          company_id: companyId,
          status: 'pending',
          priority,
          retry_count: 0,
          max_retries: 3
        })
        .select()
        .single();

      if (error) throw error;

      // Iniciar processamento se não estiver rodando
      if (!this.isProcessing) {
        this.startProcessing();
      }

      return newJob.id;

    } catch (error) {
      console.error('Error queuing processing job:', error);
      throw error;
    }
  }

  // Iniciar processamento em background
  private static async startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('Starting background processing...');

    try {
      while (true) {
        // Buscar próximos jobs
        const jobs = await this.getNextJobs();
        
        if (jobs.length === 0) {
          // Aguardar um pouco antes de verificar novamente
          await this.sleep(5000);
          continue;
        }

        // Processar jobs em paralelo (limitado)
        const activeJobs = jobs.slice(0, this.MAX_CONCURRENT_JOBS);
        const promises = activeJobs.map(job => this.processJob(job));
        
        await Promise.allSettled(promises);
      }
    } catch (error) {
      console.error('Error in background processing:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Buscar próximos jobs para processar
  private static async getNextJobs(): Promise<ProcessingJob[]> {
    try {
      const { data: jobs, error } = await supabase
        .from('psychosocial_processing_jobs')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(this.MAX_CONCURRENT_JOBS);

      if (error) throw error;
      return jobs || [];

    } catch (error) {
      console.error('Error fetching next jobs:', error);
      return [];
    }
  }

  // Processar job individual
  private static async processJob(job: ProcessingJob): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Marcar como processando
      await this.updateJobStatus(job.id, 'processing', {
        started_at: new Date().toISOString()
      });

      console.log(`Processing job ${job.id} for assessment ${job.assessment_response_id}`);

      // Buscar dados da avaliação
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(
            company_id,
            sector_id,
            role_id,
            name
          )
        `)
        .eq('id', job.assessment_response_id)
        .single();

      if (assessmentError) throw assessmentError;

      // Corrigir acesso aos dados do funcionário
      const employee = Array.isArray(assessmentData.employees) 
        ? assessmentData.employees[0] 
        : assessmentData.employees;

      // Executar cálculo avançado
      const calculationResults = await AdvancedCalculationEngine.calculatePsychosocialRisk(
        job.assessment_response_id,
        job.company_id,
        employee?.sector_id,
        employee?.role_id
      );

      let analysesCreated = 0;
      let plansCreated = 0;
      let notificationsSent = 0;

      // Salvar análises de risco
      for (const result of calculationResults) {
        const { error: analysisError } = await supabase
          .from('psychosocial_risk_analysis')
          .insert({
            company_id: job.company_id,
            sector_id: employee?.sector_id,
            role_id: employee?.role_id,
            assessment_response_id: job.assessment_response_id,
            category: result.category as any,
            exposure_level: result.risk_level as any,
            risk_score: result.sector_adjusted_score,
            contributing_factors: result.contributing_factors,
            recommended_actions: result.recommended_actions,
            evaluation_date: new Date().toISOString().split('T')[0],
            next_evaluation_date: this.calculateNextEvaluationDate(result.risk_level),
            status: 'identified'
          });

        if (!analysisError) {
          analysesCreated++;
        }
      }

      // Verificar configuração de automação
      const { data: automationConfig } = await supabase
        .from('psychosocial_automation_config')
        .select('*')
        .eq('company_id', job.company_id)
        .single();

      // Gerar planos de ação se habilitado
      if (automationConfig?.auto_generate_action_plans) {
        const actionPlans = await IntelligentActionPlanner.generateActionPlan(
          job.company_id,
          employee?.sector_id,
          employee?.role_id,
          calculationResults,
          job.assessment_response_id
        );

        for (const plan of actionPlans) {
          const { data: createdPlan, error: planError } = await supabase
            .from('action_plans')
            .insert({
              company_id: job.company_id,
              assessment_response_id: job.assessment_response_id,
              title: plan.title,
              description: plan.description,
              status: 'draft',
              priority: plan.priority,
              sector_id: employee?.sector_id,
              start_date: new Date().toISOString().split('T')[0],
              due_date: this.addDays(new Date(), plan.estimated_completion_days).toISOString().split('T')[0],
              risk_level: 'alto' // Simplificado
            })
            .select()
            .single();

          if (!planError && createdPlan) {
            plansCreated++;

            // Criar itens do plano
            for (const action of plan.actions) {
              await supabase
                .from('action_plan_items')
                .insert({
                  action_plan_id: createdPlan.id,
                  title: action.title,
                  description: action.description,
                  status: 'pending',
                  priority: action.mandatory ? 'high' : 'medium',
                  responsible_name: action.responsible_role,
                  estimated_hours: action.estimated_hours,
                  due_date: this.addDays(new Date(), action.timeline_days).toISOString().split('T')[0]
                });
            }
          }
        }
      }

      // Enviar notificações se habilitado
      if (automationConfig?.notification_enabled) {
        const criticalResults = calculationResults.filter(r => r.risk_level === 'critico');
        const highResults = calculationResults.filter(r => r.risk_level === 'alto');

        if (criticalResults.length > 0 || highResults.length > 0) {
          const { error: notificationError } = await supabase
            .from('psychosocial_notifications')
            .insert({
              company_id: job.company_id,
              notification_type: criticalResults.length > 0 ? 'critical_risk' : 'high_risk',
              priority: criticalResults.length > 0 ? 'critical' : 'high',
              title: `Risco ${criticalResults.length > 0 ? 'Crítico' : 'Alto'} Identificado`,
              message: `Foram identificados riscos psicossociais ${criticalResults.length > 0 ? 'críticos' : 'altos'} para o colaborador ${employee?.name}`,
              recipients: automationConfig.notification_recipients || [],
              metadata: {
                assessment_id: job.assessment_response_id,
                employee_name: employee?.name,
                risk_categories: calculationResults.map(r => r.category)
              }
            });

          if (!notificationError) {
            notificationsSent++;
          }
        }
      }

      const processingTime = Date.now() - startTime;

      // Marcar como concluído
      await this.updateJobStatus(job.id, 'completed', {
        completed_at: new Date().toISOString()
      });

      const result: ProcessingResult = {
        success: true,
        assessment_response_id: job.assessment_response_id,
        risk_analyses_created: analysesCreated,
        action_plans_created: plansCreated,
        notifications_sent: notificationsSent,
        processing_time_ms: processingTime
      };

      console.log('Job completed successfully:', result);
      return result;

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);

      // Verificar se deve tentar novamente
      if (job.retry_count < job.max_retries) {
        await this.scheduleRetry(job);
      } else {
        await this.updateJobStatus(job.id, 'error', {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        });
      }

      return {
        success: false,
        assessment_response_id: job.assessment_response_id,
        risk_analyses_created: 0,
        action_plans_created: 0,
        notifications_sent: 0,
        processing_time_ms: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Atualizar status do job
  private static async updateJobStatus(
    jobId: string, 
    status: string,
    additionalFields: Record<string, any> = {}
  ) {
    await supabase
      .from('psychosocial_processing_jobs')
      .update({
        status,
        ...additionalFields
      })
      .eq('id', jobId);
  }

  // Agendar retry
  private static async scheduleRetry(job: ProcessingJob) {
    const delay = this.RETRY_DELAYS[job.retry_count] || 15000;
    
    setTimeout(async () => {
      await supabase
        .from('psychosocial_processing_jobs')
        .update({
          status: 'pending',
          retry_count: job.retry_count + 1
        })
        .eq('id', job.id);
    }, delay);
  }

  // Calcular próxima data de avaliação
  private static calculateNextEvaluationDate(riskLevel: string): string {
    const now = new Date();
    let daysToAdd = 365; // Padrão anual

    switch (riskLevel) {
      case 'critico':
        daysToAdd = 30; // Mensal
        break;
      case 'alto':
        daysToAdd = 90; // Trimestral
        break;
      case 'medio':
        daysToAdd = 180; // Semestral
        break;
    }

    return this.addDays(now, daysToAdd).toISOString().split('T')[0];
  }

  // Adicionar dias a uma data
  private static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Sleep utility
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos públicos para controle
  static async getProcessingStatus(): Promise<{
    isProcessing: boolean;
    queueLength: number;
    activeJobs: number;
  }> {
    const { data: pendingJobs } = await supabase
      .from('psychosocial_processing_jobs')
      .select('id')
      .eq('status', 'pending');

    const { data: activeJobs } = await supabase
      .from('psychosocial_processing_jobs')
      .select('id')
      .eq('status', 'processing');

    return {
      isProcessing: this.isProcessing,
      queueLength: pendingJobs?.length || 0,
      activeJobs: activeJobs?.length || 0
    };
  }

  // Parar processamento (para manutenção)
  static stopProcessing() {
    this.isProcessing = false;
  }

  // Reiniciar processamento
  static startProcessingPublic() {
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }
}
