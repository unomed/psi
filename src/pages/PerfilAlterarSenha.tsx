import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

export default function PerfilAlterarSenha() {
  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Alterar Senha</h1>
      <PasswordChangeForm />
    </div>
  );
}