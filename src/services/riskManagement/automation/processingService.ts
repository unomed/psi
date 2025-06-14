
import { supabase } from "@/integrations/supabase/client";
import { AutomationTriggerResult } from "../types/automationTypes";

export class AutomationProcessingService {
  // Processar avaliação automaticamente
  static async triggerAutomaticProcessing(assessmentResponseId: string): Promise<AutomationTriggerResult> {
    try {
      const { data, error } = await supabase.rpc('process_psychosocial_assessment_auto', {
        p_assessment_response_id: assessmentResponseId
      });

      if (error) throw error;

      // Properly handle the response with type validation
      if (data && typeof data === 'object') {
        // Convert unknown to our expected type safely
        const result = data as unknown as AutomationTriggerResult;
        
        // Validate required properties exist
        if ('success' in result && 'message' in result) {
          return result;
        }
      }
      
      // Fallback if data structure is unexpected
      return {
        success: false,
        message: 'Unexpected response format from database function'
      };
    } catch (error) {
      console.error('Error triggering automatic processing:', error);
      throw error;
    }
  }

  // Simular processamento para teste
  static async simulateProcessing(companyId: string) {
    try {
      console.log('Simulando processamento automático para empresa:', companyId);
      
      // Buscar a última avaliação completada da empresa
      const { data: assessments, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(company_id)
        `)
        .eq('employees.company_id', companyId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (assessments && assessments.length > 0) {
        const assessmentId = assessments[0].id;
        console.log('Processando avaliação:', assessmentId);
        
        return await this.triggerAutomaticProcessing(assessmentId);
      } else {
        return {
          success: false,
          message: 'Nenhuma avaliação completada encontrada para simulação'
        };
      }
    } catch (error) {
      console.error('Error simulating processing:', error);
      throw error;
    }
  }
}
