
import UserManagementSettings from "@/components/settings/UserManagementSettings";

export default function UsuariosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os usuários e suas permissões no sistema.
        </p>
      </div>
      <UserManagementSettings />
    </div>
  );
}
