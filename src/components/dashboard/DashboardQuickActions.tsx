
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Plus,
  Calendar, 
  Users, 
  BarChart3,
  LucideIcon
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export function DashboardQuickActions() {
  const quickActions: QuickAction[] = [
    {
      title: "Novo Template",
      description: "Criar template de avaliação",
      icon: Plus,
      href: "/checklists",
      color: "bg-blue-500"
    },
    {
      title: "Agendamento Integrado", 
      description: "Sistema completo de agendamento",
      icon: Calendar,
      href: "/agendamentos",
      color: "bg-green-500"
    },
    {
      title: "Funcionários",
      description: "Gerenciar funcionários",
      icon: Users,
      href: "/funcionarios", 
      color: "bg-purple-500"
    },
    {
      title: "Relatórios",
      description: "Ver relatórios e análises",
      icon: BarChart3,
      href: "/relatorios",
      color: "bg-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>
          Acesso rápido às principais funcionalidades do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center p-4">
                  <div className={`p-2 rounded-md ${action.color} text-white mr-3`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
