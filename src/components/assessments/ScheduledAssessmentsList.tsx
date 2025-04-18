
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ClipboardList, Mail, Link, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ScheduledAssessment } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScheduledAssessmentsListProps {
  scheduledAssessments: ScheduledAssessment[];
  onSendEmail: (assessmentId: string) => void;
  onShareAssessment: (assessmentId: string) => void;
  templates: any[];
}

export function ScheduledAssessmentsList({ 
  scheduledAssessments,
  onSendEmail,
  onShareAssessment,
  templates
}: ScheduledAssessmentsListProps) {
  
  const getEmployeeName = (employeeId: string) => {
    return employeeId;
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.title || "Desconhecido";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled": return "Agendado";
      case "sent": return "Enviado";
      case "completed": return "Concluído";
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRecurrenceLabel = (recurrenceType?: string) => {
    switch (recurrenceType) {
      case "monthly": return "Mensal";
      case "semiannual": return "Semestral";
      case "annual": return "Anual";
      default: return "Única";
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  if (scheduledAssessments.length === 0) {
    return (
      <div className="text-center py-10">
        <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma avaliação agendada</h3>
        <p className="text-muted-foreground mt-2">
          Agende avaliações para funcionários clicando no botão "Nova Avaliação".
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Recorrência</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">
                {getEmployeeName(assessment.employeeId)}
              </TableCell>
              <TableCell>
                {getTemplateName(assessment.templateId)}
              </TableCell>
              <TableCell>
                {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {getRecurrenceLabel(assessment.recurrenceType)}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(assessment.status)}`}>
                  {getStatusLabel(assessment.status)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {assessment.status === "scheduled" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSendEmail(assessment.id)}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Enviar
                  </Button>
                )}
                {assessment.status === "sent" && (
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopyLink(assessment.linkUrl)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onShareAssessment(assessment.id)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
