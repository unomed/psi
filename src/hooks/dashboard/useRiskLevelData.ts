
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RiskData {
  name: string;
  value: number;
  color: string;
}

export function useRiskLevelData(companyId: string | null) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RiskData[]>([
    { name: "Alto Risco", value: 12, color: "#ef4444" },
    { name: "Risco Médio", value: 28, color: "#f59e0b" },
    { name: "Baixo Risco", value: 60, color: "#10b981" },
  ]);

  useEffect(() => {
    if (!companyId) return;

    const fetchRiskData = async () => {
      try {
        setLoading(true);
        console.log("Fetching risk level data for company:", companyId);

        const { data: employees, error: empError } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);

        if (empError) throw empError;
        
        if (!employees || employees.length === 0) {
          console.log("No employees found for this company");
          setLoading(false);
          return;
        }
        
        const employeeIds = employees.map(emp => emp.id);

        const { data: assessments, error } = await supabase
          .from('assessment_responses')
          .select('*')
          .in('employee_id', employeeIds);

        if (error) throw error;

        if (assessments && assessments.length > 0) {
          const counts = {
            severe: 0,
            moderate: 0,
            mild: 0,
            normal: 0
          };
          
          assessments.forEach(assessment => {
            const classification = assessment.classification || 'normal';
            if (classification === 'severe' || classification === 'critical') {
              counts.severe++;
            } else if (classification === 'moderate') {
              counts.moderate++;
            } else if (classification === 'mild') {
              counts.mild++;
            } else {
              counts.normal++;
            }
          });
          
          const chartData = [
            { name: "Alto Risco", value: counts.severe, color: "#ef4444" },
            { name: "Risco Médio", value: counts.moderate, color: "#f59e0b" },
            { name: "Baixo Risco", value: counts.normal + counts.mild, color: "#10b981" }
          ];
          
          if (chartData.some(item => item.value > 0)) {
            setData(chartData);
          }
        }
      } catch (error) {
        console.error("Error fetching risk level data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [companyId]);

  return { data, loading };
}
