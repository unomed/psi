
import { supabase } from "@/integrations/supabase/client";

export interface RiskAssessment {
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
}

export interface RiskFactor {
  id: string;
  name: string;
  category: string;
  weight: number;
  description: string;
}

// For now, we'll use assessment_responses to simulate risk assessments
// since the risk_assessments table doesn't exist yet
export async function getRiskAssessments(companyId?: string) {
  try {
    let query = supabase
      .from('assessment_responses')
      .select(`
        *,
        employees!inner(
          id, name, company_id, role_id, sector_id,
          roles(name),
          sectors(name)
        )
      `)
      .order('completed_at', { ascending: false });

    if (companyId) {
      query = query.eq('employees.company_id', companyId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform assessment responses into risk assessments format
    return data?.map(response => ({
      id: response.id,
      company_id: response.employees?.company_id || '',
      employee_id: response.employee_id || '',
      assessment_date: new Date(response.completed_at),
      risk_level: response.percentile >= 70 ? 'high' : response.percentile >= 30 ? 'medium' : 'low',
      risk_factors: ['Avaliação Psicossocial'],
      mitigation_actions: [],
      status: 'completed',
      created_at: new Date(response.completed_at),
      updated_at: new Date(response.completed_at),
      employee: response.employees
    })) || [];
  } catch (error) {
    console.error("Error fetching risk assessments:", error);
    return [];
  }
}

export async function getRiskFactors() {
  // Return mock risk factors for now
  return [
    {
      id: '1',
      name: 'Stress Ocupacional',
      category: 'Psicossocial',
      weight: 1.0,
      description: 'Nível de stress relacionado ao trabalho'
    },
    {
      id: '2',
      name: 'Carga de Trabalho',
      category: 'Organizacional',
      weight: 0.8,
      description: 'Intensidade da carga de trabalho'
    },
    {
      id: '3',
      name: 'Relacionamento Interpessoal',
      category: 'Social',
      weight: 0.7,
      description: 'Qualidade dos relacionamentos no trabalho'
    }
  ];
}

// Placeholder functions for future implementation
export async function createRiskAssessment(data: any) {
  console.log("Risk assessment creation not implemented yet:", data);
  throw new Error("Risk assessment creation not implemented yet");
}

export async function updateRiskAssessment(id: string, updates: any) {
  console.log("Risk assessment update not implemented yet:", id, updates);
  throw new Error("Risk assessment update not implemented yet");
}

export async function deleteRiskAssessment(id: string) {
  console.log("Risk assessment deletion not implemented yet:", id);
  throw new Error("Risk assessment deletion not implemented yet");
}
