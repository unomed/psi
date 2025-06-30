
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle } from "lucide-react";

export default function AgendamentosSimplified() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie agendamentos de avaliações (Versão Simplificada)
          </p>
        </div>
        <Button disabled>
          <Calendar className="h-4 w-4 mr-2" />
          Novo Agendamento
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
            A página de Agendamentos está temporariamente simplificada enquanto realizamos melhorias no sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
