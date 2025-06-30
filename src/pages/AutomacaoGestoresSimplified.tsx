
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, AlertTriangle } from "lucide-react";

export default function AutomacaoGestoresSimplified() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Gestores</h1>
          <p className="text-muted-foreground">
            Configure automações para gestores (Versão Simplificada)
          </p>
        </div>
        <Button disabled>
          <Settings className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Página em Manutenção
          </CardTitle>
          <CardDescription>
            Esta página está sendo recuperada. Funcionalidade completa em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A página de Automação Gestores está temporariamente simplificada enquanto realizamos melhorias no sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
