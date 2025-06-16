
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellRing, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User,
  Calendar,
  FileText
} from "lucide-react";
import { ManagerNotification } from "@/types/automation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationCenterProps {
  notifications: ManagerNotification[];
  onMarkAsRead: (notificationId: string) => void;
}

export function NotificationCenter({ notifications, onMarkAsRead }: NotificationCenterProps) {
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'high_risk_alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'action_plan_required':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'deadline_reminder':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'escalation':
        return <BellRing className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'high_risk_alert': 'Alerta de Alto Risco',
      'action_plan_required': 'Plano de Ação Necessário',
      'deadline_reminder': 'Lembrete de Prazo',
      'escalation': 'Escalação'
    };
    return labels[type] || type;
  };

  const NotificationCard = ({ notification, isUnread }: { 
    notification: ManagerNotification; 
    isUnread: boolean;
  }) => (
    <Card className={`${isUnread ? 'border-blue-200 bg-blue-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className={`font-medium ${isUnread ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`${getPriorityColor(notification.priority)} text-white text-xs`}
                >
                  {notification.priority}
                </Badge>
                {isUnread && (
                  <Badge variant="secondary" className="text-xs">
                    Nova
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{getTypeLabel(notification.type)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
                {notification.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Vence: {new Date(notification.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
              
              {notification.actionRequired && (
                <Badge variant="destructive" className="text-xs">
                  Ação Requerida
                </Badge>
              )}
            </div>
          </div>
          
          {isUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="shrink-0"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{unreadNotifications.length}</div>
                <div className="text-sm text-muted-foreground">Não Lidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">Alta Prioridade</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.actionRequired).length}
                </div>
                <div className="text-sm text-muted-foreground">Ação Requerida</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificações Não Lidas */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              Notificações Não Lidas ({unreadNotifications.length})
            </CardTitle>
            <CardDescription>
              Notificações que requerem sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    isUnread={true}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Notificações Lidas */}
      {readNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Histórico de Notificações ({readNotifications.length})
            </CardTitle>
            <CardDescription>
              Notificações anteriores já visualizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {readNotifications.slice(0, 10).map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    isUnread={false}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
            <p className="text-muted-foreground">
              As notificações automáticas aparecerão aqui quando geradas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
