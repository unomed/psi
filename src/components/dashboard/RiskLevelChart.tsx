
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

        // Fetch assessment responses for these employees
        const { data: assessments, error } = await supabase
          .from('assessment_responses')
          .select('classification, count(*)')
          .in('employee_id', employeeIds)
          .groupBy('classification');

        if (error) throw error;

        if (assessments && assessments.length > 0) {
          // Transform database data into the format needed for the chart
          const chartData = [
            { 
              name: "Alto Risco", 
              value: assessments.find(a => a.classification === 'high')?.count || 0, 
              color: "#ef4444" 
            },
            { 
              name: "Risco Médio", 
              value: assessments.find(a => a.classification === 'medium')?.count || 0, 
              color: "#f59e0b" 
            },
            { 
              name: "Baixo Risco", 
              value: assessments.find(a => a.classification === 'low')?.count || 0, 
              color: "#10b981" 
            },
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
