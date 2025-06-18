
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <>
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> As orientações abaixo são apenas informativas. 
          Sempre consulte um médico para diagnóstico e tratamento adequados.
        </AlertDescription>
      </Alert>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Aviso Médico Importante</h4>
              <p className="text-sm text-orange-800">
                As informações apresentadas são de caráter educativo e não substituem 
                a consulta médica. Em caso de sintomas persistentes ou preocupantes, 
                procure imediatamente um profissional de saúde qualificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
