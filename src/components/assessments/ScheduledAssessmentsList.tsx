
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ClipboardList, Mail, Link, Share2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ScheduledAssessment } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";

interface ScheduledAssessmentsListProps {
  scheduledAssessments: ScheduledAssessment[];
  onSendEmail: (assessmentId: string) => void;
  onShareAssessment: (assessmentId: string) => void;
  onScheduleAssessment: (employeeId: string, templateId: string) => void;
  onGenerateLink: (employeeId: string, templateId: string) => void;
  templates: any[];
}

export function ScheduledAssessmentsList({ 
  scheduledAssessments,
  onSendEmail,
  onShareAssessment,
  onScheduleAssessment,
  onGenerateLink,
  templates
}: ScheduledAssessmentsListProps) {
  const { employees } = useEmployees();
  
  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee?.name || "Funcionário não encontrado";
  };

  const getEmployeeEmail = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee?.email || "";
  };
  
  const getEmployeePhone = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee?.phone || "";
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.title || "Modelo não encontrado";
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

  const columns = [
    {
      accessorKey: "employee",
      header: "Funcionário",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return getEmployeeName(assessment.employeeId);
      }
    },
    {
      accessorKey: "template",
      header: "Modelo",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return getTemplateName(assessment.templateId);
      }
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return getEmployeeEmail(assessment.employeeId) || "Não informado";
      }
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return getEmployeePhone(assessment.employeeId) || "Não informado";
      }
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return format(new Date(assessment.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      }
    },
    {
      accessorKey: "recurrence",
      header: "Recorrência",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return getRecurrenceLabel(assessment.recurrenceType);
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(assessment.status)}`}>
            {getStatusLabel(assessment.status)}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: any) => {
        const assessment = row.original;
        return (
          <div className="flex gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              title="Agendar nova avaliação"
              onClick={() => onScheduleAssessment(assessment.employeeId, assessment.templateId)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Gerar link"
              onClick={() => onGenerateLink(assessment.employeeId, assessment.templateId)}
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Enviar por email"
              onClick={() => onSendEmail(assessment.id)}
            >
              <Mail className="h-4 w-4" />
            </Button>
            {assessment.status === "sent" && (
              <Button
                variant="ghost"
                size="icon"
                title="Compartilhar"
                onClick={() => onShareAssessment(assessment.id)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ];

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
    <DataTable
      columns={columns}
      data={scheduledAssessments}
    />
  );
}
