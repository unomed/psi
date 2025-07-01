
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleRiskComparisonProps {
  filters: {
    selectedCompany: string | null;
    dateRange: any;
    selectedSector: string;
    selectedRole: string;
  };
}

export function RoleRiskComparison({ filters }: RoleRiskComparisonProps) {
  const { reportsData, isLoading } = useReportsData(filters.selectedCompany || undefined);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Riscos por Função</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!reportsData || reportsData.riskByRole.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Riscos por Função</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            {!reportsData ? 
              "Erro ao carregar dados dos relatórios" : 
              "Nenhum dado de função encontrado para os filtros selecionados"
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação de Riscos por Função</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportsData.riskByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="role" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="high" stackId="a" fill="#ef4444" name="Alto Risco" />
              <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Médio Risco" />
              <Bar dataKey="low" stackId="a" fill="#22c55e" name="Baixo Risco" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
