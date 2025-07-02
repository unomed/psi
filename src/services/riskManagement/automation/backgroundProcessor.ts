
import { supabase } from "@/integrations/supabase/client";

export interface ProcessingJob {
  id: string;
  assessment_response_id: string;
  company_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  queueLength: number;
  activeJobs: number;
  processingRate: number;
}

export class BackgroundProcessor {
  private static instance: BackgroundProcessor;
  private processingInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly MAX_CONCURRENT_JOBS = 3;
  private readonly PROCESSING_INTERVAL = 5000; // 5 seconds

  static getInstance(): BackgroundProcessor {
    if (!BackgroundProcessor.instance) {
      BackgroundProcessor.instance = new BackgroundProcessor();
    }
    return BackgroundProcessor.instance;
  }

  async startProcessing(): Promise<void> {
    if (this.isRunning) return;
    
    try {
      // Salvar estado no banco de dados usando upsert para configuração global
      const { error } = await supabase
        .from('psychosocial_background_settings')
        .upsert({
          company_id: null,
          is_processing_enabled: true,
          max_concurrent_jobs: this.MAX_CONCURRENT_JOBS,
          processing_interval_seconds: this.PROCESSING_INTERVAL / 1000
        });

      if (error) {
        console.error('Error saving processing state:', error);
        throw error;
      }

      this.isRunning = true;
      console.log('Background processor started and saved to database');
      
      this.processingInterval = setInterval(async () => {
        await this.processQueue();
      }, this.PROCESSING_INTERVAL);
    } catch (error) {
      console.error('Failed to start background processing:', error);
      throw error;
    }
  }

  async stopProcessing(): Promise<void> {
    if (!this.isRunning) return;
    
    try {
      // Salvar estado no banco de dados usando upsert para configuração global
      const { error } = await supabase
        .from('psychosocial_background_settings')
        .upsert({
          company_id: null,
          is_processing_enabled: false,
          max_concurrent_jobs: this.MAX_CONCURRENT_JOBS,
          processing_interval_seconds: this.PROCESSING_INTERVAL / 1000
        });

      if (error) {
        console.error('Error saving processing state:', error);
        throw error;
      }

      this.isRunning = false;
      if (this.processingInterval) {
        clearInterval(this.processingInterval);
        this.processingInterval = null;
      }
      console.log('Background processor stopped and saved to database');
    } catch (error) {
      console.error('Failed to stop background processing:', error);
      throw error;
    }
  }

  async getProcessingStatus(): Promise<ProcessingStatus> {
    // Carregar estado do banco de dados
    const { data: settings } = await supabase
      .from('psychosocial_background_settings')
      .select('is_processing_enabled')
      .is('company_id', null)
      .single();

    // Sincronizar estado local com o banco
    const isProcessingFromDB = settings?.is_processing_enabled || false;
    if (isProcessingFromDB && !this.isRunning) {
      // Se está habilitado no banco mas não está rodando localmente, iniciar
      this.isRunning = true;
      this.processingInterval = setInterval(async () => {
        await this.processQueue();
      }, this.PROCESSING_INTERVAL);
    } else if (!isProcessingFromDB && this.isRunning) {
      // Se está desabilitado no banco mas está rodando localmente, parar
      this.isRunning = false;
      if (this.processingInterval) {
        clearInterval(this.processingInterval);
        this.processingInterval = null;
      }
    }

    const { data: queueJobs } = await supabase
      .from('psychosocial_processing_jobs')
      .select('*')
      .eq('status', 'pending');

    const { data: activeJobs } = await supabase
      .from('psychosocial_processing_jobs')
      .select('*')
      .eq('status', 'processing');

    return {
      isProcessing: isProcessingFromDB,
      queueLength: queueJobs?.length || 0,
      activeJobs: activeJobs?.length || 0,
      processingRate: this.calculateProcessingRate()
    };
  }

  async queueJob(assessmentResponseId: string, companyId: string, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<string> {
    const { data, error } = await supabase
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
    
    console.log(`Job queued: ${data.id} for assessment ${assessmentResponseId}`);
    return data.id;
  }

  private async processQueue(): Promise<void> {
    try {
      const status = await this.getProcessingStatus();
      
      if (status.activeJobs >= this.MAX_CONCURRENT_JOBS) return;
      
      const jobsToStart = this.MAX_CONCURRENT_JOBS - status.activeJobs;
      
      const { data: pendingJobs } = await supabase
        .from('psychosocial_processing_jobs')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(jobsToStart);

      if (!pendingJobs?.length) return;

      for (const job of pendingJobs) {
        // Convert database row to ProcessingJob interface with proper typing
        const processingJob: ProcessingJob = {
          id: job.id,
          assessment_response_id: job.assessment_response_id,
          company_id: job.company_id,
          status: job.status as 'pending' | 'processing' | 'completed' | 'error' | 'cancelled',
          priority: job.priority as 'low' | 'medium' | 'high' | 'critical',
          created_at: job.created_at,
          started_at: job.started_at || undefined,
          completed_at: job.completed_at || undefined,
          error_message: job.error_message || undefined,
          retry_count: job.retry_count,
          max_retries: job.max_retries
        };
        await this.processJob(processingJob);
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    }
  }

  private async processJob(job: ProcessingJob): Promise<void> {
    try {
      // Mark job as processing
      await supabase
        .from('psychosocial_processing_jobs')
        .update({
          status: 'processing',
          started_at: new Date().toISOString()
        })
        .eq('id', job.id);

      console.log(`Processing job ${job.id} for assessment ${job.assessment_response_id}`);

      // Call the automated processing function
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_auto', {
        p_assessment_response_id: job.assessment_response_id
      });

      if (error) throw error;

      // Mark job as completed
      await supabase
        .from('psychosocial_processing_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      console.log(`Job ${job.id} completed successfully`);

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      
      const retryCount = job.retry_count + 1;
      const shouldRetry = retryCount < job.max_retries;

      await supabase
        .from('psychosocial_processing_jobs')
        .update({
          status: shouldRetry ? 'pending' : 'error',
          retry_count: retryCount,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: shouldRetry ? null : new Date().toISOString()
        })
        .eq('id', job.id);
    }
  }

  private calculateProcessingRate(): number {
    // Mock calculation - in real implementation, this would track actual processing times
    return 2.5; // Jobs per minute
  }
}

// Export singleton instance
export const backgroundProcessor = BackgroundProcessor.getInstance();
