
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, AlertCircle, Info } from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { toast } from "sonner";

interface EmployeeLoginFormProps {
  onLoginSuccess: (employeeData: any) => void;
  expectedEmployeeId?: string | null;
  assessmentToken?: string | null;
  templateId?: string;
}

export function EmployeeLoginForm({ 
  onLoginSuccess, 
  expectedEmployeeId,
  assessmentToken,
  templateId 
}: EmployeeLoginFormProps) {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useEmployeeAuth();
  const navigate = useNavigate();

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a formatação XXX.XXX.XXX-XX
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
    
    // Auto-preencher a senha com os 4 últimos dígitos se o CPF estiver completo
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
      // Remove formatação do CPF
      const cleanCpf = cpf.replace(/\D/g, '');
      
      if (cleanCpf.length !== 11) {
        setError("CPF deve conter 11 dígitos");
        return;
      }

      if (password.length !== 4) {
        setError("Senha deve conter 4 dígitos");
        return;
      }

      console.log(`[EmployeeLogin] Tentando login com CPF: ${cleanCpf.slice(0, 3)}***`, `Senha: ${password}`);

      const result = await login(cleanCpf, password);
      
      if (result.success) {
        // Se há um token de avaliação e ID esperado, verificar se corresponde
        if (expectedEmployeeId && assessmentToken) {
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

  const lastFourDigits = getLastFourDigits(cpf);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Portal do Funcionário
        </CardTitle>
        <p className="text-center text-muted-foreground">
          {assessmentToken ? 
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
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Digite os 4 últimos dígitos do seu CPF (sem pontuação)</p>
              {lastFourDigits && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Sua senha deve ser: <strong>{lastFourDigits}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {assessmentToken && (
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
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="text-sm"
          >
            Voltar ao início
          </Button>
        </div>

        {/* Exemplo de como usar */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
          <strong>Exemplo:</strong><br />
          CPF: 123.456.789-12<br />
          Senha: 9712 (últimos 4 dígitos)
        </div>
      </CardContent>
    </Card>
  );
}
