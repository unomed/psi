
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GestaoRiscos() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Riscos</h1>
          <p className="text-muted-foreground">
            Análise e gestão de riscos psicossociais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Riscos Psicossociais</CardTitle>
          <CardDescription>
            Identifique e gerencie riscos no ambiente de trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidade em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
