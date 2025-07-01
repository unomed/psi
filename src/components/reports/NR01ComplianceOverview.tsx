
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface NR01ComplianceOverviewProps {
  filters: {
    selectedCompany: string | null;
    dateRange: any;
    selectedSector: string;
    selectedRole: string;
  };
}

export function NR01ComplianceOverview({ filters }: NR01ComplianceOverviewProps) {
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['nr01Compliance', filters.selectedCompany],
    queryFn: async () => {
      // Buscar dados de conformidade NR-01
      let assessmentsQuery = supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(
            id, name, company_id, role_id, sector_id,
            roles(name),
            sectors(name)
          )
        `);

      if (filters.selectedCompany) {
        assessmentsQuery = assessmentsQuery.eq('employees.company_id', filters.selectedCompany);
      }

      const { data: assessments, error } = await assessmentsQuery;
      if (error) throw error;

      // Buscar dados de análise de risco psicossocial
      let riskAnalysisQuery = supabase
        .from('psychosocial_risk_analysis')
        .select('*');

      if (filters.selectedCompany) {
        riskAnalysisQuery = riskAnalysisQuery.eq('company_id', filters.selectedCompany);
      }

      const { data: riskAnalysis } = await riskAnalysisQuery;

      // Calcular métricas de conformidade
      const totalEmployees = assessments?.length || 0;
      const assessedEmployees = assessments?.filter(a => a.completed_at).length || 0;
      const highRiskCount = riskAnalysis?.filter(r => r.exposure_level === 'alto' || r.exposure_level === 'critico').length || 0;
      const pendingActions = riskAnalysis?.filter(r => r.status === 'identified').length || 0;

      const complianceRate = totalEmployees > 0 ? (assessedEmployees / totalEmployees) * 100 : 0;

      return {
        totalEmployees,
        assessedEmployees,
        complianceRate,
        highRiskCount,
        pendingActions,
        assessments: assessments || [],
        riskAnalysis: riskAnalysis || []
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getComplianceStatus = (rate: number) => {
    if (rate >= 90) return { status: "Excelente", color: "bg-green-500", icon: CheckCircle };
    if (rate >= 70) return { status: "Bom", color: "bg-blue-500", icon: TrendingUp };
    if (rate >= 50) return { status: "Regular", color: "bg-yellow-500", icon: Clock };
    return { status: "Crítico", color: "bg-red-500", icon: AlertTriangle };
  };

  const compliance = getComplianceStatus(complianceData?.complianceRate || 0);
  const StatusIcon = compliance.icon;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conformidade</p>
                <p className="text-2xl font-bold">{complianceData?.complianceRate.toFixed(1)}%</p>
              </div>
              <div className={`p-2 rounded-full ${compliance.color}`}>
                <StatusIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={complianceData?.complianceRate || 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {complianceData?.assessedEmployees}/{complianceData?.totalEmployees} funcionários avaliados
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Riscos Altos/Críticos</p>
                <p className="text-2xl font-bold text-red-600">{complianceData?.highRiskCount}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <Badge variant={complianceData?.highRiskCount === 0 ? "secondary" : "destructive"} className="mt-2">
              {complianceData?.highRiskCount === 0 ? "Sem riscos críticos" : "Ação necessária"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ações Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceData?.pendingActions}</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Medidas de controle identificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status Geral</p>
                <p className="text-lg font-bold">{compliance.status}</p>
              </div>
              <div className={`p-2 rounded-full ${compliance.color}`}>
                <StatusIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Conformidade NR-01
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
