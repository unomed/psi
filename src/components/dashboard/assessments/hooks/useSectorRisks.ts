
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SectorRisk {
  sectorName: string;
  totalAssessments: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export function useSectorRisks(companyId: string | null) {
  const [loading, setLoading] = useState(true);
  const [sectorRisks, setSectorRisks] = useState<SectorRisk[]>([]);

  useEffect(() => {
    if (!companyId) return;

    const fetchSectorRisks = async () => {
      try {
        setLoading(true);

        // Get sectors for the company
        const { data: sectors, error: sectorError } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('company_id', companyId);

        if (sectorError) throw sectorError;

        if (!sectors || sectors.length === 0) {
          setLoading(false);
          return;
        }

        // For each sector, get employee IDs and then assessments
        const sectorRisksData: SectorRisk[] = await Promise.all(
          sectors.map(async (sector) => {
            // Get employees in this sector
            const { data: employees } = await supabase
              .from('employees')
              .select('id')
              .eq('sector_id', sector.id);

            if (!employees || employees.length === 0) {
              return {
                sectorName: sector.name,
                totalAssessments: 0,
                highRiskCount: 0,
                mediumRiskCount: 0,
                lowRiskCount: 0
              };
            }

            const employeeIds = employees.map(emp => emp.id);

            // Get assessments for these employees
            const { data: assessments } = await supabase
              .from('assessment_responses')
              .select('classification')
              .in('employee_id', employeeIds);

            const riskCounts = (assessments || []).reduce((acc, assessment) => {
              const classification = (assessment.classification || '').toLowerCase();
              if (classification === 'severe' || classification === 'critical') {
                acc.highRiskCount++;
              } else if (classification === 'moderate') {
                acc.mediumRiskCount++;
              } else {
                acc.lowRiskCount++;
              }
              return acc;
            }, { highRiskCount: 0, mediumRiskCount: 0, lowRiskCount: 0 });

            return {
              sectorName: sector.name,
              totalAssessments: (assessments || []).length,
              ...riskCounts
            };
          })
        );

        setSectorRisks(sectorRisksData);
      } catch (error) {
        console.error("Error fetching sector risks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectorRisks();
  }, [companyId]);

  return { sectorRisks, loading };
}
