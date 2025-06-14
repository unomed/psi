
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

interface DashboardNextStepsProps {
  totalEmployees: number;
  pendingAssessments: number;
}

export function DashboardNextSteps({ 
  totalEmployees, 
  pendingAssessments 
}: DashboardNextStepsProps) {
  return (
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
  );
}
