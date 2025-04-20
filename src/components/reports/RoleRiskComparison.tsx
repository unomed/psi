
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from "recharts";
import { DateRange } from "react-day-picker";

interface RoleRiskComparisonProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RoleRiskComparison({ filters }: RoleRiskComparisonProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { subject: 'Estresse', Gerente: 80, Analista: 70, Operador: 50, Assistente: 60, Técnico: 65 },
    { subject: 'Ansiedade', Gerente: 85, Analista: 65, Operador: 45, Assistente: 55, Técnico: 60 },
    { subject: 'Depressão', Gerente: 65, Analista: 45, Operador: 40, Assistente: 50, Técnico: 45 },
    { subject: 'Burnout', Gerente: 75, Analista: 60, Operador: 35, Assistente: 45, Técnico: 50 },
    { subject: 'Assédio', Gerente: 45, Analista: 40, Operador: 65, Assistente: 50, Técnico: 55 },
    { subject: 'Violência', Gerente: 30, Analista: 25, Operador: 60, Assistente: 40, Técnico: 45 },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Comparação de Riscos por Função</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Gerente" dataKey="Gerente" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Analista" dataKey="Analista" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              <Radar name="Operador" dataKey="Operador" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              <Radar name="Assistente" dataKey="Assistente" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Radar name="Técnico" dataKey="Técnico" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
