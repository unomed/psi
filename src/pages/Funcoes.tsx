
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Funcoes() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Funções</h1>
          <p className="text-muted-foreground">
            Gerenciamento de funções e cargos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Funções</CardTitle>
          <CardDescription>
            Gerencie as funções disponíveis no sistema
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
