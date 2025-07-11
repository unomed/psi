
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, AlertCircle } from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { toast } from "sonner";
import { FormErrorBoundary } from "@/components/ui/form-error-boundary";
import { EmployeeNativeLoginForm } from "./EmployeeNativeLoginForm";

// Detectar se react-hook-form está disponível e funcionando
const isReactHookFormAvailable = () => {
  try {
    // Verificar se podemos importar react-hook-form sem erro
    const { useForm } = require('react-hook-form');
    return typeof useForm === 'function';
  } catch (error) {
    console.warn('[EmployeeLoginForm] react-hook-form não disponível:', error);
    return false;
  }
};

interface EmployeeLoginFormProps {
  onLoginSuccess: (employeeData: any) => void;
  expectedEmployeeId?: string | null;
  assessmentToken?: string | null;
  templateId?: string;
  assessmentId?: string | null;
}

export function EmployeeLoginForm(props: EmployeeLoginFormProps) {
  const [useNativeForm, setUseNativeForm] = useState(false);

  useEffect(() => {
    // Verificar se devemos usar o formulário nativo
    if (!isReactHookFormAvailable()) {
      console.log('[EmployeeLoginForm] Usando formulário nativo devido a problemas com react-hook-form');
      setUseNativeForm(true);
    }
  }, []);

  // Se devemos usar o formulário nativo, renderizar diretamente
  if (useNativeForm) {
    return <EmployeeNativeLoginForm {...props} />;
  }

  // Tentar usar o formulário com react-hook-form dentro de um Error Boundary
  return (
    <FormErrorBoundary 
      fallbackComponent={<EmployeeNativeLoginForm {...props} />}
    >
      <OriginalEmployeeLoginForm {...props} />
    </FormErrorBoundary>
  );
}

// Componente original que usa react-hook-form (mantido para compatibilidade)
function OriginalEmployeeLoginForm({ 
  onLoginSuccess, 
  expectedEmployeeId,
  assessmentToken,
  templateId,
  assessmentId
}: EmployeeLoginFormProps) {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useEmployeeAuth();

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const getLastFourDigits = (cpfValue: string) => {
    const digits = cpfValue.replace(/\D/g, '');
    if (digits.length >= 4) {
      return digits.slice(-4);
    }
    return '';
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
    
    const lastFour = getLastFourDigits(formattedCpf);
    if (lastFour.length === 4) {
      setPassword(lastFour);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      
      if (cleanCpf.length !== 11) {
        setError("CPF deve conter 11 dígitos");
        return;
      }

      if (password.length !== 4) {
        setError("Senha deve conter 4 dígitos");
        return;
      }

      console.log(`[EmployeeLogin] Tentando login com CPF: ${cleanCpf.slice(0, 3)}***`);

      const result = await login(cleanCpf, password);
      
      if (result.success) {
        if (expectedEmployeeId && assessmentId) {
          toast.success("Login realizado com sucesso! Redirecionando para sua avaliação...");
        } else {
          toast.success("Login realizado com sucesso!");
        }
        
        onLoginSuccess(result);
      } else {
        console.error(`[EmployeeLogin] Erro no login:`, result.error);
        setError(result.error || "Erro no login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Erro interno. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Portal do Funcionário
        </CardTitle>
        <p className="text-center text-muted-foreground">
          {assessmentId ? 
            "Faça login para acessar sua avaliação" : 
            "Entre com seu CPF e senha"
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="pl-10"
                required
                maxLength={14}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="0000"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="pl-10"
                required
                maxLength={4}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {assessmentId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você foi direcionado para completar uma avaliação. Faça login para continuar.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
