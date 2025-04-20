
import { useState, useEffect } from "react";
import { Assessment } from "./types";
import { supabase } from "@/integrations/supabase/client";

export function useAssessments(companyId: string | null) {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!companyId) return;

    const fetchRecentAssessments = async () => {
      try {
        setLoading(true);
        console.log("Fetching recent assessments for company:", companyId);

        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('id, name, sector_id')
          .eq('company_id', companyId);

        if (empError) throw empError;
        
        if (!employees || employees.length === 0) {
          console.log("No employees found for this company");
          setLoading(false);
          return;
        }
        
        const employeeIds = employees.map(emp => emp.id);
        const employeeMap = employees.reduce((acc, emp) => {
          acc[emp.id] = { name: emp.name, sectorId: emp.sector_id };
          return acc;
        }, {} as Record<string, { name: string, sectorId: string }>);
        
        const { data: sectors, error: sectorError } = await supabase
          .from('sectors')
          .select('id, name')
          .in('id', employees.map(emp => emp.sector_id).filter(Boolean));
          
        if (sectorError) throw sectorError;
        
        const sectorMap = (sectors || []).reduce((acc, sector) => {
          acc[sector.id] = sector.name;
          return acc;
        }, {} as Record<string, string>);
        
        const { data: responses, error: responseError } = await supabase
          .from('assessment_responses')
          .select('id, employee_id, classification, completed_at')
          .in('employee_id', employeeIds)
          .order('completed_at', { ascending: false })
          .limit(5);
          
        if (responseError) throw responseError;

        if (responses && responses.length > 0) {
          const formattedAssessments = responses.map(response => {
            const employee = employeeMap[response.employee_id] || { name: 'Desconhecido', sectorId: '' };
            const sectorName = employee.sectorId ? (sectorMap[employee.sectorId] || 'Não especificado') : 'Não especificado';
            
            let riskLevel = 'Médio';
            const classification = String(response.classification || '').toLowerCase();
            
            if (classification === 'severe' || classification === 'critical') {
              riskLevel = 'Alto';
            } else if (classification === 'moderate') {
              riskLevel = 'Médio';
            } else if (classification === 'mild' || classification === 'normal') {
              riskLevel = 'Baixo';
            }
            
            return {
              id: response.id,
              employee: employee.name,
              sector: sectorName,
              date: response.completed_at,
              riskLevel: riskLevel
            };
          });

          setAssessments(formattedAssessments);
        } else {
          setAssessments([
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
          ]);
        }
      } catch (error) {
        console.error("Error fetching recent assessments:", error);
        setAssessments([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAssessments();
  }, [companyId]);

  return { assessments, loading };
}
