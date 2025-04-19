
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail } from "lucide-react";
import { ScheduledAssessment } from "@/types";

interface ScheduledAssessmentsListProps {
  assessments: ScheduledAssessment[];
  type: "scheduled" | "completed";
}

export function ScheduledAssessmentsList({ assessments, type }: ScheduledAssessmentsListProps) {
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
                  ${assessment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {assessment.status === 'scheduled' ? 'Agendado' : 'Concluído'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Agendar nova avaliação"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Gerar link"
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Enviar por email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
