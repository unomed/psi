
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

interface ActionImplementationStatusProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionImplementationStatus({ filters }: ActionImplementationStatusProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { name: "Concluídas", value: 12, color: "#10b981" },
    { name: "Em andamento", value: 18, color: "#f59e0b" },
    { name: "Não iniciadas", value: 10, color: "#6366f1" },
    { name: "Atrasadas", value: 5, color: "#ef4444" },
    { name: "Canceladas", value: 2, color: "#71717a" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status de Implementação das Ações</CardTitle>
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
              <Tooltip formatter={(value) => [`${value} ações`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
