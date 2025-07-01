
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/utils/dateFormat";
import { ScheduledAssessment } from "@/types";
import { AssessmentListActions } from "./AssessmentListActions";

interface AssessmentListTableProps {
  assessments: ScheduledAssessment[];
  type: "scheduled" | "completed";
  onShareClick: (assessment: ScheduledAssessment) => void;
  onShareAssessment?: (assessmentId: string) => Promise<void>;
  onDeleteAssessment?: (assessmentId: string) => Promise<void>;
  onSendEmail?: (assessmentId: string) => Promise<void>;
  isProcessing?: {[key: string]: boolean};
}

export function AssessmentListTable({
  assessments,
  type,
  onShareClick,
  onShareAssessment,
  onDeleteAssessment,
  onSendEmail,
  isProcessing = {}
}: AssessmentListTableProps) {
  const columns = [
    {
      accessorKey: "scheduledDate",
      header: "Data Agendada",
      cell: ({ row }: { row: any }) => {
        return <div>{formatDate(row.original.scheduledDate)}</div>;
      },
    },
    {
      accessorKey: "employees.name",
      header: "Funcionário",
      cell: ({ row }: { row: any }) => {
        return <div className="font-medium">{row.original.employees?.name || "N/A"}</div>;
      },
    },
    {
      accessorKey: "checklist_templates.title",
      header: "Template",
      cell: ({ row }: { row: any }) => {
        return <div>{row.original.checklist_templates?.title || "N/A"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        let statusLabel = "Desconhecido";
        let statusClass = "bg-gray-200";
        
        if (status === "scheduled") {
          statusLabel = "Agendado";
          statusClass = "bg-blue-100 text-blue-800";
        } else if (status === "sent") {
          statusLabel = "Enviado";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (status === "completed") {
          statusLabel = "Concluído";
          statusClass = "bg-green-100 text-green-800";
        }
        
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${statusClass}`}>
            {statusLabel}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }: { row: any }) => {
        const assessment = row.original;
        const isProcessingItem = isProcessing[assessment.id] || false;
        
        return (
          <AssessmentListActions
            assessment={assessment}
            type={type}
            onShareClick={onShareClick}
            onShareAssessment={onShareAssessment}
            onDeleteAssessment={isProcessingItem ? undefined : onDeleteAssessment}
            onSendEmail={isProcessingItem ? undefined : onSendEmail}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={assessments}
    />
  );
}
