
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DiscQuestion } from "@/types/checklist";
import { ProgressBar } from "./ProgressBar";

interface QuestionStepProps {
  question: DiscQuestion;
  currentStep: number;
  totalSteps: number;
  selectedValue?: string;
  onResponseChange: (value: string) => void;
}

export function QuestionStep({ 
  question, 
  currentStep, 
  totalSteps,
  selectedValue,
  onResponseChange 
}: QuestionStepProps) {
  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <p className="text-base">{question.text}</p>
      
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
  );
}
