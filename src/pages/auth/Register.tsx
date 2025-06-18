import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password || !companyName) {
      toast.error('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      const signUpResult = await signUp({
        email: email,
        password: password,
        options: {
          data: {
            companyName: companyName,
            role: role,
          },
        },
      });

      if (signUpResult.error) {
        toast.error(`Erro ao registrar: ${signUpResult.error.message}`);
      } else {
        toast.success('Registro realizado com sucesso! Verifique seu email para confirmar.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(`Erro ao registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Criar uma conta</CardTitle>
          <CardDescription>
            Insira seu email e senha para registrar-se
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Nome da Empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Perfil</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="evaluator">Avaliador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button disabled={isLoading} type="submit" className="w-full mt-4">
              {isLoading ? 'Carregando...' : 'Criar conta'}
            </Button>
          </form>
          <div className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
