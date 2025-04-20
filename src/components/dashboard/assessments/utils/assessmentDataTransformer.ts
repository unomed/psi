
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
  return responses.map(response => {
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
  return [
    {
      id: 1,
      employee: "João Silva",
      sector: "Produção",
      date: "2025-04-05",
      riskLevel: "Alto",
    },
    {
      id: 2,
      employee: "Maria Santos",
      sector: "Administrativo",
      date: "2025-04-04",
      riskLevel: "Baixo",
    },
    {
      id: 3,
      employee: "Carlos Oliveira",
      sector: "TI",
      date: "2025-04-03",
      riskLevel: "Médio",
    },
    {
      id: 4,
      employee: "Ana Costa",
      sector: "Comercial",
      date: "2025-04-02",
      riskLevel: "Baixo",
    },
    {
      id: 5,
      employee: "Pedro Souza",
      sector: "Logística",
      date: "2025-04-01",
      riskLevel: "Médio",
    },
  ];
}
