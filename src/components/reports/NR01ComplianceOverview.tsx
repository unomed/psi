
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      if (!filters.selectedCompany) {
        throw new Error('Company ID is required');
      }

      // 1. Buscar total de funcionários da empresa
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, name, sector_id, role_id, sectors(name), roles(name)')
        .eq('company_id', filters.selectedCompany)
        .eq('status', 'active')
        .eq('employee_type', 'funcionario');

      if (employeesError) throw employeesError;

      // 2. Buscar avaliações concluídas
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessment_responses')
        .select(`
          id,
          employee_id,
          raw_score,
          completed_at,
          risk_level,
          employees!inner(id, name, sector_id, role_id, sectors(name), roles(name))
        `)
        .eq('employees.company_id', filters.selectedCompany)
        .not('completed_at', 'is', null);

      if (assessmentsError) throw assessmentsError;

      // 3. Buscar planos de ação
      const { data: actionPlans, error: plansError } = await supabase
        .from('action_plans')
        .select('id, status, due_date, completion_date, risk_level')
        .eq('company_id', filters.selectedCompany);

      if (plansError) throw plansError;

      // 4. Calcular métricas de conformidade NR-01
      const totalEmployees = employees?.length || 0;
      const assessedEmployees = assessments?.length || 0;
      const complianceRate = totalEmployees > 0 ? (assessedEmployees / totalEmployees) * 100 : 0;

      // Riscos por nível
      const highRiskCount = assessments?.filter(a => 
        a.raw_score && a.raw_score >= 60
      ).length || 0;

      const mediumRiskCount = assessments?.filter(a => 
        a.raw_score && a.raw_score >= 30 && a.raw_score < 60
      ).length || 0;

      const lowRiskCount = assessments?.filter(a => 
        a.raw_score && a.raw_score < 30
      ).length || 0;

      // Ações pendentes e status dos planos
      const pendingActions = actionPlans?.filter(p => 
        p.status === 'pending' || p.status === 'in_progress'
      ).length || 0;

      const overdueActions = actionPlans?.filter(p => 
        p.due_date && new Date(p.due_date) < new Date() && p.status !== 'completed'
      ).length || 0;

      const completedActions = actionPlans?.filter(p => 
        p.status === 'completed'
      ).length || 0;

      // Última avaliação e próxima reavaliação
      const lastAssessment = assessments?.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0];

      const lastAssessmentDate = lastAssessment?.completed_at;
      const nextAssessmentDue = lastAssessmentDate 
        ? new Date(new Date(lastAssessmentDate).getTime() + 365 * 24 * 60 * 60 * 1000)
        : null;

      const daysUntilNextAssessment = nextAssessmentDue 
        ? Math.ceil((nextAssessmentDue.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))
        : null;

      return {
        totalEmployees,
        assessedEmployees,
        complianceRate,
        riskBreakdown: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: lowRiskCount
        },
        actionPlans: {
          pending: pendingActions,
          overdue: overdueActions,
          completed: completedActions,
          total: actionPlans?.length || 0
        },
        timeline: {
          lastAssessmentDate,
          nextAssessmentDue,
          daysUntilNextAssessment
        },
        assessments: assessments || [],
        employees: employees || []
      };
    },
    enabled: !!filters.selectedCompany
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getComplianceStatus = (rate: number) => {
    if (rate >= 90) return { status: "Excelente", color: "bg-green-500", icon: CheckCircle };
    if (rate >= 70) return { status: "Bom", color: "bg-blue-500", icon: TrendingUp };
    if (rate >= 50) return { status: "Regular", color: "bg-yellow-500", icon: Clock };
    return { status: "Crítico", color: "bg-red-500", icon: AlertTriangle };
  };

  const getTimelineStatus = (days: number | null) => {
    if (!days) return { status: "Sem dados", color: "bg-gray-500" };
    if (days <= 30) return { status: "Urgente", color: "bg-red-500" };
    if (days <= 90) return { status: "Atenção", color: "bg-yellow-500" };
    return { status: "Em dia", color: "bg-green-500" };
  };

  const compliance = getComplianceStatus(complianceData?.complianceRate || 0);
  const StatusIcon = compliance.icon;
  const timeline = getTimelineStatus(complianceData?.timeline.daysUntilNextAssessment);

  const formatDate = (date: string | null) => {
    return date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Compliance NR-01</h2>
        <p className="text-muted-foreground">
          Status de conformidade com a Norma Regulamentadora 01 - Disposições Gerais e Gerenciamento de Riscos Ocupacionais
        </p>
      </div>

      {/* Métricas principais */}
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
                <p className="text-sm font-medium text-muted-foreground">Riscos Altos</p>
                <p className="text-2xl font-bold text-red-600">{complianceData?.riskBreakdown.high}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <Badge variant={complianceData?.riskBreakdown.high === 0 ? "secondary" : "destructive"} className="mt-2">
              {complianceData?.riskBreakdown.high === 0 ? "Sem riscos altos" : "Ação necessária"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ações Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{complianceData?.actionPlans.pending}</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {complianceData?.actionPlans.overdue} em atraso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próxima Reavaliação</p>
                <p className="text-lg font-bold">{complianceData?.timeline.daysUntilNextAssessment || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">dias restantes</p>
              </div>
              <div className={`p-2 rounded-full ${timeline.color}`}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>
            <Badge className={`mt-2 ${timeline.color} text-white`}>
              {timeline.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Riscos por Nível</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{complianceData?.riskBreakdown.low}</div>
              <div className="text-sm text-green-600">Risco Baixo</div>
              <div className="text-xs text-muted-foreground">
                {complianceData?.assessedEmployees > 0 ? 
                  ((complianceData.riskBreakdown.low / complianceData.assessedEmployees) * 100).toFixed(1) : 0}% do total
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{complianceData?.riskBreakdown.medium}</div>
              <div className="text-sm text-yellow-600">Risco Médio</div>
              <div className="text-xs text-muted-foreground">
                {complianceData?.assessedEmployees > 0 ? 
                  ((complianceData.riskBreakdown.medium / complianceData.assessedEmployees) * 100).toFixed(1) : 0}% do total
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{complianceData?.riskBreakdown.high}</div>
              <div className="text-sm text-red-600">Risco Alto</div>
              <div className="text-xs text-muted-foreground">
                {complianceData?.assessedEmployees > 0 ? 
                  ((complianceData.riskBreakdown.high / complianceData.assessedEmployees) * 100).toFixed(1) : 0}% do total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle>Cronograma de Conformidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Última Avaliação Realizada</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(complianceData?.timeline.lastAssessmentDate)}
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Próxima Reavaliação Obrigatória</div>
                <div className="text-sm text-muted-foreground">
                  {complianceData?.timeline.nextAssessmentDue ? 
                    formatDate(complianceData.timeline.nextAssessmentDue.toISOString()) : 'N/A'}
                </div>
              </div>
              <div className={`p-1 rounded-full ${timeline.color}`}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Status dos Planos de Ação</div>
                <div className="text-sm text-muted-foreground">
                  {complianceData?.actionPlans.completed}/{complianceData?.actionPlans.total} concluídos
                </div>
              </div>
              <Progress 
                value={complianceData?.actionPlans.total > 0 ? 
                  (complianceData.actionPlans.completed / complianceData.actionPlans.total) * 100 : 0} 
                className="w-20" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
