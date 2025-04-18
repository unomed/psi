
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

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

        <Button className="w-full">Salvar Configurações</Button>
      </CardContent>
    </Card>
  );
}
