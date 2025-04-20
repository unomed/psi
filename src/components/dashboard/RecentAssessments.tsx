import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Assessment {
  id: string | number;
  employee: string;
  sector: string;
  date: string;
  riskLevel: string;
}

interface RecentAssessmentsProps {
  companyId: string | null;
}

export function RecentAssessments({ companyId }: RecentAssessmentsProps) {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!companyId) return;

    const fetchRecentAssessments = async () => {
      try {
        setLoading(true);
        console.log("Fetching recent assessments for company:", companyId);

        // Get recent completed assessments
        const { data: completedAssessments, error } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            employee_name,
            scheduled_date,
            completed_at,
            employee_id
          `)
          .eq('company_id', companyId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (completedAssessments && completedAssessments.length > 0) {
          // Transform database data into the format needed for display
          const formattedAssessments: Assessment[] = await Promise.all(
            completedAssessments.map(async (assessment) => {
              // Get employee sector
              let sectorName = "Não especificado";
              
              if (assessment.employee_id) {
                const { data: employeeData, error: employeeError } = await supabase
                  .from('employees')
                  .select('sector_id')
                  .eq('id', assessment.employee_id)
                  .single();
                
                if (!employeeError && employeeData?.sector_id) {
                  const { data: sectorData, error: sectorError } = await supabase
                    .from('sectors')
                    .select('name')
                    .eq('id', employeeData.sector_id)
                    .single();
                  
                  if (!sectorError && sectorData) {
                    sectorName = sectorData.name;
                  }
                }
              }
              
              // Get risk level from assessment_responses
              const { data: responseData, error: responseError } = await supabase
                .from('assessment_responses')
                .select('classification')
                .eq('employee_id', assessment.employee_id)
                .order('completed_at', { ascending: false })
                .limit(1);

              let riskLevel = "Médio"; // Default if not found
              
              if (!responseError && responseData && responseData.length > 0) {
                const classification = responseData[0].classification;
                if (classification === 'high') {
                  riskLevel = 'Alto';
                } else if (classification === 'medium') {
                  riskLevel = 'Médio';
                } else if (classification === 'low') {
                  riskLevel = 'Baixo';
                }
              }

              return {
                id: assessment.id,
                employee: assessment.employee_name,
                sector: sectorName,
                date: assessment.completed_at || assessment.scheduled_date,
                riskLevel: riskLevel
              };
            })
          );

          setAssessments(formattedAssessments);
        } else {
          // If no real data, keep mock data
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
        // Keep mock data on error
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

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Avaliações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Funcionário</th>
                <th className="py-3 text-left font-medium">Setor</th>
                <th className="py-3 text-left font-medium">Data</th>
                <th className="py-3 text-left font-medium">Nível de Risco</th>
                <th className="py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="border-b last:border-0">
                  <td className="py-3">{assessment.employee}</td>
                  <td className="py-3">{assessment.sector}</td>
                  <td className="py-3">{new Date(assessment.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={
                        assessment.riskLevel === "Alto"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : assessment.riskLevel === "Médio"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {assessment.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
