import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PsicossocialQuestion } from "@/types";

interface PsicossocialQuestionCardProps {
  question: PsicossocialQuestion;
  response: string;
  onResponseChange: (questionId: string, value: string) => void;
}

export function PsicossocialQuestionCard({
  question,
  response,
  onResponseChange
}: PsicossocialQuestionCardProps) {
  const scaleOptions = [
    { value: "1", label: "1 - Nunca/Quase nunca" },
    { value: "2", label: "2 - Raramente" },
    { value: "3", label: "3 - Às vezes" },
    { value: "4", label: "4 - Frequentemente" },
    { value: "5", label: "5 - Sempre/Quase sempre" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.question_text || question.text}</CardTitle>
        <CardDescription>
          Indique com que frequência cada situação se aplica ao seu trabalho:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={response}
          onValueChange={(value) => onResponseChange(question.id, value)}
          className="grid gap-2"
        >
          {scaleOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`r${question.id}-${option.value}`} />
              <Label htmlFor={`r${question.id}-${option.value}`} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
