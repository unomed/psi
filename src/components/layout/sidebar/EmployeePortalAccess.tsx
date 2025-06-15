
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Users, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function EmployeePortalAccess() {
  const [copied, setCopied] = useState(false);
  const portalUrl = `${window.location.origin}/employee-portal`;

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
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
  );
}
