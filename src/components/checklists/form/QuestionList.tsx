
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiscFactorType, DiscQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  questions: Omit<DiscQuestion, "id">[];
  onRemoveQuestion: (index: number) => void;
}

export function QuestionList({ questions, onRemoveQuestion }: QuestionListProps) {
  const getFactorColor = (type: DiscFactorType) => {
    switch (type) {
      case DiscFactorType.D: return "bg-red-100 hover:bg-red-200";
      case DiscFactorType.I: return "bg-yellow-100 hover:bg-yellow-200";
      case DiscFactorType.S: return "bg-green-100 hover:bg-green-200";
      case DiscFactorType.C: return "bg-blue-100 hover:bg-blue-200";
    }
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Questões Adicionadas ({questions.length})</div>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <div 
            key={index} 
            className="flex items-start justify-between p-3 border rounded-lg"
          >
            <div className="flex-1 space-y-1">
              <p className="text-sm">{question.text}</p>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline"
                  className={cn("text-xs font-medium", getFactorColor(question.targetFactor))}
                >
                  {question.targetFactor}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Peso: {question.weight}
                </span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveQuestion(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
