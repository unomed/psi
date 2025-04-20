
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssessmentListActions } from "./AssessmentListActions";
import { ScheduledAssessment } from "@/types";

interface AssessmentListTableProps {
  assessments: ScheduledAssessment[];
  type: "scheduled" | "completed";
  onShareClick: (assessment: ScheduledAssessment) => void;
  onShareAssessment?: (assessmentId: string) => Promise<void>;
}

export function AssessmentListTable({ 
  assessments,
  type,
  onShareClick,
  onShareAssessment
}: AssessmentListTableProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {type === "scheduled" 
          ? "Nenhuma avaliação agendada" 
          : "Nenhuma avaliação concluída"}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>
                {assessment.employees?.name || "Funcionário não encontrado"}
              </TableCell>
              <TableCell>
                {assessment.checklist_templates?.title || "Modelo não encontrado"}
              </TableCell>
              <TableCell>
                {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${assessment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${assessment.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                  ${assessment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {assessment.status === 'scheduled' ? 'Agendado' : ''}
                  {assessment.status === 'sent' ? 'Enviado' : ''}
                  {assessment.status === 'completed' ? 'Concluído' : ''}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <AssessmentListActions
                  assessment={assessment}
                  type={type}
                  onShareClick={onShareClick}
                  onShareAssessment={onShareAssessment}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
