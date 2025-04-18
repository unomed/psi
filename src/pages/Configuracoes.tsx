
import { Settings, Mail, Bell, Shield, Calendar, Gauge, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationSettings from "@/components/settings/NotificationSettings";
import { AssessmentCriteriaSettings } from "@/components/settings/AssessmentCriteriaSettings";
import EmailTemplateSettings from "@/components/settings/EmailTemplateSettings";
import PeriodicitySettings from "@/components/settings/PeriodicitySettings";
import UserManagementSettings from "@/components/settings/UserManagementSettings";

export default function Configuracoes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Configurações do sistema, níveis de risco, periodicidade e permissões.
        </p>
      </div>
      
      <Tabs defaultValue="assessment-criteria" className="w-full">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-8">
          <TabsTrigger value="assessment-criteria">
            <Gauge className="mr-2 h-4 w-4" />
            Critérios de Avaliação
          </TabsTrigger>
          <TabsTrigger value="email-templates">
            <Mail className="mr-2 h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="recurrence">
            <Calendar className="mr-2 h-4 w-4" />
            Periodicidade
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 h-4 w-4" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment-criteria">
          <AssessmentCriteriaSettings />
        </TabsContent>
        
        <TabsContent value="email-templates">
          <EmailTemplateSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="recurrence">
          <PeriodicitySettings />
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Permissões</CardTitle>
              <CardDescription>
                Configure níveis de acesso e permissões de usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Configurações de Permissões</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Configure níveis de acesso e permissões para diferentes tipos de usuários.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagementSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
