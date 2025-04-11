
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DiscQuestion } from "@/types/checklist";
import { ProgressBar } from "./ProgressBar";
import { ScaleType } from "@/types/checklist";

interface QuestionStepProps {
  question: DiscQuestion;
  currentStep: number;
  totalSteps: number;
  selectedValue?: string;
  onResponseChange: (value: string) => void;
  scaleType?: ScaleType;
}

export function QuestionStep({ 
  question, 
  currentStep, 
  totalSteps,
  selectedValue,
  onResponseChange,
  scaleType = "likert5"
}: QuestionStepProps) {
  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <p className="text-base">{question.text}</p>
      
      {scaleType === "likert5" && (
        <RadioGroup 
          value={selectedValue}
          onValueChange={onResponseChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="r1" />
            <Label htmlFor="r1">Discordo totalmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="r2" />
            <Label htmlFor="r2">Discordo parcialmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="r3" />
            <Label htmlFor="r3">Neutro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="r4" />
            <Label htmlFor="r4">Concordo parcialmente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="r5" />
            <Label htmlFor="r5">Concordo totalmente</Label>
          </div>
        </RadioGroup>
      )}

      {scaleType === "yesno" && (
        <RadioGroup 
          value={selectedValue}
          onValueChange={onResponseChange}
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
      )}

      {scaleType === "agree3" && (
        <RadioGroup 
          value={selectedValue}
          onValueChange={onResponseChange}
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
      )}

      {scaleType === "custom" && (
        <div className="space-y-2 bg-muted/50 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            Escala personalizada disponível em breve. Por padrão, usando escala Likert de 5 pontos.
          </p>
          <RadioGroup 
            value={selectedValue}
            onValueChange={onResponseChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">Discordo totalmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">Discordo parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">Neutro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">Concordo parcialmente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">Concordo totalmente</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
