
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/login/LoginForm';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

export default function Login() {
  return (
    <AuthLayout
      title="Acesso ao Sistema"
      description="Escolha seu tipo de acesso abaixo"
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
        {/* Opção Administrador */}
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
          <LoginForm />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        {/* Opção Funcionário */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Funcionário</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Acesso para responder avaliações
            </p>
          </div>
          <Button 
            variant="outline" 
            asChild 
            className="w-full"
            size="lg"
          >
            <Link to="/auth/employee">
              <Users className="w-4 h-4 mr-2" />
              Acessar como Funcionário
            </Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
