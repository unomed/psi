
import { AssessmentItem } from "./AssessmentItem";

interface AssessmentItemsListProps {
  filteredAssessments: any[];
  userCompanies: any[];
  generatingLink: string | null;
  sendingEmail: string | null;
  onGenerateLink: (assessment: any) => void;
  onCopyLink: (linkUrl: string) => void;
  onSendEmail: (assessmentId: string) => void;
  onEditAssessment: (assessment: any) => void;
  onDeleteAssessment: (assessmentId: string) => Promise<boolean>;
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

  if (filteredAssessments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma avaliação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {filteredAssessments.map((assessment) => (
        <AssessmentItem
          key={assessment.id}
          assessment={assessment}
          userCompanies={userCompanies}
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
      ))}
    </div>
  );
}
