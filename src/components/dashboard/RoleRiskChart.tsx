
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleRiskChartProps {
  companyId: string | null;
}

export function RoleRiskChart({ companyId }: RoleRiskChartProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!companyId) return;

    const fetchRoleRiskData = async () => {
      try {
        setLoading(true);
        console.log("Fetching role risk data for company:", companyId);

        // Get roles for this company
        const { data: roles, error: roleError } = await supabase
          .from('roles')
          .select('id, name')
          .eq('company_id', companyId);

        if (roleError) throw roleError;

        if (roles && roles.length > 0) {
          const roleData = [];

          for (const role of roles) {
            // Get employees in this role
            const { data: employees } = await supabase
              .from('employees')
              .select('id')
              .eq('role_id', role.id);

            if (!employees?.length) continue;

            const employeeIds = employees.map(emp => emp.id);

            // Get assessment responses for these employees
            const { data: assessments } = await supabase
              .from('assessment_responses')
              .select('classification')
              .in('employee_id', employeeIds);

            const riskCounts = {
              high: 0,
              medium: 0,
              low: 0
            };

            (assessments || []).forEach(assessment => {
              const classification = (assessment.classification || '').toLowerCase();
              if (classification === 'severe' || classification === 'critical') {
                riskCounts.high++;
              } else if (classification === 'moderate') {
                riskCounts.medium++;
              } else {
                riskCounts.low++;
              }
            });

            roleData.push({
              name: role.name,
              'Alto Risco': riskCounts.high,
              'Risco Médio': riskCounts.medium,
              'Baixo Risco': riskCounts.low
            });
          }

          setData(roleData);
        }

      } catch (error) {
        console.error("Error fetching role risk data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleRiskData();
  }, [companyId]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribuição de Riscos por Função</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col justify-center">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Riscos por Função</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Alto Risco" fill="#ef4444" />
              <Bar dataKey="Risco Médio" fill="#f59e0b" />
              <Bar dataKey="Baixo Risco" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
