
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/login/LoginForm';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export default function Login() {
  return (
    <AuthLayout
      title="Login"
      description="Faça login para acessar o sistema"
      footer={
        <div className="w-full space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/auth/register" className="underline text-primary">
                Cadastre-se
              </Link>
            </p>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Funcionário da Unomed?
              </p>
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link to="/auth/employee">
                  <Users className="w-4 h-4 mr-2" />
                  Acesso do Funcionário
                </Link>
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
