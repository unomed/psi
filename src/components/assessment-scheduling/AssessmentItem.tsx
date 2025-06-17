
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail, Edit, Copy } from "lucide-react";
import { DeleteAssessmentButton } from "./DeleteAssessmentButton";
import { useAuth } from "@/contexts/AuthContext";

interface AssessmentItemProps {
  assessment: any;
  userCompanies: any[];
  generatingLink: string | null;
  sendingEmail: string | null;
  onGenerateLink: (assessment: any) => void;
  onCopyLink: (linkUrl: string) => void;
  onSendEmail: (assessmentId: string) => void;
  onEditAssessment: (assessment: any) => void;
  onDeleteAssessment: (assessmentId: string) => Promise<void>;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function AssessmentItem({
  assessment,
  userCompanies,
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
  const { userRole } = useAuth();
  
  const getCompanyName = (companyId: string) => {
    const company = userCompanies.find(uc => uc.companyId === companyId);
    return company?.company?.name || 'Empresa não encontrada';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{assessment.employee_name}</h3>
            <Badge className={getStatusColor(assessment.status)}>
              {getStatusLabel(assessment.status)}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Checklist:</strong> {assessment.checklist_templates?.title || 'Template não encontrado'}</p>
            <p><strong>Empresa:</strong> {getCompanyName(assessment.company_id)}</p>
            <p><strong>Agendado para:</strong> {formatDate(assessment.scheduled_date)}</p>
            {assessment.sent_at && (
              <p><strong>Enviado em:</strong> {formatDate(assessment.sent_at)}</p>
            )}
            {assessment.completed_at && (
              <p><strong>Concluído em:</strong> {formatDate(assessment.completed_at)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGenerateLink(assessment)}
          disabled={generatingLink === assessment.id}
        >
          <Link className="h-4 w-4 mr-1" />
          {generatingLink === assessment.id ? "Gerando..." : "Gerar Link"}
        </Button>

        {assessment.link_url && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopyLink(assessment.link_url)}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar Link
          </Button>
        )}

        {isAdmin && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSendEmail(assessment.id)}
              disabled={sendingEmail === assessment.id || assessment.status === 'completed'}
            >
              <Mail className="h-4 w-4 mr-1" />
              {sendingEmail === assessment.id ? "Enviando..." : "Enviar Email"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditAssessment(assessment)}
              disabled={assessment.status === 'completed'}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>

            <DeleteAssessmentButton
              onDelete={() => onDeleteAssessment(assessment.id)}
              assessmentStatus={assessment.status}
              employeeName={assessment.employee_name}
            />
          </>
        )}
      </div>
    </div>
  );
}
