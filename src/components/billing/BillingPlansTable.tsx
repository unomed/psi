
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingPlansTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos de Cobrança</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Configuração de planos será implementada em breve
        </div>
      </CardContent>
    </Card>
  );
}
