
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface NR01ComplianceReportProps {
  companyId: string;
  periodStart: string;
  periodEnd: string;
}

export function NR01ComplianceReport({ 
  companyId, 
  periodStart, 
  periodEnd 
}: NR01ComplianceReportProps) {
  
  // Fetch compliance data
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['nr01-compliance', companyId, periodStart, periodEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nr01_compliance')
        .select('*')
        .eq('company_id', companyId)
        .gte('evaluation_period_start', periodStart)
        .lte('evaluation_period_end', periodEnd)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!companyId
  });

  // Fetch detailed metrics
  const { data: metricsData } = useQuery({
    queryKey: ['nr01-metrics', companyId, periodStart, periodEnd],
    queryFn: async () => {
      const [assessments, risks, actionPlans] = await Promise.all([
        supabase
          .from('assessment_responses')
          .select('*, employees!inner(company_id)')
          .eq('employees.company_id', companyId)
          .gte('completed_at', periodStart)
          .lte('completed_at', periodEnd),
        
        supabase
          .from('psychosocial_risk_analysis')
          .select('*')
          .eq('company_id', companyId)
          .gte('evaluation_date', periodStart)
          .lte('evaluation_date', periodEnd),
        
        supabase
          .from('action_plans')
          .select('*')
          .eq('company_id', companyId)
          .gte('created_at', periodStart)
          .lte('created_at', periodEnd)
      ]);

      return {
        assessments: assessments.data || [],
        risks: risks.data || [],
        actionPlans: actionPlans.data || []
      };
    },
    enabled: !!companyId
  });

  const generateReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-nr01-report', {
        body: {
          companyId,
          periodStart,
          periodEnd,
          reportType: 'full_compliance'
        }
      });

      if (error) throw error;

      // Download the generated report
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = `NR01_Compliance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Conformidade NR-01</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={6} />
        </CardContent>
      </Card>
    );
  }

  const compliancePercentage = complianceData?.compliance_percentage || 0;
  const totalEmployees = metricsData?.assessments.length || 0;
  const highRiskFindings = complianceData?.high_risk_findings || 0;
  const actionPlansGenerated = complianceData?.action_plans_generated || 0;
  const actionPlansCompleted = complianceData?.action_plans_completed || 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Relatório de Conformidade NR-01
            </CardTitle>
            <CardDescription>
              Período: {new Date(periodStart).toLocaleDateString('pt-BR')} a {new Date(periodEnd).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          <Button onClick={generateReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Geral de Conformidade */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${compliancePercentage >= 80 ? 'text-green-500' : 'text-yellow-500'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Conformidade Geral</p>
                <p className="text-2xl font-bold">{compliancePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Funcionários Avaliados</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Riscos Altos Identificados</p>
                <p className="text-2xl font-bold">{highRiskFindings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Planos Concluídos</p>
                <p className="text-2xl font-bold">{actionPlansCompleted}/{actionPlansGenerated}</p>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Requisitos NR-01 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Status dos Requisitos NR-01</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>1. Identificação dos Perigos e Avaliação dos Riscos</span>
              <Badge variant={totalEmployees > 0 ? "default" : "destructive"}>
                {totalEmployees > 0 ? "Conforme" : "Pendente"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>2. Medidas de Prevenção</span>
              <Badge variant={actionPlansGenerated > 0 ? "default" : "destructive"}>
                {actionPlansGenerated > 0 ? "Conforme" : "Pendente"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>3. Monitoramento da Saúde</span>
              <Badge variant={compliancePercentage >= 80 ? "default" : "secondary"}>
                {compliancePercentage >= 80 ? "Conforme" : "Em Progresso"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>4. Informação e Treinamento</span>
              <Badge variant="secondary">Em Implementação</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ações Recomendadas */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ações Recomendadas</h3>
          <div className="space-y-2">
            {compliancePercentage < 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  • Aumentar a cobertura de avaliações para atingir conformidade mínima de 80%
                </p>
              </div>
            )}
            
            {highRiskFindings > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  • Priorizar implementação de planos de ação para {highRiskFindings} riscos altos identificados
                </p>
              </div>
            )}
            
            {actionPlansCompleted < actionPlansGenerated && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  • Acelerar execução de {actionPlansGenerated - actionPlansCompleted} planos de ação pendentes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Próximas Ações */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Próxima Auditoria:</h4>
          <p className="text-sm text-muted-foreground">
            {complianceData?.next_audit_date 
              ? `Agendada para ${new Date(complianceData.next_audit_date).toLocaleDateString('pt-BR')}`
              : 'Não agendada - recomenda-se agendar em até 90 dias'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
