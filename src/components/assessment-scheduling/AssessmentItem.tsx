
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

  // Usar o nome do funcionário do objeto assessment
  const employeeName = assessment.employees?.name || assessment.employee_name || 'Funcionário não encontrado';

  return (
    <div className="w-full border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{employeeName}</h3>
            <Badge className={getStatusColor(assessment.status)}>
              {getStatusLabel(assessment.status)}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Checklist:</strong> {assessment.checklist_templates?.title || 'Template não encontrado'}</p>
            <p><strong>Empresa:</strong> {getCompanyName(assessment.company_id)}</p>
            <p><strong>Agendado para:</strong> {formatDate(assessment.scheduledDate || assessment.scheduled_date)}</p>
            {assessment.sentAt && (
              <p><strong>Enviado em:</strong> {formatDate(assessment.sentAt)}</p>
            )}
            {assessment.completedAt && (
              <p><strong>Concluído em:</strong> {formatDate(assessment.completedAt)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="default"
          onClick={() => onGenerateLink(assessment)}
          disabled={generatingLink === assessment.id}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Link className="h-4 w-4 mr-1" />
          {generatingLink === assessment.id ? "Gerando..." : "Gerar Link"}
        </Button>

        {assessment.linkUrl && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onCopyLink(assessment.linkUrl)}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar Link
          </Button>
        )}

        {isAdmin && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => onSendEmail(assessment.id)}
              disabled={sendingEmail === assessment.id || assessment.status === 'completed'}
              className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
              <Mail className="h-4 w-4 mr-1" />
              {sendingEmail === assessment.id ? "Enviando..." : "Enviar Email"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditAssessment(assessment)}
              disabled={assessment.status === 'completed'}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>

            <DeleteAssessmentButton
              onDelete={async () => {
                await onDeleteAssessment(assessment.id);
              }}
              assessmentStatus={assessment.status}
              employeeName={employeeName}
            />
          </>
        )}
      </div>
    </div>
  );
}
