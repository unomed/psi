
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts";
import { DateRange } from "@/types/date";

interface RiskTypeDistributionProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskTypeDistribution({ filters }: RiskTypeDistributionProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { name: "Físicos", value: 20, color: "#3b82f6" },
    { name: "Químicos", value: 15, color: "#8b5cf6" },
    { name: "Biológicos", value: 10, color: "#ef4444" },
    { name: "Acidentes", value: 18, color: "#f59e0b" },
    { name: "Ergonômicos", value: 12, color: "#10b981" },
    { name: "Psicossociais", value: 15, color: "#6366f1" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição por Tipo de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} riscos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
