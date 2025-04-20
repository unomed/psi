import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface RiskLevelChartProps {
  companyId: string | null;
}

export function RiskLevelChart({ companyId }: RiskLevelChartProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([
    { name: "Alto Risco", value: 12, color: "#ef4444" },
    { name: "Risco Médio", value: 28, color: "#f59e0b" },
    { name: "Baixo Risco", value: 60, color: "#10b981" },
  ]);

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  useEffect(() => {
    if (!companyId) return;

    const fetchRiskData = async () => {
      try {
        setLoading(true);
        console.log("Fetching risk level data for company:", companyId);

        // First, get employees for this company
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

        // Fetch assessment responses for these employees and count by classification
        // We need to fetch the data and aggregate manually instead of using group
        const { data: assessments, error } = await supabase
          .from('assessment_responses')
          .select('*')
          .in('employee_id', employeeIds);

        if (error) throw error;

        if (assessments && assessments.length > 0) {
          // Manually count classifications
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
          
          // Transform to chart data format
          const chartData = [
            { 
              name: "Alto Risco", 
              value: counts.severe, 
              color: "#ef4444" 
            },
            { 
              name: "Risco Médio", 
              value: counts.moderate, 
              color: "#f59e0b" 
            },
            { 
              name: "Baixo Risco", 
              value: counts.normal + counts.mild, 
              color: "#10b981" 
            }
          ];
          
          // Only update if we have actual data
          if (chartData.some(item => item.value > 0)) {
            setData(chartData);
          }
        }
      } catch (error) {
        console.error("Error fetching risk level data:", error);
        // Keep the default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [companyId]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribuição de Níveis de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Níveis de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} funcionários`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
