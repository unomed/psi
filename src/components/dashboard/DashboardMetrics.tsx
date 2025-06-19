
import { AlertTriangle, Calendar, CheckCircle2, ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardMetricsProps {
  companyId?: string | null;
}

export function DashboardMetrics({ companyId }: DashboardMetricsProps) {
  // Mock data - em produção, estes dados viriam de hooks
  const metrics = [
    {
      title: "Avaliações Pendentes",
      value: 12,
      description: "Aguardando conclusão",
      icon: ClipboardList,
      className: "bg-amber-50"
    },
    {
      title: "Avaliações Concluídas",
      value: 85,
      description: "Este mês",
      icon: CheckCircle2,
      className: "bg-green-50"
    },
    {
      title: "Funcionários em Risco Alto",
      value: 3,
      description: "Necessitam atenção",
      icon: AlertTriangle,
      className: "bg-red-50"
    },
    {
      title: "Próximas Reavaliações",
      value: 8,
      description: "Nos próximos 30 dias",
      icon: Calendar,
      className: "bg-blue-50"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className={metric.className}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
