
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { DateRange } from "react-day-picker";

interface RiskReductionTrendsProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function RiskReductionTrends({ filters }: RiskReductionTrendsProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const data = [
    { month: 'Jan', ps001: 8, ps002: 9, er001: 6, ac001: 8 },
    { month: 'Fev', ps001: 8, ps002: 9, er001: 6, ac001: 7 },
    { month: 'Mar', ps001: 7, ps002: 8, er001: 5, ac001: 6 },
    { month: 'Abr', ps001: 7, ps002: 7, er001: 5, ac001: 5 },
    { month: 'Mai', ps001: 6, ps002: 6, er001: 4, ac001: 4 },
    { month: 'Jun', ps001: 6, ps002: 5, er001: 4, ac001: 3 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tendências de Redução de Risco</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 10]} />
              <Tooltip formatter={(value, name) => [value, `Risco ${name.toUpperCase()}`]} />
              <Legend />
              <ReferenceLine y={3} stroke="green" strokeDasharray="3 3" label={{ value: 'Meta', position: 'right' }} />
              <Line type="monotone" dataKey="ps001" name="ps001" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="ps002" name="ps002" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="er001" name="er001" stroke="#ff7300" strokeWidth={2} />
              <Line type="monotone" dataKey="ac001" name="ac001" stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
