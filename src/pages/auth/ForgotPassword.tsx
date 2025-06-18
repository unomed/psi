
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Recuperar Senha"
      description="Digite seu email para receber instruções de recuperação"
      footer={
        <div className="text-center">
          <Link to="/auth/login" className="text-sm text-primary hover:underline">
            Voltar ao login
          </Link>
        </div>
      }
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Esqueceu sua senha?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
            <Button className="w-full">
              Enviar instruções
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
