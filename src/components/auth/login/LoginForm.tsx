
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LoginError } from './components/LoginError';
import { LoginInfo } from './components/LoginInfo';
import { LoginButton } from './components/LoginButton';
import { loginSchema, type LoginFormValues } from './schemas/loginSchema';

export function LoginForm() {
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginInfo, setLoginInfo] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Fallback de redirecionamento se o usuário já estiver logado
  useEffect(() => {
    if (user && !loading) {
      console.log('[LoginForm] Usuário já logado, redirecionando...');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setLoginError(null);
    setLoginInfo(null);
    
    try {
      await signIn(data.email, data.password);
      toast.success("Login realizado com sucesso!");
      
      // Fallback de redirecionamento caso o AuthContext não redirecione
      setTimeout(() => {
        if (window.location.pathname === '/auth/login') {
          console.log('[LoginForm] Executando fallback de redirecionamento');
          navigate('/dashboard', { replace: true });
        }
      }, 500);
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Erro ao realizar login. Verifique suas credenciais.";
      
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not found")) {
          errorMessage = "Email não encontrado. Verifique o email informado.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {loginError && <LoginError error={loginError} />}
        {loginInfo && <LoginInfo info={loginInfo} />}
        
        <LoginButton isLoading={isLoading} disabled={isLoading || loading} />
      </form>
    </Form>
  );
}
