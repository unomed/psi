
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { DateRange } from "@/types/date";

interface RiskAnalysisSummaryProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskAnalysisSummary({ filters }: RiskAnalysisSummaryProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    {
      name: "Severidade",
      Alta: 15,
      Média: 25,
      Baixa: 42
    },
    {
      name: "Probabilidade",
      Alta: 18,
      Média: 30,
      Baixa: 34
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Distribuição de Severidade e Probabilidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Alta" stackId="a" fill="#ef4444" name="Alta" />
              <Bar dataKey="Média" stackId="a" fill="#f59e0b" name="Média" />
              <Bar dataKey="Baixa" stackId="a" fill="#10b981" name="Baixa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
