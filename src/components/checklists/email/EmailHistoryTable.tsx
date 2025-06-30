
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, RefreshCw } from "lucide-react";
import { ScheduledAssessment } from "@/types";

export interface EmailHistoryTableProps {
  scheduledAssessments?: ScheduledAssessment[];
  assessments?: ScheduledAssessment[];
  onResendEmail?: (assessmentId: string) => void;
  onRefresh?: () => void;
}

export function EmailHistoryTable({ 
  scheduledAssessments = [], 
  assessments = [],
  onResendEmail, 
  onRefresh 
}: EmailHistoryTableProps) {
  const emailHistory = scheduledAssessments.length > 0 ? scheduledAssessments : assessments;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      scheduled: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: "Enviado",
      pending: "Pendente",
      failed: "Falhou",
      scheduled: "Agendado"
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Histórico de E-mails</h3>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Data Agendada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Envio</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailHistory.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">
                  {assessment.employees?.name || assessment.employee_name || "N/A"}
                </TableCell>
                <TableCell>
                  {assessment.checklist_templates?.title || "Template não encontrado"}
                </TableCell>
                <TableCell>
                  {assessment.scheduledDate ? format(assessment.scheduledDate, "dd/MM/yyyy HH:mm", { locale: ptBR }) : 
                   assessment.scheduled_date ? format(new Date(assessment.scheduled_date), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 
                   "Data não disponível"}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(assessment.status)}>
                    {getStatusLabel(assessment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {assessment.sentAt ? format(assessment.sentAt, "dd/MM/yyyy HH:mm", { locale: ptBR }) :
                   assessment.sent_at ? format(new Date(assessment.sent_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) :
                   "-"}
                </TableCell>
                <TableCell className="text-right">
                  {onResendEmail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResendEmail(assessment.id)}
                      title="Reenviar E-mail"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {emailHistory.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            Nenhum histórico de e-mail encontrado
          </div>
        )}
      </div>
    </div>
  );
}
