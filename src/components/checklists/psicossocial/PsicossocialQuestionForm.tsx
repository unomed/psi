
import { PsicossocialQuestion } from "@/types/checklist";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PsicossocialQuestionFormProps {
  questions: PsicossocialQuestion[];
  responses: Record<string, number>;
  onResponse: (questionId: string, value: number) => void;
  category: string;
}

export function PsicossocialQuestionForm({ 
  questions, 
  responses, 
  onResponse, 
  category 
}: PsicossocialQuestionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border-b pb-4">
              <p className="mb-3 font-medium">{question.text}</p>
              <RadioGroup
                value={responses[question.id]?.toString() || "0"}
                onValueChange={(value) => onResponse(question.id, parseInt(value))}
                className="flex justify-between"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`${question.id}-1`} />
                  <Label htmlFor={`${question.id}-1`}>1 - Nunca/Quase nunca</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`${question.id}-2`} />
                  <Label htmlFor={`${question.id}-2`}>2 - Raramente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id={`${question.id}-3`} />
                  <Label htmlFor={`${question.id}-3`}>3 - Às vezes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id={`${question.id}-4`} />
                  <Label htmlFor={`${question.id}-4`}>4 - Frequentemente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id={`${question.id}-5`} />
                  <Label htmlFor={`${question.id}-5`}>5 - Sempre/Quase sempre</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
