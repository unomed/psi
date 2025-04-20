
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DiscFactorType } from "@/types";
import { toast } from "sonner";

interface QuestionFormProps {
  onAddQuestion: (question: {
    text: string;
    targetFactor: DiscFactorType;
    weight: number;
  }) => void;
}

export function QuestionForm({ onAddQuestion }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [targetFactor, setTargetFactor] = useState<DiscFactorType>(DiscFactorType.D);
  const [weight, setWeight] = useState(1);

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      toast.error("O texto da questão não pode estar vazio");
      return;
    }

    onAddQuestion({
      text: questionText,
      targetFactor,
      weight,
    });

    // Reset form after adding
    setQuestionText("");
    setTargetFactor(DiscFactorType.D);
    setWeight(1);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="question-text">Texto da Questão</Label>
              <Textarea 
                id="question-text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ex: Prefiro tomar decisões rápidas e assumir riscos"
              />
            </div>
            <div>
              <Label htmlFor="target-factor">Fator Alvo</Label>
              <Select 
                value={targetFactor} 
                onValueChange={(val) => setTargetFactor(val as DiscFactorType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscFactorType.D}>D - Dominância</SelectItem>
                  <SelectItem value={DiscFactorType.I}>I - Influência</SelectItem>
                  <SelectItem value={DiscFactorType.S}>S - Estabilidade</SelectItem>
                  <SelectItem value={DiscFactorType.C}>C - Conformidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight">Peso</Label>
              <Select 
                value={weight.toString()} 
                onValueChange={(val) => setWeight(parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Peso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Baixo</SelectItem>
                  <SelectItem value="2">2 - Médio</SelectItem>
                  <SelectItem value="3">3 - Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddQuestion}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Questão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
