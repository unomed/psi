
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip
} from "recharts";
import { DateRange } from "react-day-picker";

interface RiskLevelDistributionProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
  fullWidth?: boolean;
}

export function RiskLevelDistribution({ filters, fullWidth = false }: RiskLevelDistributionProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { name: "Alto Risco", value: 12, color: "#ef4444" },
    { name: "Risco Médio", value: 28, color: "#f59e0b" },
    { name: "Baixo Risco", value: 60, color: "#10b981" },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  return (
    <Card className={`h-full ${fullWidth ? 'col-span-full' : ''}`}>
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
