import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotificationSettings } from "@/hooks/settings/useNotificationSettings";

export default function NotificationSettings() {
  const { settings, isLoading, updateSettings } = useNotificationSettings();
  const [emailNotifications, setEmailNotifications] = useState(settings?.email_notifications ?? true);
  const [systemNotifications, setSystemNotifications] = useState(settings?.system_notifications ?? true);
  const [riskAlerts, setRiskAlerts] = useState(settings?.risk_alerts ?? true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(settings?.deadline_alerts ?? true);

  const handleSave = () => {
    updateSettings({
      email_notifications: emailNotifications,
      system_notifications: systemNotifications,
      risk_alerts: riskAlerts,
      deadline_alerts: deadlineAlerts
    });
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

        <Button onClick={handleSave} className="w-full">Salvar Configurações</Button>
      </CardContent>
    </Card>
  );
}
