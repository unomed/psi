
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledAssessment, ChecklistTemplate } from "@/types";

interface AssessmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  scheduledAssessments: ScheduledAssessment[];
  templates: ChecklistTemplate[];
  onSendEmail: (assessmentId: string) => void;
  onShareAssessment: (assessmentId: string) => void;
  onScheduleAssessment: (employeeId: string, templateId: string) => void;
  onGenerateLink: (employeeId: string, templateId: string) => void;
}

export function AssessmentTabs({
  scheduledAssessments,
  onSendEmail,
  onShareAssessment,
  onScheduleAssessment,
  onGenerateLink,
}: AssessmentTabsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Avaliações</h2>
        
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
                  <TableCell>{assessment.employees?.name || "Não encontrado"}</TableCell>
                  <TableCell>{assessment.employees?.email || "Não informado"}</TableCell>
                  <TableCell>{assessment.employees?.phone || assessment.phoneNumber || "Não informado"}</TableCell>
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
                      {assessment.status === 'sent' && (
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
      </div>
    </Card>
  );
}
