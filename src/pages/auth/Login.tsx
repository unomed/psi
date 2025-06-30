
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isAuthenticated } = useSimpleAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[Login] Usuário já autenticado, redirecionando...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[Login] Tentando fazer login...');
      await signIn(email, password);
      
      // O redirecionamento será feito automaticamente pelo useEffect
      // quando o estado de autenticação for atualizado
    } catch (error: any) {
      console.error('[Login] Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[450px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">PSI Safe</CardTitle>
          <CardDescription>
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full mt-4">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="text-sm text-muted-foreground text-center">
            Não tem uma conta?{' '}
            <Link to="/auth/register" className="text-primary underline">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
