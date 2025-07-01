
import { DiscFactorType, DiscQuestion } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DiscQuestionFormProps {
  questions: DiscQuestion[];
  responses: Record<string, number>;
  onResponse: (questionId: string, value: number) => void;
  factorTitle: string;
}

export function DiscQuestionForm({ questions, responses, onResponse, factorTitle }: DiscQuestionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{factorTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border-b pb-4">
              <p className="mb-3 font-medium">{question.text}</p>
              <RadioGroup
                value={responses[question.id]?.toString() || "0"}
                onValueChange={(value) => onResponse(question.id, parseInt(value))}
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={`${question.id}-1`} />
                    <Label htmlFor={`${question.id}-1`}>Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id={`${question.id}-0`} />
                    <Label htmlFor={`${question.id}-0`}>Não</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
