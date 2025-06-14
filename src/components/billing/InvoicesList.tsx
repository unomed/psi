
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { useInvoices } from "@/hooks/billing/useInvoices";
import { formatCurrency } from "@/lib/utils";

export function InvoicesList() {
  const { invoices, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando faturas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      sent: "bg-blue-100 text-blue-800", 
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      sent: "Enviada",
      paid: "Paga",
      overdue: "Vencida", 
      cancelled: "Cancelada"
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Faturas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!invoices || invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma fatura encontrada</h3>
            <p>As faturas serão exibidas aqui conforme forem geradas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">Fatura #{invoice.invoice_number}</h4>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Empresa:</strong> {invoice.companies?.name}</p>
                    <p><strong>Período:</strong> {new Date(invoice.billing_period_start).toLocaleDateString('pt-BR')} - {new Date(invoice.billing_period_end).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Avaliações:</strong> {invoice.assessment_count}</p>
                    <p><strong>Valor:</strong> {formatCurrency(invoice.total_amount)}</p>
                    <p><strong>Vencimento:</strong> {new Date(invoice.due_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" title="Visualizar">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
