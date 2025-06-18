
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, AlertCircle } from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

interface EmployeeLoginFormProps {
  onLoginSuccess: (employeeData: any) => void;
  expectedEmployeeId?: string | null;
  assessmentToken?: string | null;
  templateId?: string;
  assessmentId?: string | null;
}

export function EmployeeLoginForm({ 
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
  
  const { login } = useEmployeeAuthNative();

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

      console.log(`[EmployeeLoginForm] Tentando login com CPF: ${cleanCpf.slice(0, 3)}***`);

      const result = await login(cleanCpf, password);
      
      if (result.success) {
        console.log("Login realizado com sucesso!");
        onLoginSuccess(result);
      } else {
        console.error(`[EmployeeLoginForm] Erro no login:`, result.error);
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
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">
          Portal do Funcionário
        </CardTitle>
        <p className="text-muted-foreground">
          {assessmentId ? 
            "Faça login para acessar sua avaliação" : 
            "Digite seu CPF e senha para continuar"
          }
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium leading-none">
              CPF
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                maxLength={14}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Senha (últimos 4 dígitos do CPF)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                placeholder="0000"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                maxLength={4}
                disabled={isLoading}
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
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
