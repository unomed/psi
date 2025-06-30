import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChecklistQuestion, ScaleType } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface QuestionStepProps {
  question: ChecklistQuestion;
  questionIndex: number;
  totalQuestions: number;
  response: any;
  onResponseChange: (questionId: string, response: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  scaleType: ScaleType;
}

export function QuestionStep({ 
  question, 
  questionIndex, 
  totalQuestions, 
  response, 
  onResponseChange, 
  onNext, 
  onPrevious,
  scaleType = "likert5"
}: QuestionStepProps) {
  
  const renderResponseInput = () => {
    if (scaleType === "likert5") {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione uma opção de 1 (Discordo totalmente) a 5 (Concordo totalmente)
          </p>
          <RadioGroup
            value={response?.toString() || ""}
            onValueChange={(value) => onResponseChange(question.id, parseInt(value))}
            className="grid grid-cols-5 gap-4"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex flex-col items-center space-y-2">
                <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                <Label htmlFor={`${question.id}-${value}`} className="text-xs text-center">
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    if (scaleType === 'yes_no') {
      return (
        <RadioGroup 
          value={response?.toString() || ""}
          onValueChange={(value) => onResponseChange(question.id, parseInt(value))}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="no" />
            <Label htmlFor="no">Não</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="yes" />
            <Label htmlFor="yes">Sim</Label>
          </div>
        </RadioGroup>
      );
    }

    if (scaleType === 'percentage') {
      return (
        <RadioGroup 
          value={response?.toString() || ""}
          onValueChange={(value) => onResponseChange(question.id, parseInt(value))}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="disagree" />
            <Label htmlFor="disagree">Discordo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="neutral" />
            <Label htmlFor="neutral">Neutro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="agree" />
            <Label htmlFor="agree">Concordo</Label>
          </div>
        </RadioGroup>
      );
    }

    if (scaleType === 'custom') {
      return (
        <div className="space-y-2 bg-muted/50 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            Escala personalizada disponível em breve. Por padrão, usando escala Likert de 5 pontos.
          </p>
          <RadioGroup 
            value={response?.toString() || ""}
            onValueChange={(value) => onResponseChange(question.id, parseInt(value))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1c" />
              <Label htmlFor="r1c">Discordo totalmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2c" />
              <Label htmlFor="r2c">Discordo parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3c" />
              <Label htmlFor="r3c">Neutro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4c" />
              <Label htmlFor="r4c">Concordo parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5c" />
              <Label htmlFor="r5c">Concordo totalmente</Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={questionIndex} totalSteps={totalQuestions} />
      
      <p className="text-base">{question.text}</p>
      
      {renderResponseInput()}
    </div>
  );
}
