
import { Button } from "@/components/ui/button";
import { PlayCircle, Calendar, Link } from "lucide-react";

interface AssessmentActionButtonsProps {
  disabled: boolean;
  onStartAssessment: () => void;
  onScheduleAssessment: () => void;
  onGenerateLink: () => void;
}

export function AssessmentActionButtons({ 
  disabled, 
  onStartAssessment, 
  onScheduleAssessment, 
  onGenerateLink 
}: AssessmentActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button 
        className="flex-1"
        disabled={disabled}
        onClick={onStartAssessment}
      >
        <PlayCircle className="mr-2 h-4 w-4" />
        Iniciar Avaliação
      </Button>
      
      <Button 
        className="flex-1"
        variant="outline"
        disabled={disabled}
        onClick={onScheduleAssessment}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agendar Avaliação
      </Button>
      
      <Button 
        className="flex-1"
        variant="outline"
        disabled={disabled}
        onClick={onGenerateLink}
      >
        <Link className="mr-2 h-4 w-4" />
        Gerar Link
      </Button>
    </div>
  );
}
