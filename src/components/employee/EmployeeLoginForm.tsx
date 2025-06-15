
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Lock } from "lucide-react";

interface EmployeeLoginFormProps {
  onLoginSuccess: (employeeData: any) => void;
}

export function EmployeeLoginForm({ onLoginSuccess }: EmployeeLoginFormProps) {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    
    // Auto-preencher senha com últimos 4 dígitos
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length >= 4) {
      const lastFour = numbers.slice(-4);
      setPassword(lastFour);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpf.trim()) {
      toast.error("Por favor, informe seu CPF");
      return;
    }

    if (!password.trim()) {
      toast.error("Por favor, informe sua senha");
      return;
    }

    setIsLoading(true);

    try {
      // Remover formatação do CPF
      const cleanCPF = cpf.replace(/\D/g, '');
      
      // Verificar se CPF tem 11 dígitos
      if (cleanCPF.length !== 11) {
        toast.error("CPF deve ter 11 dígitos");
        setIsLoading(false);
        return;
      }

      console.log("Tentando autenticar funcionário:", { cpf: cleanCPF, password });

      // Chamar função RPC do Supabase
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cleanCPF,
        p_password: password
      });

      console.log("Resposta da autenticação:", { data, error });

      if (error) {
        console.error("Erro na autenticação:", error);
        toast.error("Erro ao verificar credenciais. Tente novamente.");
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Funcionário não encontrado ou credenciais inválidas");
        setIsLoading(false);
        return;
      }

      const employeeData = data[0];
      
      if (!employeeData.is_valid) {
        toast.error("CPF ou senha incorretos");
        setIsLoading(false);
        return;
      }

      console.log("Login bem-sucedido:", employeeData);
      toast.success(`Bem-vindo(a), ${employeeData.employee_name}!`);
      onLoginSuccess(employeeData);

    } catch (error) {
      console.error("Erro inesperado na autenticação:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <User className="h-5 w-5" />
          Portal do Funcionário
        </CardTitle>
        <CardDescription>
          Faça login com seu CPF e os últimos 4 dígitos do seu CPF como senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCPFChange}
              maxLength={14}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha (últimos 4 dígitos do CPF)</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="0000"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={4}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>Sua senha são os últimos 4 dígitos do seu CPF.</p>
          <p>Por exemplo, se seu CPF for 123.456.789-01, sua senha é 9001.</p>
        </div>
      </CardContent>
    </Card>
  );
}
