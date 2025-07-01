
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface PsychosocialRiskErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function PsychosocialRiskErrorState({ error, onRetry }: PsychosocialRiskErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Erro ao Carregar Análises de Risco
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-red-700">
          <p className="font-medium">Não foi possível carregar os dados de risco psicossocial.</p>
          <p className="text-sm mt-1">
            {error.message || 'Erro desconhecido'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Recarregar Página
          </Button>
        </div>

        <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
          <strong>Detalhes técnicos:</strong><br/>
          Se o problema persistir, verifique se você tem permissão para acessar os dados da empresa
          ou contate o administrador do sistema.
        </div>
      </CardContent>
    </Card>
  );
}
