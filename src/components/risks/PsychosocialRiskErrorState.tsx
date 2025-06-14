
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          Erro ao Carregar Análise de Riscos Psicossociais
        </CardTitle>
        <CardDescription className="text-red-700">
          Ocorreu um erro ao carregar os dados de análise de riscos psicossociais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-red-600 bg-red-100 p-3 rounded border">
            <strong>Detalhes do erro:</strong>
            <br />
            {error.message || 'Erro desconhecido'}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onRetry}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
          
          <div className="text-sm text-red-600">
            <p>Se o problema persistir, verifique:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Sua conexão com a internet</li>
              <li>Se você tem permissões adequadas</li>
              <li>Se existem dados de avaliação disponíveis</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
