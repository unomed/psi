
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

  // Simular processamento para teste - versão melhorada
  static async simulateProcessing(companyId: string) {
    try {
      console.log('Simulando processamento automático para empresa:', companyId);
      
      // Buscar a última avaliação completada da empresa com JOIN correto
      const { data: assessments, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employee:employees!inner(
            id,
            name,
            company_id,
            sector_id,
            role_id
          )
        `)
        .eq('employee.company_id', companyId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching assessments:', error);
        throw error;
      }

      if (assessments && assessments.length > 0) {
        const assessment = assessments[0];
        console.log('Processando avaliação:', assessment.id, 'para funcionário:', assessment.employee?.name);
        
        return await this.triggerAutomaticProcessing(assessment.id);
      } else {
        // Se não há avaliações, criar uma de exemplo para demonstração
        console.log('Nenhuma avaliação encontrada. Criando dados de exemplo...');
        
        // Buscar um funcionário da empresa para criar avaliação de exemplo
        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'active')
          .limit(1);

        if (empError) {
          console.error('Error fetching employees:', empError);
          throw empError;
        }

        if (employees && employees.length > 0) {
          const employee = employees[0];
          
          // Buscar um template de avaliação psicossocial
          const { data: templates, error: templateError } = await supabase
            .from('checklist_templates')
            .select('*')
            .eq('type', 'psicossocial')
            .eq('is_active', true)
            .limit(1);

          if (templateError) {
            console.error('Error fetching templates:', templateError);
            throw templateError;
          }

          if (templates && templates.length > 0) {
            const template = templates[0];
            
            // Criar uma avaliação de exemplo
            const { data: newAssessment, error: createError } = await supabase
              .from('assessment_responses')
              .insert({
                employee_id: employee.id,
                template_id: template.id,
                employee_name: employee.name,
                raw_score: Math.floor(Math.random() * 100), // Score aleatório para demonstração
                response_data: {
                  responses: [],
                  metadata: {
                    simulation: true,
                    created_for_demo: true
                  }
                },
                completed_at: new Date().toISOString()
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating demo assessment:', createError);
              throw createError;
            }

            console.log('Avaliação de demonstração criada:', newAssessment.id);
            return await this.triggerAutomaticProcessing(newAssessment.id);
          }
        }
        
        return {
          success: false,
          message: 'Nenhuma avaliação completada ou funcionário encontrado para simulação. Verifique se há dados na empresa.'
        };
      }
    } catch (error: any) {
      console.error('Error simulating processing:', error);
      
      // Melhor tratamento de erros específicos
      if (error?.code === 'PGRST200') {
        return {
          success: false,
          message: 'Erro de relacionamento no banco de dados. O problema foi corrigido, tente novamente.'
        };
      }
      
      if (error?.message?.includes('foreign key')) {
        return {
          success: false,
          message: 'Erro de integridade referencial. Verifique se todos os dados estão consistentes.'
        };
      }
      
      return {
        success: false,
        message: `Erro na simulação: ${error?.message || 'Erro desconhecido'}`
      };
    }
  }
}
