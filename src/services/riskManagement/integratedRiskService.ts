
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface IntegratedRiskAssessment {
  id: string;
  company_id: string;
  employee_id: string;
  assessment_date: Date;
  risk_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  mitigation_actions: string[];
  status: 'pending' | 'in_progress' | 'completed';
  next_assessment_date?: Date;
  created_at: Date;
  updated_at: Date;
  employee?: {
    id: string;
    name: string;
    company_id: string;
    sector_id: string;
    role_id: string;
  };
  sector?: {
    id: string;
    name: string;
  };
  role?: {
    id: string;
    name: string;
  };
}

// Conectar avaliações psicossociais com avaliações de risco
export async function getIntegratedRiskAssessments(companyId?: string) {
  try {
    const { data, error } = await supabase.rpc('get_risk_assessments_by_company', {
      p_company_id: companyId
    });
    
    if (error) {
      console.error("Error fetching integrated risk assessments:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching integrated risk assessments:", error);
    return [];
  }
}

// Criar avaliação de risco baseada em resposta de assessment psicossocial
export async function createRiskFromAssessmentResponse(
  assessmentResponseId: string,
  severityIndex: number,
  probabilityIndex: number,
  companyId: string
) {
  try {
    // Primeiro, calcular o risco usando a função do banco
    const { data: riskCalc, error: calcError } = await supabase.rpc('calculate_risk_level', {
      p_company_id: companyId,
      p_severity_index: severityIndex,
      p_probability_index: probabilityIndex
    });

    if (calcError) throw calcError;

    const calculation = riskCalc[0];

    // Buscar dados da resposta de assessment
    const { data: response, error: responseError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        employee:employees(
          id,
          name,
          sector_id,
          role_id,
          company_id
        )
      `)
      .eq('id', assessmentResponseId)
      .single();

    if (responseError) throw responseError;

    // Corrigir: response.employee é um objeto, não array
    const employee = response.employee as any;

    // Criar avaliação de risco
    const { data: riskAssessment, error: riskError } = await supabase
      .from('risk_assessments')
      .insert({
        company_id: companyId,
        employee_id: response.employee_id,
        sector_id: employee?.sector_id,
        role_id: employee?.role_id,
        assessment_response_id: assessmentResponseId,
        severity_index: severityIndex,
        probability_index: probabilityIndex,
        risk_value: calculation.risk_value,
        risk_level: calculation.risk_level,
        recommended_action: calculation.recommended_action,
        risk_factors: ['Avaliação Psicossocial'],
        mitigation_actions: [],
        status: 'identified'
      })
      .select()
      .single();

    if (riskError) throw riskError;

    return riskAssessment;
  } catch (error) {
    console.error("Error creating risk from assessment response:", error);
    throw error;
  }
}

// Gerar automaticamente planos de ação para riscos altos
export async function generateActionPlanForHighRisk(riskAssessmentId: string) {
  try {
    // Buscar avaliação de risco
    const { data: risk, error: riskError } = await supabase
      .from('risk_assessments')
      .select(`
        *,
        employee:employees(name, sector_id),
        sector:sectors(name)
      `)
      .eq('id', riskAssessmentId)
      .single();

    if (riskError) throw riskError;

    // Só criar plano se for risco alto ou altíssimo
    if (!['alto', 'altíssimo'].includes(risk.risk_level.toLowerCase())) {
      return null;
    }

    // Criar plano de ação
    const { data: actionPlan, error: planError } = await supabase
      .from('action_plans')
      .insert({
        company_id: risk.company_id,
        title: `Plano de Mitigação - ${(risk.employee as any)?.name}`,
        description: `Plano para mitigar risco ${risk.risk_level} identificado na avaliação psicossocial`,
        status: 'draft',
        priority: risk.risk_level.toLowerCase() === 'altíssimo' ? 'critical' : 'high',
        sector_id: risk.sector_id,
        risk_level: risk.risk_level.toLowerCase(),
        created_by: risk.created_by
      })
      .select()
      .single();

    if (planError) throw planError;

    return actionPlan;
  } catch (error) {
    console.error("Error generating action plan for high risk:", error);
    throw error;
  }
}

// Conectar dados de empresa, setor e função para análise de riscos
export async function getRisksByDimension(companyId: string, dimension: 'sector' | 'role') {
  try {
    // Usar query direta ao invés de RPC execute_sql
    let query = supabase
      .from('risk_assessments')
      .select(`
        *,
        sectors(id, name),
        roles(id, name)
      `)
      .eq('company_id', companyId);

    if (dimension === 'sector') {
      query = query.not('sector_id', 'is', null);
    } else {
      query = query.not('role_id', 'is', null);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Processar dados agrupados por dimensão
    const grouped = data?.reduce((acc: any, item: any) => {
      const key = dimension === 'sector' 
        ? item.sector_id 
        : item.role_id;
      
      const name = dimension === 'sector'
        ? item.sectors?.name
        : item.roles?.name;

      if (!key || !name) return acc;

      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: name,
          total_assessments: 0,
          high_risk_count: 0,
          risk_values: []
        };
      }

      acc[key].total_assessments++;
      acc[key].risk_values.push(item.risk_value);
      
      if (['alto', 'altíssimo'].includes(item.risk_level.toLowerCase())) {
        acc[key].high_risk_count++;
      }

      return acc;
    }, {}) || {};

    // Converter para array e calcular médias
    return Object.values(grouped).map((item: any) => ({
      ...item,
      avg_risk_value: item.risk_values.reduce((sum: number, val: number) => sum + val, 0) / item.risk_values.length
    })).sort((a: any, b: any) => b.high_risk_count - a.high_risk_count || b.avg_risk_value - a.avg_risk_value);

  } catch (error) {
    console.error(`Error fetching risks by ${dimension}:`, error);
    return [];
  }
}
