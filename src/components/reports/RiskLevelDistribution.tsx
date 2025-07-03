
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { Skeleton } from "@/components/ui/skeleton";

interface RiskLevelDistributionProps {
  filters: {
    selectedCompany: string | null;
    dateRange: any;
    selectedSector: string;
    selectedRole: string;
  };
  fullWidth?: boolean;
}

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b', 
  low: '#22c55e'
};

export function RiskLevelDistribution({ filters, fullWidth = false }: RiskLevelDistributionProps) {
  const { reportsData, isLoading } = useReportsData(
    filters.selectedCompany || undefined, 
    filters.selectedSector, 
    filters.selectedRole
  );

  if (isLoading) {
    return (
      <Card className={fullWidth ? "col-span-full" : ""}>
        <CardHeader>
          <CardTitle>Distribuição de Níveis de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!reportsData) {
    return (
      <Card className={fullWidth ? "col-span-full" : ""}>
        <CardHeader>
          <CardTitle>Distribuição de Níveis de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Erro ao carregar dados dos relatórios
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: 'Alto Risco', value: reportsData.highRiskEmployees, color: COLORS.high },
    { name: 'Médio Risco', value: reportsData.mediumRiskEmployees, color: COLORS.medium },
    { name: 'Baixo Risco', value: reportsData.lowRiskEmployees, color: COLORS.low }
  ].filter(item => item.value > 0);

  const total = reportsData.highRiskEmployees + reportsData.mediumRiskEmployees + reportsData.lowRiskEmployees;

  if (total === 0) {
    return (
      <Card className={fullWidth ? "col-span-full" : ""}>
        <CardHeader>
          <CardTitle>Distribuição de Níveis de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Nenhuma avaliação encontrada para os filtros selecionados
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Distribuição de Níveis de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} funcionários`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{reportsData.highRiskEmployees}</div>
            <div className="text-sm text-muted-foreground">Alto Risco</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{reportsData.mediumRiskEmployees}</div>
            <div className="text-sm text-muted-foreground">Médio Risco</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reportsData.lowRiskEmployees}</div>
            <div className="text-sm text-muted-foreground">Baixo Risco</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
