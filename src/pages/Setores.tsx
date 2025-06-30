
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Setores() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Setores</h1>
          <p className="text-muted-foreground">
            Gerenciamento de setores organizacionais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Setores</CardTitle>
          <CardDescription>
            Gerencie os setores da organização
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
