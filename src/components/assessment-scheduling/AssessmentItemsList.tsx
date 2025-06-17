
import { AssessmentItem } from "./AssessmentItem";
import { Button } from "@/components/ui/button";

interface AssessmentItemsListProps {
  filteredAssessments: any[];
  userCompanies: any[];
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

export function AssessmentItemsList({
  filteredAssessments,
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
}: AssessmentItemsListProps) {
  if (!filteredAssessments || filteredAssessments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="space-y-2">
          <p>
            {userCompanies?.length === 0 ? 
              "Você não tem acesso a nenhuma empresa" :
              "Nenhuma avaliação encontrada"
            }
          </p>
          {userCompanies?.length === 0 && (
            <p className="text-sm">
              Entre em contato com o administrador para obter acesso às empresas.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAssessments.map(assessment => {
        // Validar dados do assessment antes de renderizar
        if (!assessment?.id || !assessment?.employee_name) {
          console.warn("Assessment com dados inválidos:", assessment);
          return null;
        }

        return (
          <AssessmentItem
            key={assessment.id}
            assessment={assessment}
            generatingLink={generatingLink}
            sendingEmail={sendingEmail}
            onGenerateLink={onGenerateLink}
            onCopyLink={onCopyLink}
            onSendEmail={onSendEmail}
            onEditAssessment={onEditAssessment}
            onDeleteAssessment={onDeleteAssessment}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        );
      }).filter(Boolean)}
    </div>
  );
}
