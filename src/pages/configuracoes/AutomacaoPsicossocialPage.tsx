import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function AutomacaoPsicossocialPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Psicossocial</h1>
          <p className="text-muted-foreground">
            Configurações e monitoramento da automação de processos psicossociais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status da Automação</CardTitle>
          <CardDescription>
            Informações sobre o funcionamento da automação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Status da automação em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
