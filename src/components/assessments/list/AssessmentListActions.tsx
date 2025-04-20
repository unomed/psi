
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail } from "lucide-react";
import { ScheduledAssessment } from "@/types";

interface AssessmentListActionsProps {
  assessment: ScheduledAssessment;
  type: "scheduled" | "completed";
  onShareClick: (assessment: ScheduledAssessment) => void;
  onShareAssessment?: (assessmentId: string) => Promise<void>;
}

export function AssessmentListActions({
  assessment,
  type,
  onShareClick,
  onShareAssessment
}: AssessmentListActionsProps) {
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
      <Button
        variant="ghost"
        size="icon"
        title="Enviar por email"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
}
