
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Plus,
  Calendar, 
  Users, 
  BarChart3,
  ClipboardList,
  Building2,
  LucideIcon
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export function QuickActions() {
  const quickActions: QuickAction[] = [
    {
      title: "Nova Avaliação",
      description: "Criar nova avaliação psicossocial",
      icon: Plus,
      href: "/avaliacoes",
      color: "bg-blue-500"
    },
    {
      title: "Agendar Avaliação", 
      description: "Sistema de agendamento integrado",
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
      title: "Empresas",
      description: "Gerenciar empresas",
      icon: Building2,
      href: "/empresas",
      color: "bg-orange-500"
    },
    {
      title: "Templates",
      description: "Criar templates de avaliação",
      icon: ClipboardList,
      href: "/checklists",
      color: "bg-indigo-500"
    },
    {
      title: "Relatórios",
      description: "Ver relatórios e análises",
      icon: BarChart3,
      href: "/relatorios",
      color: "bg-pink-500"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Button 
                variant="outline" 
                className="h-auto p-4 w-full justify-start hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
