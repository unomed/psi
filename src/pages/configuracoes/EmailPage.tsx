
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailServerSettings from "@/components/settings/EmailServerSettings";
import EmailTemplateSettings from "@/components/settings/EmailTemplateSettings";

export default function EmailPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações de Email</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o servidor de email e os modelos de emails utilizados no sistema.
        </p>
      </div>

      <Tabs defaultValue="server" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="server">Servidor de Email</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="server" className="space-y-4">
          <EmailServerSettings />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <EmailTemplateSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
