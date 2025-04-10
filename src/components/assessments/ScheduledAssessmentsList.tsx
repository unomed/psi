
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ClipboardList, Mail, Link } from "lucide-react";
import { toast } from "sonner";
import { ScheduledAssessment } from "@/types/checklist";
import { mockEmployees } from "./AssessmentSelectionForm";

interface ScheduledAssessmentsListProps {
  scheduledAssessments: ScheduledAssessment[];
  onSendEmail: (assessmentId: string) => void;
  templates: any[]; // Using any for simplicity, should be replaced with proper type
}

export function ScheduledAssessmentsList({ 
  scheduledAssessments,
  onSendEmail,
  templates
}: ScheduledAssessmentsListProps) {
  
  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee?.name || "Desconhecido";
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
          Agende avaliações para funcionários na aba "Nova Avaliação".
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Funcionário
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modelo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scheduledAssessments.map((assessment) => (
            <tr key={assessment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{getEmployeeName(assessment.employeeId)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{getTemplateName(assessment.templateId)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(assessment.status)}`}>
                  {getStatusLabel(assessment.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyLink(assessment.linkUrl)}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Copiar Link
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
