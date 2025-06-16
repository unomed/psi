
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Filter,
  Send,
  Settings,
  Eye,
  Trash2,
  Play
} from "lucide-react";

interface ReportsGeneratorProps {
  companyId?: string;
}

export function ReportsGenerator({ companyId }: ReportsGeneratorProps) {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    type: 'automation_summary',
    dateRange: '30',
    includeCharts: true,
    includeMetrics: true,
    includeRecommendations: true,
    format: 'pdf',
    recipients: [] as string[]
  });

  const [scheduledReports] = useState([
    {
      id: '1',
      name: 'Relatório Semanal de Automação',
      type: 'automation_summary',
      schedule: 'weekly',
      lastGenerated: new Date(2024, 0, 15),
      nextGeneration: new Date(2024, 0, 22),
      status: 'active'
    },
    {
      id: '2',
      name: 'Análise Mensal de Performance',
      type: 'performance_analysis',
      schedule: 'monthly',
      lastGenerated: new Date(2024, 0, 1),
      nextGeneration: new Date(2024, 1, 1),
      status: 'active'
    }
  ]);

  const handleGenerateReport = async () => {
    console.log('Generating report with config:', reportConfig);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Relatório gerado com sucesso!');
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report:', reportConfig);
    alert('Relatório agendado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gerador de Relatórios</h3>
          <p className="text-sm text-muted-foreground">
            Crie relatórios personalizados e configure agendamentos automáticos
          </p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="scheduled">Relatórios Agendados</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configurar Novo Relatório
              </CardTitle>
              <CardDescription>
                Configure as opções do relatório que será gerado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Nome do Relatório</Label>
                    <Input
                      id="reportName"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Relatório Mensal de Automação"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select 
                      value={reportConfig.type} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automation_summary">Resumo de Automação</SelectItem>
                        <SelectItem value="performance_analysis">Análise de Performance</SelectItem>
                        <SelectItem value="efficiency_report">Relatório de Eficiência</SelectItem>
                        <SelectItem value="trend_analysis">Análise de Tendências</SelectItem>
                        <SelectItem value="compliance_report">Relatório de Conformidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Período</Label>
                    <Select 
                      value={reportConfig.dateRange} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, dateRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Últimos 7 dias</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="90">Últimos 90 dias</SelectItem>
                        <SelectItem value="365">Último ano</SelectItem>
                        <SelectItem value="custom">Período personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Formato</Label>
                    <Select 
                      value={reportConfig.format} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel (XLSX)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Incluir no Relatório</Label>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeCharts"
                          checked={reportConfig.includeCharts}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeCharts: !!checked }))
                          }
                        />
                        <Label htmlFor="includeCharts">Gráficos e Visualizações</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeMetrics"
                          checked={reportConfig.includeMetrics}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeMetrics: !!checked }))
                          }
                        />
                        <Label htmlFor="includeMetrics">Métricas Detalhadas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeRecommendations"
                          checked={reportConfig.includeRecommendations}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeRecommendations: !!checked }))
                          }
                        />
                        <Label htmlFor="includeRecommendations">Recomendações</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatários (opcional)</Label>
                    <Input
                      placeholder="email1@empresa.com, email2@empresa.com"
                      onChange={(e) => {
                        const emails = e.target.value.split(',').map(email => email.trim()).filter(Boolean);
                        setReportConfig(prev => ({ ...prev, recipients: emails }));
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separar emails por vírgula para envio automático
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button onClick={handleGenerateReport} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório Agora
                </Button>
                <Button variant="outline" onClick={handleScheduleReport} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Relatórios Agendados
              </CardTitle>
              <CardDescription>
                Gerencie relatórios com agendamento automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                          {report.status === 'active' ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Tipo: {report.type}</p>
                        <p>Frequência: {report.schedule === 'weekly' ? 'Semanal' : 'Mensal'}</p>
                        <p>Última geração: {report.lastGenerated.toLocaleDateString()}</p>
                        <p>Próxima geração: {report.nextGeneration.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Relatório</CardTitle>
              <CardDescription>
                Templates predefinidos para diferentes tipos de análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Executivo',
                    description: 'Resumo executivo com KPIs principais',
                    icon: '📊'
                  },
                  {
                    name: 'Técnico',
                    description: 'Análise técnica detalhada de performance',
                    icon: '⚙️'
                  },
                  {
                    name: 'Operacional',
                    description: 'Métricas operacionais e eficiência',
                    icon: '📈'
                  },
                  {
                    name: 'Compliance',
                    description: 'Relatório de conformidade e auditoria',
                    icon: '✅'
                  },
                  {
                    name: 'Tendências',
                    description: 'Análise de tendências e predições',
                    icon: '🔮'
                  },
                  {
                    name: 'Personalizado',
                    description: 'Template customizável',
                    icon: '🎨'
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
