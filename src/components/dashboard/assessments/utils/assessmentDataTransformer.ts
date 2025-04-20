
import { Assessment } from "../types";

interface EmployeeData {
  id: string;
  name: string;
  sectorId: string;
}

interface SectorData {
  id: string;
  name: string;
}

interface AssessmentResponse {
  id: string;
  employee_id: string;
  classification: string;
  completed_at: string;
}

export function getRiskLevel(classification: string): string {
  const classificationLower = String(classification || '').toLowerCase();
  
  if (classificationLower === 'severe' || classificationLower === 'critical') {
    return 'Alto';
  } else if (classificationLower === 'moderate') {
    return 'Médio';
  } else if (classificationLower === 'mild' || classificationLower === 'normal') {
    return 'Baixo';
  }
  
  return 'Médio';
}

export function transformAssessmentData(
  responses: AssessmentResponse[],
  employeeMap: Record<string, { name: string; sectorId: string }>,
  sectorMap: Record<string, string>
): Assessment[] {
  // Sort responses by date descending to show most recent first
  const sortedResponses = [...responses].sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  return sortedResponses.map(response => {
    const employee = employeeMap[response.employee_id] || { name: 'Desconhecido', sectorId: '' };
    const sectorName = employee.sectorId ? (sectorMap[employee.sectorId] || 'Não especificado') : 'Não especificado';
    
    return {
      id: response.id,
      employee: employee.name,
      sector: sectorName,
      date: response.completed_at,
      riskLevel: getRiskLevel(response.classification)
    };
  });
}

export function createFallbackAssessments(): Assessment[] {
  const today = new Date();
  return [
    {
      id: 1,
      employee: "João Silva",
      sector: "Produção",
      date: new Date(today.setDate(today.getDate() - 2)).toISOString(),
      riskLevel: "Alto",
    },
    {
      id: 2,
      employee: "Maria Santos",
      sector: "Administrativo",
      date: new Date(today.setDate(today.getDate() - 1)).toISOString(),
      riskLevel: "Baixo",
    },
    {
      id: 3,
      employee: "Carlos Oliveira",
      sector: "TI",
      date: new Date(today.setDate(today.getDate() - 1)).toISOString(),
      riskLevel: "Médio",
    }
  ];
}
