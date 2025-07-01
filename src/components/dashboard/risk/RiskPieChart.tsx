
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip 
} from "recharts";

interface RiskData {
  name: string;
  value: number;
  color: string;
}

interface RiskPieChartProps {
  data: RiskData[];
}

export function RiskPieChart({ data }: RiskPieChartProps) {
  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

  return (
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
  );
}
