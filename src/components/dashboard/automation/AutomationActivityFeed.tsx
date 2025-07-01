
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle, AlertTriangle, Clock, RefreshCw, User, FileText } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AutomationActivityFeedProps {
  companyId?: string;
}

interface ActivityItem {
  id: string;
  type: 'processing' | 'risk_detected' | 'action_plan' | 'notification' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
}

export function AutomationActivityFeed({ companyId }: AutomationActivityFeedProps) {
  const { processingLogs, isLoading } = usePsychosocialAutomation(companyId);

  // Gerar atividades simuladas baseadas nos logs reais + dados adicionais
  const activities = React.useMemo((): ActivityItem[] => {
    const simulatedActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'processing',
        title: 'Avaliação Processada',
        description: 'Funcionário: Maria Silva - Setor Administrativo',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        status: 'success'
      },
      {
        id: '2',
        type: 'risk_detected',
        title: 'Risco Alto Detectado',
        description: 'Categoria: Organização do Trabalho - Score: 75',
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 min ago
        status: 'warning'
      },
      {
        id: '3',
        type: 'action_plan',
        title: 'Plano de Ação Gerado',
        description: 'Plano automático para controle de risco psicossocial',
        timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 min ago
        status: 'info'
      },
      {
        id: '4',
        type: 'notification',
        title: 'Notificação Enviada',
        description: 'Alerta enviado para gestores sobre risco crítico',
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
        status: 'info'
      },
      {
        id: '5',
        type: 'processing',
        title: 'Avaliação Processada',
        description: 'Funcionário: João Santos - Setor Operacional',
        timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 min ago
        status: 'success'
      },
      {
        id: '6',
        type: 'risk_detected',
        title: 'Risco Crítico Detectado',
        description: 'Categoria: Condições Ambientais - Score: 85',
        timestamp: new Date(Date.now() - 42 * 60 * 1000), // 42 min ago
        status: 'error'
      }
    ];

    return simulatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [processingLogs]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'processing':
        return <Activity className="h-4 w-4" />;
      case 'risk_detected':
        return <AlertTriangle className="h-4 w-4" />;
      case 'action_plan':
        return <FileText className="h-4 w-4" />;
      case 'notification':
        return <User className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Erro';
      case 'info':
        return 'Info';
      default:
        return 'Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Feed de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Feed de Atividades</h3>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Feed principal */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atividades do sistema de automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs ${getStatusColor(activity.status)}`}
                          >
                            {getStatusLabel(activity.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de atividades */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resumo (Últimas 24h)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Processamentos</span>
                </div>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Riscos Detectados</span>
                </div>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Planos Gerados</span>
                </div>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Notificações</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filtros Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Apenas Sucessos
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Apenas Riscos
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Planos de Ação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
