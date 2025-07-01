
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PsicossocialQuestion } from "@/types/checklist";

interface PsicossocialQuestionCardProps {
  question: PsicossocialQuestion;
  response: number | undefined;
  onResponseChange: (value: string) => void;
}

export function PsicossocialQuestionCard({ 
  question, 
  response, 
  onResponseChange 
}: PsicossocialQuestionCardProps) {
  const responseOptions = [
    { value: 1, label: "Nunca" },
    { value: 2, label: "Raramente" },
    { value: 3, label: "Às vezes" },
    { value: 4, label: "Frequentemente" },
    { value: 5, label: "Sempre" }
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium text-lg mb-2">
          {question.text}
        </h3>
        {question.category && (
          <span className="text-sm text-muted-foreground">
            Categoria: {question.category}
          </span>
        )}
      </div>

      <RadioGroup 
        value={response?.toString() || ""} 
        onValueChange={onResponseChange}
        className="space-y-3"
      >
        {responseOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
            <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
