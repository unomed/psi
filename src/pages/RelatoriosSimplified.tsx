
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";

export default function RelatoriosSimplified() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize relatórios e análises (Versão Simplificada)
          </p>
        </div>
        <Button disabled>
          <FileText className="h-4 w-4 mr-2" />
          Gerar Relatório
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
            A página de Relatórios está temporariamente simplificada enquanto realizamos melhorias no sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
