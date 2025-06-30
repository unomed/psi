
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Faturamento() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faturamento</h1>
          <p className="text-muted-foreground">
            Controle financeiro e faturamento
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestão Financeira</CardTitle>
          <CardDescription>
            Acompanhe receitas, despesas e faturamento
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
