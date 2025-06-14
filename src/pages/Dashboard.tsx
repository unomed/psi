
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  BarChart3,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSystemInitialization } from "@/hooks/useSystemInitialization";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useChecklistData } from "@/hooks/useChecklistData";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const { isInitializing } = useSystemInitialization();
  const { checklists, results, scheduledAssessments, isLoading } = useChecklistData();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Inicializando sistema...</span>
      </div>
    );
  }

  // Calcular métricas
  const totalEmployees = 0; // TODO: Implementar contagem de funcionários
  const totalTemplates = checklists?.length || 0;
  const pendingAssessments = scheduledAssessments?.filter(a => a.status === 'scheduled')?.length || 0;
  const completedAssessments = results?.length || 0;
  const criticalRisks = results?.filter(r => {
    const score = typeof r.results === 'object' && 'score' in r.results ? r.results.score : 0;
    return score > 80;
  })?.length || 0;

  const quickActions = [
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
      href: "/agendamento",
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de avaliação psicossocial
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Funcionários Cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Total de funcionários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Templates Disponíveis
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Templates de avaliação criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliações Pendentes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssessments}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando preenchimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Riscos Críticos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalRisks}</div>
            <p className="text-xs text-muted-foreground">
              Requerem ação imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
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

      {/* Status do sistema */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>
              Informações sobre a configuração atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Templates Psicossociais</span>
              <Badge variant={totalTemplates > 0 ? "default" : "secondary"}>
                {totalTemplates > 0 ? "Configurado" : "Pendente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Funcionários Cadastrados</span>
              <Badge variant={totalEmployees > 0 ? "default" : "secondary"}>
                {totalEmployees > 0 ? "Configurado" : "Pendente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Avaliações Realizadas</span>
              <Badge variant={completedAssessments > 0 ? "default" : "secondary"}>
                {completedAssessments > 0 ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              Sugestões para completar a configuração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalEmployees === 0 && (
              <div className="flex items-center justify-between">
                <span>Cadastrar funcionários</span>
                <Link to="/funcionarios">
                  <Button size="sm" variant="outline">
                    Ir para Funcionários
                  </Button>
                </Link>
              </div>
            )}
            {pendingAssessments === 0 && totalEmployees > 0 && (
              <div className="flex items-center justify-between">
                <span>Agendar primeira avaliação</span>
                <Link to="/agendamento">
                  <Button size="sm" variant="outline">
                    Sistema de Agendamento
                  </Button>
                </Link>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Configurar critérios de risco</span>
              <Link to="/configuracoes/criterios">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Configurar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avaliações recentes */}
      {completedAssessments > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
            <CardDescription>
              Últimas avaliações completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results?.slice(0, 5).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{result.employeeName || 'Funcionário'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge 
                    variant={criticalRisks > 0 ? "destructive" : "default"}
                  >
                    {result.dominantFactor}
                  </Badge>
                </div>
              ))}
              {results && results.length > 5 && (
                <div className="text-center pt-3">
                  <Link to="/relatorios">
                    <Button variant="outline" size="sm">
                      Ver todos os resultados
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
