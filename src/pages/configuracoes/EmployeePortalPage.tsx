
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeePortalAccess } from '@/components/layout/sidebar/EmployeePortalAccess';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EmployeePortalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/configuracoes/permissoes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Portal do Funcionário</h1>
          <p className="text-muted-foreground">
            Gerencie o acesso dos funcionários ao portal de avaliações
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          O Portal do Funcionário é uma área separada onde os funcionários podem fazer login e responder suas avaliações pendentes. 
          Esta página permite que administradores acessem e compartilhem o link do portal.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeePortalAccess />
        
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">1. Acesso do Funcionário</h4>
                <p className="text-sm text-muted-foreground">
                  Funcionários acessam o portal usando seu CPF e os 4 últimos dígitos como senha.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">2. Avaliações Pendentes</h4>
                <p className="text-sm text-muted-foreground">
                  No portal, eles visualizam todas as avaliações agendadas e podem respondê-las.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">3. Acompanhamento de Humor</h4>
                <p className="text-sm text-muted-foreground">
                  Funcionários também podem registrar seu humor diário no portal.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link to="/agendamentos">
                  Gerenciar Agendamentos de Avaliações
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
