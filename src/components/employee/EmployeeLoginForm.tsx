
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, AlertCircle } from "lucide-react";
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

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
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

      const result = await login(cleanCpf, password);
      
      if (result.success) {
        // Se há um token de avaliação e ID esperado, verificar se corresponde
        if (expectedEmployeeId && assessmentToken) {
          // Aqui você pode adicionar validação adicional se necessário
          toast.success("Login realizado com sucesso! Redirecionando para sua avaliação...");
        } else {
          toast.success("Login realizado com sucesso!");
        }
        
        onLoginSuccess(result);
      } else {
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
            <Label htmlFor="password">Senha (4 últimos dígitos do CPF)</Label>
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
            <p className="text-sm text-muted-foreground">
              Digite os 4 últimos dígitos do seu CPF
            </p>
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
      </CardContent>
    </Card>
  );
}
