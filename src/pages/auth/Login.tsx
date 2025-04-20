
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/login/LoginForm';

export default function Login() {
  return (
    <AuthLayout
      title="Login"
      description="Faça login para acessar o sistema"
      footer={
        <div className="w-full text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/auth/register" className="underline text-primary">
              Cadastre-se
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
