
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, AlertTriangle } from "lucide-react";

export function RecentActivity() {
  // Mock data - em produção, estes dados viriam de hooks
  const activities = [
    {
      id: 1,
      type: "assessment",
      title: "Avaliação Psicossocial Concluída",
      description: "João Silva completou avaliação do setor Administrativo",
      timestamp: "2 horas atrás",
      icon: FileText,
      badge: "Concluído",
      badgeVariant: "default" as const
    },
    {
      id: 2,
      type: "risk",
      title: "Risco Alto Identificado",
      description: "Maria Santos - Setor Operacional necessita atenção",
      timestamp: "4 horas atrás",
      icon: AlertTriangle,
      badge: "Risco Alto",
      badgeVariant: "destructive" as const
    },
    {
      id: 3,
      type: "user",
      title: "Novo Funcionário Cadastrado",
      description: "Pedro Oliveira foi adicionado ao sistema",
      timestamp: "1 dia atrás",
      icon: User,
      badge: "Novo",
      badgeVariant: "secondary" as const
    },
    {
      id: 4,
      type: "assessment",
      title: "Lembrete de Reavaliação",
      description: "5 funcionários precisam ser reavaliados esta semana",
      timestamp: "2 dias atrás",
      icon: Clock,
      badge: "Pendente",
      badgeVariant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Últimas atividades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg border">
              <div className="p-2 rounded-full bg-muted">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge variant={activity.badgeVariant}>{activity.badge}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
