
import NotificationSettings from "@/components/settings/NotificationSettings";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
        <p className="text-muted-foreground mt-2">
          Configure as preferências de notificações do sistema.
        </p>
      </div>
      <NotificationSettings />
    </div>
  );
}
