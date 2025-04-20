
import { useState, useEffect } from "react";
import { Assessment } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { 
  transformAssessmentData, 
  createFallbackAssessments 
} from "./utils/assessmentDataTransformer";

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
        }, {} as Record<string, { name: string; sectorId: string }>);
        
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
          const formattedAssessments = transformAssessmentData(responses, employeeMap, sectorMap);
          setAssessments(formattedAssessments);
        } else {
          setAssessments(createFallbackAssessments());
        }
      } catch (error) {
        console.error("Error fetching recent assessments:", error);
        setAssessments(createFallbackAssessments());
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAssessments();
  }, [companyId]);

  return { assessments, loading };
}
