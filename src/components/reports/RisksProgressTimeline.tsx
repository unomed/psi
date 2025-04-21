
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { DateRange } from "react-day-picker";

interface RisksProgressTimelineProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RisksProgressTimeline({ filters }: RisksProgressTimelineProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { name: 'Jan', riscosIdentificados: 65, riscosAnalisados: 60, riscosControlados: 48 },
    { name: 'Fev', riscosIdentificados: 68, riscosAnalisados: 63, riscosControlados: 52 },
    { name: 'Mar', riscosIdentificados: 72, riscosAnalisados: 65, riscosControlados: 55 },
    { name: 'Abr', riscosIdentificados: 75, riscosAnalisados: 70, riscosControlados: 58 },
    { name: 'Mai', riscosIdentificados: 80, riscosAnalisados: 73, riscosControlados: 60 },
    { name: 'Jun', riscosIdentificados: 82, riscosAnalisados: 75, riscosControlados: 63 },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Progresso na Gestão de Riscos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="riscosIdentificados" name="Riscos Identificados" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="riscosAnalisados" name="Riscos Analisados" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="riscosControlados" name="Riscos Controlados" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
