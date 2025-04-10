
import { Settings, Mail, Bell, Shield, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailTemplateSettings from "@/components/settings/EmailTemplateSettings";

export default function Configuracoes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Configurações do sistema, níveis de risco, periodicidade e permissões.
        </p>
      </div>
      
      <Tabs defaultValue="email-templates" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-8">
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
        </TabsList>

        <TabsContent value="email-templates">
          <EmailTemplateSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure alertas e notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Configurações de Notificações</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Configure quando e como notificações devem ser enviadas para os usuários do sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recurrence">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Periodicidade</CardTitle>
              <CardDescription>
                Configure os períodos padrão para avaliações recorrentes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Configurações de Periodicidade</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Configure os períodos padrão para avaliações recorrentes e lembretes.
                </p>
              </div>
            </CardContent>
          </Card>
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
      </Tabs>
    </div>
  );
}
