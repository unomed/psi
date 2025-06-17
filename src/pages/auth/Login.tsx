
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { AdaptiveLoginForm } from '@/components/auth/login/AdaptiveLoginForm';
import { Shield } from 'lucide-react';

export default function Login() {
  return (
    <AuthLayout
      title="Acesso ao Sistema"
      description="Faça login para acessar o sistema de gestão"
      footer={
        <div className="w-full space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta de administrador?{" "}
              <Link to="/auth/register" className="underline text-primary">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Formulário de Login Adaptativo */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-lg mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Administrador do Sistema</h3>
            <p className="text-sm text-muted-foreground">
              Acesso completo ao sistema de gestão
            </p>
          </div>
          <AdaptiveLoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}
