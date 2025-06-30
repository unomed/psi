
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatosComparacao() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparação de Candidatos</h1>
          <p className="text-muted-foreground">
            Compare perfis comportamentais de candidatos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa</CardTitle>
          <CardDescription>
            Compare candidatos com base em competências comportamentais
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
