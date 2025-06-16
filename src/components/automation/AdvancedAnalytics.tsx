
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw
} from "lucide-react";

interface AdvancedAnalyticsProps {
  companyId?: string;
}

export function AdvancedAnalytics({ companyId }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for analytics
  const performanceMetrics = [
    { name: "Jan", automationRuns: 45, successRate: 96 },
    { name: "Fev", automationRuns: 52, successRate: 94 },
    { name: "Mar", automationRuns: 48, successRate: 98 },
    { name: "Abr", automationRuns: 61, successRate: 95 },
    { name: "Mai", automationRuns: 55, successRate: 97 },
    { name: "Jun", automationRuns: 67, successRate: 99 }
  ];

  const triggerTypes = [
    { name: "Alto Risco", value: 35, color: "#ef4444" },
    { name: "Prazo Próximo", value: 28, color: "#f59e0b" },
    { name: "Avaliação Concluída", value: 25, color: "#10b981" },
    { name: "Plano Atrasado", value: 12, color: "#6366f1" }
  ];

  const efficiencyData = [
    { time: "00:00", avgResponseTime: 2.3, notifications: 15 },
    { time: "04:00", avgResponseTime: 1.8, notifications: 8 },
    { time: "08:00", avgResponseTime: 3.2, notifications: 32 },
    { time: "12:00", avgResponseTime: 2.7, notifications: 28 },
    { time: "16:00", avgResponseTime: 2.1, notifications: 22 },
    { time: "20:00", avgResponseTime: 1.9, notifications: 18 }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Análise Avançada</h3>
          <p className="text-sm text-muted-foreground">
            Insights detalhados sobre performance e eficiência das automações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">97.2%</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-blue-600">2.4s</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm">-0.3s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Execuções</p>
                <p className="text-2xl font-bold text-purple-600">1,248</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Economia Estimada</p>
                <p className="text-2xl font-bold text-orange-600">R$ 8.4K</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="efficiency">Eficiência</TabsTrigger>
          <TabsTrigger value="predictions">Predições</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance das Automações</CardTitle>
                <CardDescription>
                  Execuções e taxa de sucesso ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="automationRuns" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="successRate" 
                      stroke="#10b981" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status das Regras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Ativas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">24</span>
                        <Progress value={85} className="w-20" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Pausadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">3</span>
                        <Progress value={10} className="w-20" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Com Erro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">1</span>
                        <Progress value={5} className="w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-red-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Regra de Alto Risco</p>
                        <p className="text-xs text-muted-foreground">Falha na execução - 2 min atrás</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Timeout na Notificação</p>
                        <p className="text-xs text-muted-foreground">Tempo limite excedido - 15 min atrás</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sistema Normalizado</p>
                        <p className="text-xs text-muted-foreground">Todas as regras funcionando - 1h atrás</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="triggers">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Triggers</CardTitle>
                <CardDescription>
                  Tipos de eventos que mais acionam automações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={triggerTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        nameKey="name"
                      >
                        {triggerTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {triggerTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{type.value}%</span>
                          <Badge variant="secondary">{Math.round(type.value * 12.48)} execuções</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>Eficiência por Período</CardTitle>
              <CardDescription>
                Tempo de resposta e volume de notificações ao longo do dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="avgResponseTime" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Tempo Médio (s)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="notifications" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Notificações"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predições e Tendências</CardTitle>
                <CardDescription>
                  Análise preditiva baseada em dados históricos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Próxima Semana</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">+15%</p>
                      <p className="text-sm text-muted-foreground">Aumento previsto em automações</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Eficiência</h4>
                      </div>
                      <p className="text-2xl font-bold text-green-600">98.5%</p>
                      <p className="text-sm text-muted-foreground">Taxa de sucesso projetada</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <h4 className="font-medium">Tempo de Resposta</h4>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">1.8s</p>
                      <p className="text-sm text-muted-foreground">Tempo médio otimizado</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Recomendações do Sistema</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Otimização de Performance</p>
                          <p className="text-xs text-muted-foreground">
                            Considere aumentar o cache de templates para reduzir o tempo de resposta em 20%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Escalação Automática</p>
                          <p className="text-xs text-muted-foreground">
                            Configure regras de escalação para reduzir o tempo de resolução de incidentes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Manutenção Preventiva</p>
                          <p className="text-xs text-muted-foreground">
                            Agende manutenção das regras que apresentam maior taxa de erro
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
