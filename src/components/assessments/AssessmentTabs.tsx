
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledAssessment } from "@/types";
import { useAssessmentEmployeeOperations } from "@/hooks/assessments/operations/useAssessmentEmployeeOperations";

interface AssessmentTabsProps {
  scheduledAssessments: ScheduledAssessment[];
  onSendEmail: (assessmentId: string) => void;
  onScheduleAssessment: (employeeId: string, templateId: string) => void;
  onGenerateLink: (employeeId: string, templateId: string) => void;
}

export function AssessmentTabs({
  scheduledAssessments,
  onSendEmail,
  onScheduleAssessment,
  onGenerateLink
}: AssessmentTabsProps) {
  const { getEmployeeEmail, getEmployeePhone, getSelectedEmployeeName } = useAssessmentEmployeeOperations();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Avaliações Agendadas</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledAssessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>{getSelectedEmployeeName(assessment.employeeId)}</TableCell>
                <TableCell>{getEmployeeEmail(assessment.employeeId)}</TableCell>
                <TableCell>{getEmployeePhone(assessment.employeeId) || assessment.phoneNumber}</TableCell>
                <TableCell>
                  {format(new Date(assessment.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${assessment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${assessment.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                    ${assessment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    {assessment.status === 'scheduled' ? 'Agendado' : 
                     assessment.status === 'sent' ? 'Enviado' : 
                     assessment.status === 'completed' ? 'Concluído' : 
                     assessment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {scheduledAssessments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma avaliação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
