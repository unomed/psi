
/**
 * HOOK: Dados de Resultados de Avaliação
 * RESPONSABILIDADE: Buscar e processar resultados usando critérios UNIFICADOS
 * 
 * UNIFICAÇÃO IMPLEMENTADA:
 * - USA fonte única: /configuracoes/criterios-avaliacao
 * - Cálculo de risco consistente via riskCriteriaUnified
 * - Elimina valores hardcoded espalhados
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateRiskLevel } from "@/utils/riskCriteriaUnified";

export interface AssessmentResultData {
  id: string;
  employeeName: string;
  employeeId: string;
  templateTitle: string;
  templateType: string;
  completedAt: string;
  dominantFactor?: string;
  riskLevel: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  factorsScores?: Record<string, number>;
  sector?: string;
  role?: string;
  classification?: string;
  notes?: string;
  rawScore?: number;
  normalizedScore?: number;
  responseData?: any;
  questions?: Array<{
    id: string;
    question_text: string;
    order_number: number;
  }>;
}

export function useAssessmentResultsData(companyId?: string | null) {
  const { userRole } = useAuth();

  return useQuery({
    queryKey: ['assessment-results', companyId],
    queryFn: async (): Promise<AssessmentResultData[]> => {
      if (!companyId && userRole !== 'superadmin') {
        return [];
      }

      let query = supabase
        .from('assessment_responses')
        .select(`
          id,
          employee_name,
          employee_id,
          completed_at,
          dominant_factor,
          factors_scores,
          classification,
          notes,
          raw_score,
          normalized_score,
          risk_level,
          response_data,
          checklist_templates!inner(
            title,
            type,
            questions(
              id,
              question_text,
              order_number
            )
          ),
          employees(
            id,
            name,
            sectors(name),
            roles(name)
          )
        `)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (companyId) {
        // Filter by company through employees
        const { data: companyEmployees } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);

        if (companyEmployees && companyEmployees.length > 0) {
          const employeeIds = companyEmployees.map(emp => emp.id);
          query = query.in('employee_id', employeeIds);
        } else {
          // No employees found for this company
          return [];
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching assessment results:", error);
        throw error;
      }

      return (data || []).map(result => {
        // Calculate risk level based on assessment data (mesma lógica unificada)
        let riskLevel: 'Crítico' | 'Alto' | 'Médio' | 'Baixo' = 'Baixo';
        
        // Primeiro, verificar se já tem risk_level preenchido (não null)
        if (result.risk_level && result.risk_level.toLowerCase() !== 'null') {
          // Mapear os valores do banco para os valores padronizados
          const dbRiskLevel = result.risk_level.toLowerCase();
          if (dbRiskLevel === 'critico' || dbRiskLevel === 'crítico') riskLevel = 'Crítico';
          else if (dbRiskLevel === 'alto') riskLevel = 'Alto';
          else if (dbRiskLevel === 'medio' || dbRiskLevel === 'médio') riskLevel = 'Médio';
          else riskLevel = 'Baixo';
        }
        // ✅ UNIFICADO: Agora usa fonte única de critérios  
        else if (result.raw_score !== null && result.raw_score !== undefined) {
          riskLevel = calculateRiskLevel(result.raw_score);
        }
        // Fallback para classification
        else if (result.classification) {
          if (result.classification === 'severe' || result.classification === 'critical') {
            riskLevel = 'Alto';
          } else if (result.classification === 'moderate') {
            riskLevel = 'Médio';
          }
        }
        // Fallback para factors_scores (DISC)
        else if (result.factors_scores) {
          const scores = Object.values(result.factors_scores as Record<string, number>);
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          
          if (avgScore >= 0.7) riskLevel = 'Alto';
          else if (avgScore >= 0.4) riskLevel = 'Médio';
        }

        // Handle employee data - it can be an array or single object from Supabase
        const employeesArray = Array.isArray(result.employees) ? result.employees : (result.employees ? [result.employees] : []);
        const employee = employeesArray[0]; // Get first employee from array
        
        // Para conformidade com NR-01 e NR-17, manter anonimato nas avaliações psicossociais
        const isAnonymousAssessment = result.checklist_templates?.type === 'psicossocial' || 
                                    result.checklist_templates?.title?.toLowerCase().includes('psicossocial');
        
        const employeeName = isAnonymousAssessment 
          ? `Funcionário ${result.id.slice(-6).toUpperCase()}` // Código anônimo baseado no ID
          : (result.employee_name || employee?.name || 'Anônimo');
        
        const sector = employee?.sectors?.name;
        const role = employee?.roles?.name;

        return {
          id: result.id,
          employeeName,
          employeeId: result.employee_id || '',
          templateTitle: result.checklist_templates?.title || 'Avaliação',
          templateType: result.checklist_templates?.type || 'custom',
          completedAt: result.completed_at,
          dominantFactor: result.dominant_factor,
          riskLevel,
          factorsScores: result.factors_scores as Record<string, number>,
          sector,
          role,
          classification: result.classification,
          notes: result.notes,
          rawScore: result.raw_score,
          normalizedScore: result.normalized_score,
          responseData: result.response_data,
          questions: result.checklist_templates?.questions || []
        };
      });
    },
    enabled: userRole === 'superadmin' || !!companyId,
  });
}
