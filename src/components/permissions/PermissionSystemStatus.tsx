
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { usePermissionValidation } from '@/hooks/permissions/usePermissionValidation';

export function PermissionSystemStatus() {
  const { validatePermissionSystem, userRole } = usePermissionValidation();
  const validation = validatePermissionSystem();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Status do Sistema de Permissões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Geral */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Status Geral:</span>
            <Badge 
              variant={validation.isValid ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {validation.isValid ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Sistema Válido
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Problemas Detectados
                </>
              )}
            </Badge>
          </div>

          {/* Papel do Usuário */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Papel do Usuário:</span>
            <Badge variant="outline">
              {userRole || 'Não definido'}
            </Badge>
          </div>

          {/* Erros */}
          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Erros Encontrados:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-600 ml-6">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Avisos */}
          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Avisos:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600 ml-6">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sucesso */}
          {validation.isValid && validation.errors.length === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Sistema de permissões funcionando corretamente</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
