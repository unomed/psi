
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { DateRange } from "@/types/date";

interface RisksByCategoryProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RisksByCategory({ filters }: RisksByCategoryProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { name: "Sobrecarga", value: 18, color: "#3b82f6" },
    { name: "Assédio", value: 10, color: "#ef4444" },
    { name: "Autonomia", value: 8, color: "#10b981" },
    { name: "Reconhecimento", value: 12, color: "#f59e0b" },
    { name: "Rel. Interpessoais", value: 15, color: "#8b5cf6" },
    { name: "Clareza", value: 7, color: "#6366f1" },
    { name: "Isolamento", value: 5, color: "#ec4899" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Riscos Psicossociais por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(value) => [`${value} riscos`, 'Quantidade']} />
              <Legend />
              <Bar dataKey="value" name="Quantidade" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
