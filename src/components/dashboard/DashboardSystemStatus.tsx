
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardSystemStatusProps {
  totalTemplates: number;
  totalEmployees: number;
  completedAssessments: number;
}

export function DashboardSystemStatus({ 
  totalTemplates, 
  totalEmployees, 
  completedAssessments 
}: DashboardSystemStatusProps) {
  return (
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
  );
}
