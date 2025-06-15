
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, ExternalLink, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';

export default function EmployeePortalPage() {
  const [copied, setCopied] = useState(false);
  const portalUrl = 'https://avaliacao.unomed.med.br';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleOpenPortal = () => {
    window.open(portalUrl, '_blank');
  };

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Portal do Funcionário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Acesse o portal onde os funcionários podem fazer login e responder suas avaliações pendentes.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="portal-url">Link do Portal</Label>
              <div className="flex gap-2">
                <Input
                  id="portal-url"
                  value={portalUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  title="Copiar link"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleOpenPortal} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Portal
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <strong>Instruções para funcionários:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Acessar o link do portal</li>
                <li>Fazer login com CPF e os 4 últimos dígitos do CPF</li>
                <li>Responder avaliações pendentes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
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
