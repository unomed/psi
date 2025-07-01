
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PermissoesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permissões</h1>
        <p className="text-muted-foreground mt-2">
          Configure as permissões e níveis de acesso do sistema.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Permissões</CardTitle>
          <CardDescription>
            Gerencie as permissões de acesso às diferentes funcionalidades do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta funcionalidade está em desenvolvimento. Em breve você poderá configurar permissões detalhadas para cada perfil de usuário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
