
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

const data = [
  {
    name: "Produção",
    estresse: 65,
    assedio: 20,
    violencia: 15,
  },
  {
    name: "Administrativo",
    estresse: 45,
    assedio: 12,
    violencia: 5,
  },
  {
    name: "TI",
    estresse: 55,
    assedio: 18,
    violencia: 10,
  },
  {
    name: "Comercial",
    estresse: 40,
    assedio: 25,
    violencia: 12,
  },
  {
    name: "Logística",
    estresse: 48,
    assedio: 15,
    violencia: 25,
  },
];

export function SectorRiskChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fatores de Risco por Setor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="estresse" name="Estresse" fill="#3b82f6" />
              <Bar dataKey="assedio" name="Assédio" fill="#8b5cf6" />
              <Bar dataKey="violencia" name="Violência" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
