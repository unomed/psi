
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Filter,
  MoreVertical,
  Eye,
  Archive
} from "lucide-react";
import { ManagerNotification } from "@/types/automation";

interface NotificationCenterProps {
  notifications: ManagerNotification[];
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

export function NotificationCenter({ notifications, onMarkAsRead }: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'priority':
        return notification.priority === 'high' || notification.priority === 'critical';
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high_risk_alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'deadline_reminder':
        return <Clock className="h-4 w-4" />;
      case 'action_plan_required':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Central de Notificações</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie alertas e notificações automáticas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Não Lidas ({notifications.filter(n => !n.isRead).length})
          </TabsTrigger>
          <TabsTrigger value="priority">
            Prioridade ({notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)} text-white`}>
                              {getTypeIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={`${getPriorityColor(notification.priority)} text-white text-xs`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{notification.createdAt.toLocaleString()}</span>
                                <span>Tipo: {notification.relatedEntityType}</span>
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Ação Necessária
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
                    <p className="text-muted-foreground">
                      {filter === 'unread' 
                        ? 'Todas as notificações foram lidas' 
                        : 'Não há notificações no momento'}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
