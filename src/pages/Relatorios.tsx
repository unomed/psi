
import { FileText } from "lucide-react";

export default function Relatorios() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground mt-2">
          Relatórios individuais e consolidados para comprovação legal do cumprimento da NR 01.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Relatórios</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Gere relatórios individuais e consolidados por setor/função, documentação para
            comprovação legal e análise de tendências dos riscos psicossociais.
          </p>
        </div>
      </div>
    </div>
  );
}
