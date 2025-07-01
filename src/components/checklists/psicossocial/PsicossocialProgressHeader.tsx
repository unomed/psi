
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PsicossocialProgressHeaderProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

export function PsicossocialProgressHeader({
  title,
  currentQuestionIndex,
  totalQuestions,
  progress
}: PsicossocialProgressHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">
          {title}
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} de {totalQuestions}
        </span>
      </div>
      <Progress value={progress} className="w-full" />
    </CardHeader>
  );
}
