
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/hooks/settings/useNotificationSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function NotificationSettings() {
  const { settings, isLoading, updateSettings } = useNotificationSettings();
  const [emailNotifications, setEmailNotifications] = useState(settings?.email_notifications ?? true);
  const [systemNotifications, setSystemNotifications] = useState(settings?.system_notifications ?? true);
  const [riskAlerts, setRiskAlerts] = useState(settings?.risk_alerts ?? true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(settings?.deadline_alerts ?? true);
  const [testingNotifications, setTestingNotifications] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmailNotifications(settings.email_notifications);
      setSystemNotifications(settings.system_notifications);
      setRiskAlerts(settings.risk_alerts);
      setDeadlineAlerts(settings.deadline_alerts);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      emailNotifications,
      systemNotifications,
      riskAlerts,
      deadlineAlerts
    });
  };

  const handleTestNotifications = async () => {
    setTestingNotifications(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: { test: true }
      });

      if (error) {
        throw error;
      }

      toast.success('Teste de notificações executado com sucesso!');
      console.log('Resultado do teste:', data);
    } catch (error) {
      console.error('Erro no teste de notificações:', error);
      toast.error('Erro ao executar teste de notificações');
    } finally {
      setTestingNotifications(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
        <CardDescription>
          Configure quando e como as notificações devem ser enviadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Notificações por Email</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="system-notifications">Notificações no Sistema</Label>
          <Switch
            id="system-notifications"
            checked={systemNotifications}
            onCheckedChange={setSystemNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="risk-alerts">Alertas de Risco Alto</Label>
          <Switch
            id="risk-alerts"
            checked={riskAlerts}
            onCheckedChange={setRiskAlerts}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="deadline-alerts">Alertas de Prazos</Label>
          <Switch
            id="deadline-alerts"
            checked={deadlineAlerts}
            onCheckedChange={setDeadlineAlerts}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            Salvar Configurações
          </Button>
          <Button 
            onClick={handleTestNotifications}
            variant="outline"
            disabled={testingNotifications || !emailNotifications}
            className="flex-1"
          >
            {testingNotifications ? 'Testando...' : 'Testar Notificações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
