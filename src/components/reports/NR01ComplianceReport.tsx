import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Shield, CheckCircle, AlertTriangle, TrendingUp, Brain, Users, Star, Scale, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Progress } from '@/components/ui/progress';
import { useFRPRTReportData } from '@/hooks/reports/useFRPRTReportData';

interface NR01ComplianceReportProps {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  selectedSector?: string;
  selectedRole?: string;
}

export function NR01ComplianceReport({ 
  companyId, 
  periodStart, 
  periodEnd,
  selectedSector,
  selectedRole
}: NR01ComplianceReportProps) {
  
  // Buscar dados FRPRT detalhados com filtros aplicados
  const { frprtData, isLoading, error } = useFRPRTReportData(
    companyId, 
    periodStart, 
    periodEnd,
    selectedSector,
    selectedRole
  );

  const generateReport = async () => {
    if (!frprtData) return;
    
    try {
      const reportBlob = await generatePDFReport();
      const url = URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_NR01_FRPRT_${frprtData.company?.name}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const generatePDFReport = async (): Promise<Blob> => {
    // Simulated PDF generation - in a real implementation, you would use a PDF library
    const reportContent = generateHTMLReport();
    return new Blob([reportContent], { type: 'text/html' });
  };

  const generateHTMLReport = (): string => {
    if (!frprtData) return '';
    
    const { filteredData, frprtMetrics, company, actionPlans } = frprtData;
    const { assessments } = filteredData;
    
    return `
      <html>
        <head>
          <title>Relatório NR-01 - Fatores de Risco Psicossociais</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; page-break-inside: avoid; }
            .metric-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
            .high-risk { background-color: #fee; border-color: #f00; }
            .medium-risk { background-color: #fff3cd; border-color: #ffc107; }
            .low-risk { background-color: #d4edda; border-color: #28a745; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO DE CONFORMIDADE NR-01</h1>
            <h2>Fatores de Risco Psicossociais Relacionados ao Trabalho (FRPRT)</h2>
            <h3>${company?.name}</h3>
            <p>Período: ${new Date(periodStart).toLocaleDateString('pt-BR')} a ${new Date(periodEnd).toLocaleDateString('pt-BR')}</p>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          ${generateFRPRTAnalysisHTML(frprtMetrics)}
          ${generateRecommendationsHTML(frprtMetrics)}
          ${generateActionPlansHTML(actionPlans)}
          ${generateComplianceStatusHTML(frprtMetrics)}
        </body>
      </html>
    `;
  };

  const calculateFRPRTMetrics = (assessments: any[], risks: any[]) => {
    const totalAssessments = assessments.length;
    const risksByCategory = {
      organizacao_trabalho: { low: 0, medium: 0, high: 0, critical: 0 },
      condicoes_psicossociais: { low: 0, medium: 0, high: 0, critical: 0 },
      relacoes_socioprofissionais: { low: 0, medium: 0, high: 0, critical: 0 },
      reconhecimento_crescimento: { low: 0, medium: 0, high: 0, critical: 0 },
      elo_trabalho_vida_social: { low: 0, medium: 0, high: 0, critical: 0 }
    };

    risks.forEach(risk => {
      const category = risk.category;
      const level = risk.exposure_level;
      
      if (risksByCategory[category]) {
        switch (level) {
          case 'baixo': risksByCategory[category].low++; break;
          case 'medio': risksByCategory[category].medium++; break;
          case 'alto': risksByCategory[category].high++; break;
          case 'critico': risksByCategory[category].critical++; break;
        }
      }
    });

    return {
      totalAssessments,
      risksByCategory,
      highRiskCategories: Object.entries(risksByCategory)
        .filter(([_, values]) => values.high > 0 || values.critical > 0)
        .map(([category]) => category),
      overallRiskLevel: calculateOverallRisk(risksByCategory)
    };
  };

  const calculateOverallRisk = (risksByCategory: any): string => {
    let totalCritical = 0;
    let totalHigh = 0;
    
    Object.values(risksByCategory).forEach((category: any) => {
      totalCritical += category.critical;
      totalHigh += category.high;
    });

    if (totalCritical > 0) return 'Crítico';
    if (totalHigh > 2) return 'Alto';
    if (totalHigh > 0) return 'Médio';
    return 'Baixo';
  };

  const generateFRPRTAnalysisHTML = (metrics: any): string => {
    const categories = [
      {
        key: 'organizacao_trabalho',
        name: 'FRPRT - ORGANIZAÇÃO DO TRABALHO',
        icon: '🏢',
        description: 'Demandas excessivas vs. recursos disponíveis, ritmo inadequado, sobrecarga'
      },
      {
        key: 'condicoes_psicossociais',
        name: 'FRPRT - CONDIÇÕES PSICOSSOCIAIS DO AMBIENTE',
        icon: '🌍',
        description: 'Ambiente físico que impacta o psicológico, privacidade, recursos tecnológicos'
      },
      {
        key: 'relacoes_socioprofissionais',
        name: 'FRPRT - RELAÇÕES SOCIOPROFISSIONAIS',
        icon: '👥',
        description: 'Estruturas hierárquicas, comunicação, práticas de gestão, suporte social'
      },
      {
        key: 'reconhecimento_crescimento',
        name: 'FRPRT - RECONHECIMENTO E CRESCIMENTO',
        icon: '🌟',
        description: 'Sistemas de feedback, planos de carreira, oportunidades de desenvolvimento'
      },
      {
        key: 'elo_trabalho_vida_social',
        name: 'FRPRT - ELO TRABALHO-VIDA SOCIAL',
        icon: '⚖️',
        description: 'Conflitos trabalho-vida, invasão da vida privada, flexibilidade organizacional'
      }
    ];

    return `
      <div class="section">
        <h2>ANÁLISE DAS CATEGORIAS FRPRT</h2>
        ${categories.map(category => {
          const data = metrics.risksByCategory[category.key];
          const total = data.low + data.medium + data.high + data.critical;
          const riskClass = data.critical > 0 ? 'high-risk' : data.high > 0 ? 'medium-risk' : 'low-risk';
          
          return `
            <div class="metric-card ${riskClass}">
              <h3>${category.icon} ${category.name}</h3>
              <p><strong>Agente de Risco:</strong> ${category.description}</p>
              <table>
                <tr>
                  <th>Nível de Exposição</th>
                  <th>Quantidade</th>
                  <th>Percentual</th>
                  <th>Ação Requerida</th>
                </tr>
                <tr>
                  <td>Baixo</td>
                  <td>${data.low}</td>
                  <td>${total > 0 ? ((data.low / total) * 100).toFixed(1) : 0}%</td>
                  <td>Monitoramento periódico</td>
                </tr>
                <tr>
                  <td>Médio</td>
                  <td>${data.medium}</td>
                  <td>${total > 0 ? ((data.medium / total) * 100).toFixed(1) : 0}%</td>
                  <td>Medidas preventivas em 60 dias</td>
                </tr>
                <tr>
                  <td>Alto</td>
                  <td>${data.high}</td>
                  <td>${total > 0 ? ((data.high / total) * 100).toFixed(1) : 0}%</td>
                  <td>Plano de ação em 30 dias</td>
                </tr>
                <tr class="high-risk">
                  <td>Crítico</td>
                  <td>${data.critical}</td>
                  <td>${total > 0 ? ((data.critical / total) * 100).toFixed(1) : 0}%</td>
                  <td>INTERVENÇÃO IMEDIATA OBRIGATÓRIA</td>
                </tr>
              </table>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  const generateRecommendationsHTML = (metrics: any): string => {
    return `
      <div class="section">
        <h2>MEDIDAS PREVENTIVAS E PLANOS DE AÇÃO OBRIGATÓRIOS</h2>
        <div class="metric-card">
          <h3>Classificação Geral de Risco: ${metrics.overallRiskLevel}</h3>
          
          <h4>Ações Imediatas Obrigatórias (NR-01):</h4>
          <ul>
            ${metrics.highRiskCategories.map(category => `
              <li>Implementar medidas de controle para ${category.replace('_', ' ').toUpperCase()}</li>
            `).join('')}
          </ul>
          
          <h4>Cronograma de Implementação:</h4>
          <table>
            <tr>
              <th>Tipo de Risco</th>
              <th>Prazo para Ação</th>
              <th>Próxima Avaliação</th>
              <th>Responsabilidade</th>
            </tr>
            <tr class="high-risk">
              <td>Exposição Crítica</td>
              <td>Ação imediata (1 dia)</td>
              <td>30 dias</td>
              <td>Alta direção + SESMT</td>
            </tr>
            <tr>
              <td>Exposição Alta</td>
              <td>30 dias</td>
              <td>90 dias</td>
              <td>Gestão direta + RH</td>
            </tr>
            <tr>
              <td>Exposição Média</td>
              <td>60 dias</td>
              <td>180 dias</td>
              <td>Supervisão + RH</td>
            </tr>
            <tr>
              <td>Exposição Baixa</td>
              <td>Monitoramento</td>
              <td>365 dias</td>
              <td>RH</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  };

  const generateActionPlansHTML = (actionPlans: any[]): string => {
    return `
      <div class="section">
        <h2>PLANOS DE AÇÃO IMPLEMENTADOS</h2>
        <div class="metric-card">
          <p><strong>Total de Planos:</strong> ${actionPlans.length}</p>
          <p><strong>Planos Ativos:</strong> ${actionPlans.filter(p => p.status === 'active').length}</p>
          <p><strong>Planos Concluídos:</strong> ${actionPlans.filter(p => p.status === 'completed').length}</p>
          
          ${actionPlans.length > 0 ? `
            <table>
              <tr>
                <th>Plano de Ação</th>
                <th>Status</th>
                <th>Prazo</th>
                <th>Nível de Risco</th>
              </tr>
              ${actionPlans.map(plan => `
                <tr>
                  <td>${plan.title}</td>
                  <td>${plan.status}</td>
                  <td>${plan.due_date ? new Date(plan.due_date).toLocaleDateString('pt-BR') : 'N/A'}</td>
                  <td>${plan.risk_level || 'N/A'}</td>
                </tr>
              `).join('')}
            </table>
          ` : '<p>Nenhum plano de ação identificado no período.</p>'}
        </div>
      </div>
    `;
  };

  const generateComplianceStatusHTML = (metrics: any): string => {
    const compliancePercentage = metrics.totalAssessments > 0 ? 
      ((metrics.totalAssessments - metrics.highRiskCategories.length) / metrics.totalAssessments * 100) : 0;
    
    return `
      <div class="section">
        <h2>STATUS DE CONFORMIDADE NR-01</h2>
        <div class="metric-card">
          <h3>Conformidade Geral: ${compliancePercentage.toFixed(1)}%</h3>
          
          <h4>Requisitos NR-01:</h4>
          <table>
            <tr>
              <th>Requisito</th>
              <th>Status</th>
              <th>Observações</th>
            </tr>
            <tr>
              <td>1. Identificação dos Perigos e Avaliação dos Riscos</td>
              <td>${metrics.totalAssessments > 0 ? 'CONFORME' : 'NÃO CONFORME'}</td>
              <td>${metrics.totalAssessments} avaliações realizadas</td>
            </tr>
            <tr>
              <td>2. Medidas de Prevenção</td>
              <td>${metrics.highRiskCategories.length === 0 ? 'CONFORME' : 'EM IMPLEMENTAÇÃO'}</td>
              <td>${metrics.highRiskCategories.length} categorias requerem ação</td>
            </tr>
            <tr>
              <td>3. Monitoramento da Saúde</td>
              <td>EM PROGRESSO</td>
              <td>Sistema de avaliação contínua implementado</td>
            </tr>
            <tr>
              <td>4. Informação e Treinamento</td>
              <td>EM IMPLEMENTAÇÃO</td>
              <td>Programa de conscientização sobre FRPRT</td>
            </tr>
          </table>
          
          <h4>Próximas Ações Obrigatórias:</h4>
          <ul>
            <li>Implementar medidas de controle para categorias de alto risco</li>
            <li>Reavaliação em 90 dias para exposições altas</li>
            <li>Monitoramento contínuo de efetividade das ações</li>
            <li>Documentação de todas as medidas implementadas</li>
          </ul>
        </div>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório NR-01 - FRPRT</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={8} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-muted-foreground">
            {error.message || 'Não foi possível carregar os dados do relatório'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!frprtData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Dados insuficientes</p>
          <p className="text-muted-foreground">
            Não há dados suficientes para gerar o relatório no período selecionado
          </p>
        </CardContent>
      </Card>
    );
  }

  const { filteredData, frprtMetrics, company, actionPlans } = frprtData;
  const { assessments } = filteredData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Relatório NR-01 - Fatores de Risco Psicossociais (FRPRT)
              </CardTitle>
              <CardDescription>
                {company?.name} | Período: {new Date(periodStart).toLocaleDateString('pt-BR')} a {new Date(periodEnd).toLocaleDateString('pt-BR')}
              </CardDescription>
            </div>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Gerar Relatório PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{frprtMetrics.totalAssessments}</div>
              <div className="text-sm text-muted-foreground">Avaliações Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{frprtMetrics.highRiskCategories.length}</div>
              <div className="text-sm text-muted-foreground">Categorias Alto Risco</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{actionPlans.filter(p => p.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Ações Concluídas</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                frprtMetrics.overallRiskLevel === 'Crítico' ? 'text-red-600' :
                frprtMetrics.overallRiskLevel === 'Alto' ? 'text-orange-600' :
                frprtMetrics.overallRiskLevel === 'Médio' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {frprtMetrics.overallRiskLevel}
              </div>
              <div className="text-sm text-muted-foreground">Risco Geral</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise FRPRT por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Análise FRPRT - Categorias Oficiais (conforme MTE)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              key: 'organizacao_trabalho',
              name: 'FRPRT - ORGANIZAÇÃO DO TRABALHO',
              icon: <Building className="h-5 w-5" />,
              description: 'Demandas excessivas vs. recursos disponíveis, ritmo e pressão temporal inadequados',
              color: 'blue'
            },
            {
              key: 'condicoes_psicossociais',
              name: 'FRPRT - CONDIÇÕES PSICOSSOCIAIS DO AMBIENTE',
              icon: <Brain className="h-5 w-5" />,
              description: 'Ambiente físico que impacta o psicológico, privacidade, recursos tecnológicos',
              color: 'green'
            },
            {
              key: 'relacoes_socioprofissionais',
              name: 'FRPRT - RELAÇÕES SOCIOPROFISSIONAIS',
              icon: <Users className="h-5 w-5" />,
              description: 'Estruturas hierárquicas, comunicação, práticas de gestão, suporte social',
              color: 'yellow'
            },
            {
              key: 'reconhecimento_crescimento',
              name: 'FRPRT - RECONHECIMENTO E CRESCIMENTO',
              icon: <Star className="h-5 w-5" />,
              description: 'Sistemas de feedback, planos de carreira, oportunidades de desenvolvimento',
              color: 'purple'
            },
            {
              key: 'elo_trabalho_vida_social',
              name: 'FRPRT - ELO TRABALHO-VIDA SOCIAL',
              icon: <Scale className="h-5 w-5" />,
              description: 'Conflitos trabalho-vida, invasão da vida privada, flexibilidade organizacional',
              color: 'red'
            }
          ].map(category => {
            const data = frprtMetrics.risksByCategory[category.key];
            const total = data.low + data.medium + data.high + data.critical;
            const riskLevel = data.critical > 0 ? 'Crítico' : data.high > 0 ? 'Alto' : data.medium > 0 ? 'Médio' : 'Baixo';
            
            return (
              <Card key={category.key} className={`border-l-4 ${
                data.critical > 0 ? 'border-l-red-500' :
                data.high > 0 ? 'border-l-orange-500' :
                data.medium > 0 ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant={data.critical > 0 || data.high > 0 ? "destructive" : "default"}>
                      {riskLevel}
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{data.low}</div>
                      <div className="text-xs text-muted-foreground">Baixo</div>
                      <div className="text-xs">{total > 0 ? ((data.low / total) * 100).toFixed(1) : 0}%</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{data.medium}</div>
                      <div className="text-xs text-muted-foreground">Médio</div>
                      <div className="text-xs">{total > 0 ? ((data.medium / total) * 100).toFixed(1) : 0}%</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{data.high}</div>
                      <div className="text-xs text-muted-foreground">Alto</div>
                      <div className="text-xs">{total > 0 ? ((data.high / total) * 100).toFixed(1) : 0}%</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{data.critical}</div>
                      <div className="text-xs text-muted-foreground">Crítico</div>
                      <div className="text-xs">{total > 0 ? ((data.critical / total) * 100).toFixed(1) : 0}%</div>
                    </div>
                  </div>
                  
                  {(data.high > 0 || data.critical > 0) && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-800 font-medium">
                        🚨 AÇÃO OBRIGATÓRIA: {data.critical > 0 ? 'Intervenção imediata (1 dia)' : 'Plano de ação em 30 dias'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Planos de Ação */}
      <Card>
        <CardHeader>
          <CardTitle>Planos de Ação Implementados</CardTitle>
        </CardHeader>
        <CardContent>
          {actionPlans.length > 0 ? (
            <div className="space-y-4">
              {actionPlans.map(plan => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">{plan.title}</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                      {plan.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Prazo: {plan.due_date ? new Date(plan.due_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhum plano de ação registrado</p>
              <p className="text-muted-foreground">
                Planos de ação são gerados automaticamente para riscos altos e críticos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status de Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Conformidade NR-01</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>1. Identificação dos Perigos e Avaliação dos Riscos</span>
              <Badge variant={frprtMetrics.totalAssessments > 0 ? "default" : "destructive"}>
                {frprtMetrics.totalAssessments > 0 ? "CONFORME" : "NÃO CONFORME"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>2. Medidas de Prevenção</span>
              <Badge variant={frprtMetrics.highRiskCategories.length === 0 ? "default" : "secondary"}>
                {frprtMetrics.highRiskCategories.length === 0 ? "CONFORME" : "EM IMPLEMENTAÇÃO"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>3. Monitoramento da Saúde</span>
              <Badge variant="secondary">EM PROGRESSO</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>4. Informação e Treinamento</span>
              <Badge variant="secondary">EM IMPLEMENTAÇÃO</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}