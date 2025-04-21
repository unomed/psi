
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { DateRange } from "react-day-picker";

interface ActionImplementationTimelineProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionImplementationTimeline({ filters }: ActionImplementationTimelineProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const currentDate = new Date();
  const data = [
    { name: "Maio", planejadas: 12, concluidas: 10, emAndamento: 2, atrasadas: 0 },
    { name: "Junho", planejadas: 15, concluidas: 8, emAndamento: 5, atrasadas: 2 },
    { name: "Julho", planejadas: 20, concluidas: 0, emAndamento: 12, atrasadas: 0 },
    { name: "Agosto", planejadas: 10, concluidas: 0, emAndamento: 5, atrasadas: 0 },
    { name: "Setembro", planejadas: 8, concluidas: 0, emAndamento: 0, atrasadas: 0 },
    { name: "Outubro", planejadas: 5, concluidas: 0, emAndamento: 0, atrasadas: 0 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cronograma de Implementação</CardTitle>
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
              <ReferenceLine x={currentDate.getMonth() === 4 ? "Maio" : currentDate.getMonth() === 5 ? "Junho" : "Julho"} stroke="#888" strokeDasharray="3 3" label={{ value: 'Atual', position: 'insideTopRight' }} />
              <Bar dataKey="planejadas" fill="#6366f1" name="Planejadas" />
              <Bar dataKey="concluidas" fill="#10b981" name="Concluídas" />
              <Bar dataKey="emAndamento" fill="#f59e0b" name="Em andamento" />
              <Bar dataKey="atrasadas" fill="#ef4444" name="Atrasadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
