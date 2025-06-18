
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail, Trash2 } from "lucide-react";
import { ScheduledAssessment } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface AssessmentListActionsProps {
  assessment: ScheduledAssessment;
  type: "scheduled" | "completed";
  onShareClick: (assessment: ScheduledAssessment) => void;
  onShareAssessment?: (assessmentId: string) => Promise<void>;
  onDeleteAssessment?: (assessmentId: string) => Promise<void>;
  onSendEmail?: (assessmentId: string) => Promise<void>;
}

export function AssessmentListActions({
  assessment,
  type,
  onShareClick,
  onShareAssessment,
  onDeleteAssessment,
  onSendEmail
}: AssessmentListActionsProps) {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  
  return (
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
        onClick={() => onShareClick(assessment)}
        disabled={type === "completed" || !onShareAssessment || assessment.status === 'completed'}
      >
        <Link className="h-4 w-4" />
      </Button>
      
      {isAdmin && (
        <>
          <Button
            variant="ghost"
            size="icon"
            title="Enviar por email"
            onClick={() => onSendEmail && onSendEmail(assessment.id)}
            disabled={!onSendEmail || assessment.status === 'completed'}
          >
            <Mail className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            title="Excluir agendamento"
            onClick={() => onDeleteAssessment && onDeleteAssessment(assessment.id)}
            disabled={!onDeleteAssessment}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </>
      )}
    </div>
  );
}
