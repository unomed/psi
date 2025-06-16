
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Copy, Link } from "lucide-react";
import { EditAssessmentButton } from "./EditAssessmentButton";
import { DeleteAssessmentButton } from "./DeleteAssessmentButton";

interface AssessmentItemProps {
  assessment: any;
  generatingLink: string | null;
  sendingEmail: string | null;
  onGenerateLink: (assessment: any) => void;
  onCopyLink: (linkUrl: string) => void;
  onSendEmail: (assessmentId: string) => void;
  onEditAssessment: (assessment: any) => void;
  onDeleteAssessment: (assessmentId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function AssessmentItem({
  assessment,
  generatingLink,
  sendingEmail,
  onGenerateLink,
  onCopyLink,
  onSendEmail,
  onEditAssessment,
  onDeleteAssessment,
  getStatusColor,
  getStatusLabel
}: AssessmentItemProps) {
  const employeeName = assessment.employee_name || 'Nome não disponível';

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium">{employeeName}</h4>
          <Badge className={getStatusColor(assessment.status)}>
            {getStatusLabel(assessment.status)}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Template: {assessment.checklist_templates?.title}</p>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Agendada para: {new Date(assessment.scheduled_date).toLocaleDateString('pt-BR')}
          </div>
          {assessment.recurrence_type !== "none" && (
            <p>Recorrência: {assessment.recurrence_type}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Botão para enviar email */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSendEmail(assessment.id)}
          disabled={sendingEmail === assessment.id || assessment.status === 'completed'}
          title="Enviar email com link de avaliação"
        >
          <Mail className="h-4 w-4 mr-1" />
          {sendingEmail === assessment.id ? 'Enviando...' : 'Enviar Email'}
        </Button>

        {/* Botão único para gerar/copiar link */}
        {assessment.link_url ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopyLink(assessment.link_url)}
            title="Copiar link da avaliação"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar Link
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateLink(assessment)}
            disabled={generatingLink === assessment.id || assessment.status === 'completed'}
            title="Gerar link da avaliação"
          >
            <Link className="h-4 w-4 mr-1" />
            {generatingLink === assessment.id ? 'Gerando...' : 'Gerar Link'}
          </Button>
        )}

        {/* Botão de editar */}
        <EditAssessmentButton
          onEdit={() => onEditAssessment(assessment)}
          assessmentStatus={assessment.status}
        />

        {/* Botão de excluir */}
        <DeleteAssessmentButton
          onDelete={() => onDeleteAssessment(assessment.id)}
          assessmentStatus={assessment.status}
        />
      </div>
    </div>
  );
}
