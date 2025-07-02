import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Bell, AlertTriangle, CheckCircle, Clock, Eye, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CompanyNotification {
  id: string;
  company_id: string;
  notification_type: string;
  trigger_event: string;
  recipient_email: string;
  subject_template: string;
  body_template: string;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
}

interface NotificationEmail {
  id: string;
  company_id: string;
  notification_type: string;
  recipient_email: string;
  subject: string;
  body: string;
  sent_at: string;
  status: string;
  assessment_response_id: string | null;
  risk_analysis_id: string | null;
}

export function NotificationManager() {
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<CompanyNotification | null>(null);
  const [newNotification, setNewNotification] = useState({
    notification_type: "",
    trigger_event: "",
    recipient_email: "",
    subject_template: "",
    body_template: ""
  });

  const queryClient = useQueryClient();

  // Buscar empresas
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, contact_email, email')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Buscar notificações configuradas
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ['company-notifications', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('company_notifications')
        .select('*')
        .eq('company_id', selectedCompany)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CompanyNotification[];
    },
    enabled: !!selectedCompany
  });

  // Buscar histórico de emails enviados
  const { data: emailHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['notification-emails', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('notification_emails')
        .select('*')
        .eq('company_id', selectedCompany)
        .order('sent_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as NotificationEmail[];
    },
    enabled: !!selectedCompany
  });

  // Mutation para criar/atualizar notificação
  const createNotificationMutation = useMutation({
    mutationFn: async (notification: any) => {
      if (editingNotification) {
        const { data, error } = await supabase
          .from('company_notifications')
          .update(notification)
          .eq('id', editingNotification.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('company_notifications')
          .insert({
            ...notification,
            company_id: selectedCompany
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-notifications'] });
      toast.success(editingNotification ? 'Notificação atualizada!' : 'Notificação criada!');
      setIsCreateDialogOpen(false);
      setEditingNotification(null);
      setNewNotification({
        notification_type: "",
        trigger_event: "",
        recipient_email: "",
        subject_template: "",
        body_template: ""
      });
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar notificação: ' + error.message);
    }
  });

  // Mutation para deletar notificação
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-notifications'] });
      toast.success('Notificação removida!');
    },
    onError: (error: any) => {
      toast.error('Erro ao remover notificação: ' + error.message);
    }
  });

  // Mutation para ativar/desativar notificação
  const toggleNotificationMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('company_notifications')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-notifications'] });
      toast.success('Status da notificação atualizado!');
    }
  });

  const triggerEvents = [
    { value: 'assessment_completed', label: 'Avaliação Concluída' },
    { value: 'high_risk_detected', label: 'Risco Alto/Crítico Detectado' },
    { value: 'action_plan_created', label: 'Plano de Ação Criado' },
    { value: 'action_plan_overdue', label: 'Plano de Ação em Atraso' }
  ];

  const notificationTypes = [
    { value: 'assessment_completed', label: 'Avaliação Concluída' },
    { value: 'high_risk_alert', label: 'Alerta de Risco Alto' },
    { value: 'action_plan_notification', label: 'Notificação de Plano de Ação' },
    { value: 'compliance_reminder', label: 'Lembrete de Compliance' }
  ];

  const handleCreateNotification = () => {
    createNotificationMutation.mutate(newNotification);
  };

  const handleEditNotification = (notification: CompanyNotification) => {
    setEditingNotification(notification);
    setNewNotification({
      notification_type: notification.notification_type,
      trigger_event: notification.trigger_event,
      recipient_email: notification.recipient_email,
      subject_template: notification.subject_template,
      body_template: notification.body_template
    });
    setIsCreateDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Gerenciamento de Notificações</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Selecione uma Empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa para gerenciar suas notificações automáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCompanyData = companies?.find(c => c.id === selectedCompany);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Notificações - {selectedCompanyData?.name}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingNotification(null);
                setNewNotification({
                  notification_type: "",
                  trigger_event: "",
                  recipient_email: selectedCompanyData?.contact_email || selectedCompanyData?.email || "",
                  subject_template: "",
                  body_template: ""
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Notificação
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNotification ? 'Editar Notificação' : 'Nova Notificação'}
                </DialogTitle>
                <DialogDescription>
                  Configure quando e como as notificações serão enviadas
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notification_type">Tipo de Notificação</Label>
                    <Select
                      value={newNotification.notification_type}
                      onValueChange={(value) => setNewNotification(prev => ({ ...prev, notification_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="trigger_event">Evento Gatilho</Label>
                    <Select
                      value={newNotification.trigger_event}
                      onValueChange={(value) => setNewNotification(prev => ({ ...prev, trigger_event: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerEvents.map((event) => (
                          <SelectItem key={event.value} value={event.value}>
                            {event.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="recipient_email">Email do Destinatário</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={newNotification.recipient_email}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, recipient_email: e.target.value }))}
                    placeholder="email@empresa.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject_template">Modelo do Assunto</Label>
                  <Input
                    id="subject_template"
                    value={newNotification.subject_template}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, subject_template: e.target.value }))}
                    placeholder="Ex: Nova Avaliação - {company_name}"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use: {'{company_name}'}, {'{employee_name}'}, {'{risk_level}'}, {'{contact_name}'}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="body_template">Modelo do Corpo do Email</Label>
                  <Textarea
                    id="body_template"
                    value={newNotification.body_template}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, body_template: e.target.value }))}
                    placeholder="Olá {contact_name}, uma nova avaliação foi concluída..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use: {'{company_name}'}, {'{employee_name}'}, {'{risk_level}'}, {'{contact_name}'}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateNotification}
                  disabled={createNotificationMutation.isPending}
                >
                  {editingNotification ? 'Atualizar' : 'Criar'} Notificação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notificações Configuradas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificações Configuradas
          </CardTitle>
          <CardDescription>
            Gerencie as notificações automáticas para esta empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingNotifications ? (
            <div className="text-center py-4">Carregando notificações...</div>
          ) : notifications?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação configurada</p>
              <p className="text-sm">Clique em "Nova Notificação" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={notification.is_active ? "default" : "secondary"}>
                        {notificationTypes.find(t => t.value === notification.notification_type)?.label || notification.notification_type}
                      </Badge>
                      <Badge variant="outline">
                        {triggerEvents.find(e => e.value === notification.trigger_event)?.label || notification.trigger_event}
                      </Badge>
                      {!notification.is_active && (
                        <Badge variant="destructive">Inativo</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Para:</strong> {notification.recipient_email}</p>
                      <p><strong>Assunto:</strong> {notification.subject_template}</p>
                      {notification.last_sent_at && (
                        <p><strong>Último envio:</strong> {formatDate(notification.last_sent_at)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={notification.is_active}
                      onCheckedChange={(checked) => 
                        toggleNotificationMutation.mutate({ 
                          id: notification.id, 
                          is_active: checked 
                        })
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNotification(notification)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotificationMutation.mutate(notification.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Emails Enviados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Histórico de Emails Enviados
          </CardTitle>
          <CardDescription>
            Últimos 50 emails enviados automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="text-center py-4">Carregando histórico...</div>
          ) : emailHistory?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum email enviado ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emailHistory?.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 border rounded-lg text-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {notificationTypes.find(t => t.value === email.notification_type)?.label || email.notification_type}
                      </Badge>
                      <Badge 
                        variant={email.status === 'sent' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {email.status === 'sent' ? 'Enviado' : 'Erro'}
                      </Badge>
                    </div>
                    <p><strong>Para:</strong> {email.recipient_email}</p>
                    <p><strong>Assunto:</strong> {email.subject}</p>
                    <p className="text-muted-foreground">{formatDate(email.sent_at)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {email.status === 'sent' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}