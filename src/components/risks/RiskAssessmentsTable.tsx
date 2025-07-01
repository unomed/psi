
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRiskAssessments, RiskAssessment } from "@/hooks/useRiskAssessments";

interface RiskAssessmentsTableProps {
  companyId?: string;
}

export function RiskAssessmentsTable({ companyId }: RiskAssessmentsTableProps) {
  const { riskAssessments, isLoading, deleteRiskAssessment } = useRiskAssessments(companyId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'identified': return 'destructive';
      case 'in_progress': return 'default';
      case 'mitigated': return 'secondary';
      case 'accepted': return 'outline';
      default: return 'default';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'baixo': return 'bg-green-100 text-green-800';
      case 'médio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'altíssimo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Carregando avaliações de risco...</div>;
  }

  if (riskAssessments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma avaliação de risco encontrada.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Nível de Risco</TableHead>
            <TableHead>Ação Recomendada</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Próxima Avaliação</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {riskAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">
                {assessment.employee_name || 'N/A'}
              </TableCell>
              <TableCell>{assessment.sector_name || 'N/A'}</TableCell>
              <TableCell>{assessment.role_name || 'N/A'}</TableCell>
              <TableCell>
                <Badge className={getRiskLevelColor(assessment.risk_level)}>
                  {assessment.risk_level} ({assessment.risk_value})
                </Badge>
              </TableCell>
              <TableCell>{assessment.recommended_action}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(assessment.status)}>
                  {assessment.status === 'identified' && 'Identificado'}
                  {assessment.status === 'in_progress' && 'Em Progresso'}
                  {assessment.status === 'mitigated' && 'Mitigado'}
                  {assessment.status === 'accepted' && 'Aceito'}
                </Badge>
              </TableCell>
              <TableCell>
                {assessment.next_assessment_date 
                  ? new Date(assessment.next_assessment_date).toLocaleDateString()
                  : 'N/A'
                }
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => deleteRiskAssessment.mutate(assessment.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
