/**
 * FASE 4: DASHBOARD CONSOLIDADO
 * RESPONSABILIDADE: Interface principal para relatórios consolidados
 * 
 * FUNCIONALIDADES:
 * - Estatísticas completas da empresa
 * - Visualizações interativas
 * - Geração de PDF integrada
 * - Análises por setor e função
 * 
 * INTEGRAÇÃO:
 * - Usa useConsolidatedReports
 * - Integra com usePDFGenerator
 * - Compatible com sistema de design
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  TrendingUp,
  Building,
  UserCheck
} from "lucide-react";
import { ConsolidatedReportData } from "@/hooks/reports/useConsolidatedReports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConsolidatedDashboardProps {
  data: ConsolidatedReportData;
  isLoading: boolean;
  onGeneratePDF: () => void;
  onGenerateQuickPDF: () => void;
}

export function ConsolidatedDashboard({ 
  data, 
  isLoading, 
  onGeneratePDF, 
  onGenerateQuickPDF 
}: ConsolidatedDashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (date: string | null) => {
    return date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'baixo': return 'bg-blue-100 text-blue-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-red-100 text-red-800';
      case 'critico': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case 'compliant':
        return { label: 'Conforme', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'attention':
        return { label: 'Atenção', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
      case 'critical':
        return { label: 'Crítico', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      default:
        return { label: 'N/A', color: 'bg-gray-100 text-gray-800', icon: Activity };
    }
  };

  const complianceInfo = getComplianceStatus(data.complianceMetrics.complianceStatus);
  const ComplianceIcon = complianceInfo.icon;

  return (
    <div id="consolidated-dashboard" className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatório Consolidado</h1>
          <p className="text-muted-foreground">
            Dashboard completo da empresa {data.companyInfo.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onGenerateQuickPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF Rápido
          </Button>
          <Button onClick={onGeneratePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Relatório Completo PDF
          </Button>
        </div>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Funcionários</p>
                <p className="text-3xl font-bold">{data.totalStats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliações Concluídas</p>
                <p className="text-3xl font-bold">{data.totalStats.completedAssessments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cobertura de Avaliação</p>
                <p className="text-3xl font-bold">{data.totalStats.assessmentCoverage.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={data.totalStats.assessmentCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status de Compliance</p>
                <Badge className={`mt-1 ${complianceInfo.color}`}>
                  <ComplianceIcon className="mr-1 h-3 w-3" />
                  {complianceInfo.label}
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de risco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Distribuição de Risco Psicossocial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.riskDistribution.baixo}</div>
              <div className="text-sm text-blue-600">Risco Baixo</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{data.riskDistribution.medio}</div>
              <div className="text-sm text-yellow-600">Risco Médio</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{data.riskDistribution.alto}</div>
              <div className="text-sm text-red-600">Risco Alto</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data.riskDistribution.critico}</div>
              <div className="text-sm text-purple-600">Risco Crítico</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise por setor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Análise por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Setor</th>
                  <th className="text-center p-2">Funcionários</th>
                  <th className="text-center p-2">Avaliações</th>
                  <th className="text-center p-2">Cobertura</th>
                  <th className="text-center p-2">Score Médio</th>
                  <th className="text-center p-2">Nível de Risco</th>
                </tr>
              </thead>
              <tbody>
                {data.sectorAnalysis.map((sector, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{sector.sectorName}</td>
                    <td className="p-2 text-center">{sector.totalEmployees}</td>
                    <td className="p-2 text-center">{sector.assessments}</td>
                    <td className="p-2 text-center">{sector.coverage.toFixed(1)}%</td>
                    <td className="p-2 text-center">{sector.averageScore.toFixed(1)}</td>
                    <td className="p-2 text-center">
                      <Badge className={getRiskLevelColor(sector.riskLevel)}>
                        {sector.riskLevel.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise por função */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Análise por Função
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Função</th>
                  <th className="text-center p-2">Funcionários</th>
                  <th className="text-center p-2">Avaliações</th>
                  <th className="text-center p-2">Cobertura</th>
                  <th className="text-center p-2">Score Médio</th>
                  <th className="text-center p-2">Nível de Risco</th>
                </tr>
              </thead>
              <tbody>
                {data.roleAnalysis.map((role, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{role.roleName}</td>
                    <td className="p-2 text-center">{role.totalEmployees}</td>
                    <td className="p-2 text-center">{role.assessments}</td>
                    <td className="p-2 text-center">{role.coverage.toFixed(1)}%</td>
                    <td className="p-2 text-center">{role.averageScore.toFixed(1)}</td>
                    <td className="p-2 text-center">
                      <Badge className={getRiskLevelColor(role.riskLevel)}>
                        {role.riskLevel.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Planos de ação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Status dos Planos de Ação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.actionPlansStatus.total}</div>
              <div className="text-sm text-blue-600">Total de Planos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.actionPlansStatus.completed}</div>
              <div className="text-sm text-green-600">Concluídos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{data.actionPlansStatus.inProgress}</div>
              <div className="text-sm text-yellow-600">Em Andamento</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{data.actionPlansStatus.overdue}</div>
              <div className="text-sm text-red-600">Em Atraso</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxa de Conclusão</span>
              <span>{data.actionPlansStatus.completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={data.actionPlansStatus.completionRate} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Informações de compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Conformidade NR-01
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Última Avaliação</label>
              <p className="text-lg font-semibold">{formatDate(data.complianceMetrics.lastAssessmentDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Próxima Avaliação</label>
              <p className="text-lg font-semibold">{formatDate(data.complianceMetrics.nextAssessmentDue)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dias Restantes</label>
              <p className="text-lg font-semibold">{data.complianceMetrics.daysUntilDue} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}