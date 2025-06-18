
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Lock } from "lucide-react";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

interface EmployeeNativeLoginFormProps {
  onLoginSuccess?: () => void;
}

export function EmployeeNativeLoginForm({ onLoginSuccess }: EmployeeNativeLoginFormProps) {
  const { login, loading } = useEmployeeAuthNative();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica máscara de CPF
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return value;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setError("CPF deve ter 11 dígitos");
      return;
    }

    if (password.length !== 4) {
      setError("Senha deve ter exatamente 4 dígitos");
      return;
    }

    try {
      const success = await login(cleanCpf, password);
      
      if (success) {
        console.log('[EmployeeNativeLoginForm] Login realizado com sucesso');
        
        // Chamar callback se fornecido
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Redirecionamento direto via window.location para garantir limpeza
        setTimeout(() => {
          window.location.href = '/portal';
        }, 100);
      } else {
        setError("CPF ou senha inválidos");
      }
    } catch (err) {
      console.error('[EmployeeNativeLoginForm] Erro no login:', err);
      setError("Erro ao realizar login. Tente novamente.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cpf" className="text-sm font-medium">
              CPF
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="pl-10"
                maxLength={14}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha (últimos 4 dígitos do CPF)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="0000"
                value={password}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPassword(value);
                  if (error) setError("");
                }}
                className="pl-10"
                maxLength={4}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Use seu CPF e os últimos 4 dígitos como senha</p>
        </div>
      </CardContent>
    </Card>
  );
}
