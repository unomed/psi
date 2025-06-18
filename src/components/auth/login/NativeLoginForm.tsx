
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, Mail, Lock } from 'lucide-react';

export function NativeLoginForm() {
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirecionamento estável usando useEffect
  useEffect(() => {
    if (user && !loading && shouldRedirect) {
      console.log('[NativeLoginForm] Executando redirecionamento seguro');
      const timeoutId = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100); // Pequeno delay para garantir estabilidade

      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, shouldRedirect, navigate]);

  // Verificação inicial de usuário logado
  useEffect(() => {
    if (user && !loading) {
      console.log('[NativeLoginForm] Usuário já logado, preparando redirecionamento');
      setShouldRedirect(true);
    }
  }, [user, loading]);

  const validateForm = () => {
    if (!formData.email) {
      setLoginError('Email é obrigatório');
      return false;
    }
    if (!formData.email.includes('@')) {
      setLoginError('Email deve ter formato válido');
      return false;
    }
    if (!formData.password) {
      setLoginError('Senha é obrigatória');
      return false;
    }
    if (formData.password.length < 6) {
      setLoginError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await signIn(formData.email, formData.password);
      
      // Mostrar notificação de sucesso
      try {
        if (window.showAdvancedToast) {
          window.showAdvancedToast('Login realizado com sucesso!', 'success');
        }
      } catch {
        console.log('Login realizado com sucesso!');
      }
      
      // Definir flag para redirecionamento
      setShouldRedirect(true);
      
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
      
      // Mostrar erro com sistema nativo
      try {
        if (window.showAdvancedToast) {
          window.showAdvancedToast(errorMessage, 'error');
        }
      } catch {
        console.error('Erro no login:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (loginError) setLoginError(null);
  };

  // Se deve redirecionar, mostrar loading
  if (shouldRedirect && user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChange={handleInputChange('email')}
            className="pl-10"
            required
            disabled={isLoading || loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange('password')}
            className="pl-10"
            required
            disabled={isLoading || loading}
          />
        </div>
      </div>
      
      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || loading}
      >
        {(isLoading || loading) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
