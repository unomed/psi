
import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPassword() {
  return (
    <AuthLayout
      title="Nova Senha"
      description="Digite sua nova senha"
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
          <CardTitle>Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
              />
            </div>
            <Button className="w-full">
              Redefinir Senha
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
