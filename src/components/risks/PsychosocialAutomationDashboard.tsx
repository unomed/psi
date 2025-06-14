
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Activity, 
  Bell, 
  BarChart3, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Users,
  FileText
} from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PsychosocialAutomationDashboardProps {
  companyId?: string;
}

export function PsychosocialAutomationDashboard({ companyId }: PsychosocialAutomationDashboardProps) {
  const {
    config,
    processingLogs,
    notifications,
    stats,
    isLoading,
    updateConfig,
    processAssessment,
    markNotificationSent
  } = usePsychosocialAutomation(companyId);

  const [configForm, setConfigForm] = useState({
    auto_process_enabled: config?.auto_process_enabled ?? true,
    auto_generate_action_plans: config?.auto_generate_action_plans ?? true,
    notification_enabled: config?.notification_enabled ?? true,
    notification_recipients: config?.notification_recipients?.join(', ') ?? '',
    processing_delay_minutes: config?.processing_delay_minutes ?? 5,
    high_risk_immediate_notification: config?.high_risk_immediate_notification ?? true,
    critical_risk_escalation: config?.critical_risk_escalation ?? true
  });

  const handleConfigSave = () => {
    updateConfig.mutate({
      ...configForm,
      notification_recipients: configForm.notification_recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Erro</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Crítica</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary">Média</Badge>;
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Processadas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_processed || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.successful_processed || 0} com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.critical_risk_found || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.high_risk_found || 0} riscos altos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Gerados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.action_plans_generated || 0}</div>
            <p className="text-xs text-muted-foreground">
              Planos de ação automáticos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.notifications_sent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Enviadas automaticamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Logs de Processamento
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Automação</CardTitle>
              <CardDescription>
                Configure como o sistema deve processar automaticamente as avaliações psicossociais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto_process">Processamento Automático</Label>
                    <Switch
                      id="auto_process"
                      checked={configForm.auto_process_enabled}
                      onCheckedChange={(checked) => 
                        setConfigForm(prev => ({ ...prev, auto_process_enabled: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Processar automaticamente quando uma avaliação for completada
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto_plans">Gerar Planos Automáticos</Label>
                    <Switch
                      id="auto_plans"
                      checked={configForm.auto_generate_action_plans}
                      onCheckedChange={(checked) => 
                        setConfigForm(prev => ({ ...prev, auto_generate_action_plans: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Criar planos de ação automáticos para riscos altos/críticos
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notificações</Label>
                    <Switch
                      id="notifications"
                      checked={configForm.notification_enabled}
                      onCheckedChange={(checked) => 
                        setConfigForm(prev => ({ ...prev, notification_enabled: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações para riscos identificados
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="immediate">Notificação Imediata</Label>
                    <Switch
                      id="immediate"
                      checked={configForm.high_risk_immediate_notification}
                      onCheckedChange={(checked) => 
                        setConfigForm(prev => ({ ...prev, high_risk_immediate_notification: checked }))
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notificar imediatamente para riscos altos
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Destinatários das Notificações</Label>
                  <Input
                    id="recipients"
                    placeholder="email1@empresa.com, email2@empresa.com"
                    value={configForm.notification_recipients}
                    onChange={(e) => 
                      setConfigForm(prev => ({ ...prev, notification_recipients: e.target.value }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Emails separados por vírgula que receberão as notificações
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delay">Delay de Processamento (minutos)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="0"
                    max="60"
                    value={configForm.processing_delay_minutes}
                    onChange={(e) => 
                      setConfigForm(prev => ({ ...prev, processing_delay_minutes: parseInt(e.target.value) || 0 }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Tempo de espera antes de iniciar o processamento automático
                  </p>
                </div>
              </div>

              <Button onClick={handleConfigSave} disabled={updateConfig.isPending}>
                {updateConfig.isPending ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Processamento</CardTitle>
              <CardDescription>
                Histórico de processamentos automáticos das avaliações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum log de processamento encontrado
                  </div>
                ) : (
                  processingLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Avaliação #{log.assessment_response_id.slice(-8)}</span>
                          {getStatusBadge(log.status)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Estágio: <span className="capitalize">{log.processing_stage}</span>
                      </div>

                      {log.error_message && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          <strong>Erro:</strong> {log.error_message}
                        </div>
                      )}

                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="text-xs bg-gray-50 p-2 rounded">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações Automáticas</CardTitle>
              <CardDescription>
                Notificações geradas automaticamente pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma notificação encontrada
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.sent_at ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Enviada
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markNotificationSent.mutate(notification.id)}
                            >
                              Marcar como Enviada
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Tipo: {notification.notification_type}</span>
                        <span>
                          Criada: {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                        {notification.sent_at && (
                          <span>
                            Enviada: {format(new Date(notification.sent_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        )}
                      </div>

                      {notification.recipients.length > 0 && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Destinatários: </span>
                          {notification.recipients.join(', ')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Detalhadas</CardTitle>
              <CardDescription>
                Análise detalhada do desempenho do processamento automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Processamento</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Processadas:</span>
                        <span className="font-medium">{stats.total_processed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sucessos:</span>
                        <span className="font-medium text-green-600">{stats.successful_processed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Falhas:</span>
                        <span className="font-medium text-red-600">{stats.failed_processed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tempo Médio:</span>
                        <span className="font-medium">
                          {stats.avg_processing_time_seconds ? 
                            `${stats.avg_processing_time_seconds.toFixed(2)}s` : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Riscos Identificados</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Riscos Altos:</span>
                        <span className="font-medium text-orange-600">{stats.high_risk_found}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Riscos Críticos:</span>
                        <span className="font-medium text-red-600">{stats.critical_risk_found}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Planos Gerados:</span>
                        <span className="font-medium">{stats.action_plans_generated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Notificações Enviadas:</span>
                        <span className="font-medium">{stats.notifications_sent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma estatística disponível
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
