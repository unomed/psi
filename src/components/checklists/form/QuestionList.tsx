import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Question } from "@/types";

interface QuestionListProps {
  questions: Question[];
  templateType: string;
  onQuestionsChange: (questions: Question[]) => void;
  onRemoveQuestion: (questionId: string) => void;
}

export function QuestionList({ 
  questions, 
  templateType,
  onQuestionsChange,
  onRemoveQuestion
}: QuestionListProps) {
  const [availableFactors, setAvailableFactors] = useState<string[]>([]);

  useEffect(() => {
    // Define available target factors based on template type
    switch (templateType) {
      case 'disc':
        setAvailableFactors(['D', 'I', 'S', 'C']);
        break;
      case 'psicossocial':
        setAvailableFactors(['stress', 'burnout', 'satisfaction']);
        break;
      case 'personal_life':
        setAvailableFactors(['finance', 'health', 'relationships']);
        break;
      case 'evaluation_360':
        setAvailableFactors(['leadership', 'teamwork', 'communication']);
        break;
      default:
        setAvailableFactors(['general']);
        break;
    }
  }, [templateType]);

  const handleQuestionTextChange = (questionId: string, value: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, question_text: value, text: value } : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const handleTargetFactorChange = (questionId: string, value: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId 
        ? { ...q, target_factor: value, targetFactor: value as any } // ✅ ADICIONAR type assertion
        : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const handleOrderNumberChange = (questionId: string, value: number) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, order_number: value } : q
    );
    onQuestionsChange(updatedQuestions);
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="border rounded-md p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`question-${question.id}`}>Questão</Label>
              <Textarea
                id={`question-${question.id}`}
                value={question.question_text || question.text || ""}
                onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                placeholder="Digite a pergunta"
              />
            </div>

            <div>
              <Label htmlFor={`target-factor-${question.id}`}>Fator Alvo</Label>
              <Select
                onValueChange={(value) => handleTargetFactorChange(question.id, value)}
                defaultValue={question.target_factor || question.targetFactor || "general"}
              >
                <SelectTrigger id={`target-factor-${question.id}`}>
                  <SelectValue placeholder="Selecione o fator" />
                </SelectTrigger>
                <SelectContent>
                  {availableFactors.map(factor => (
                    <SelectItem key={factor} value={factor}>{factor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`order-number-${question.id}`}>Ordem</Label>
              <Input
                type="number"
                id={`order-number-${question.id}`}
                value={question.order_number}
                onChange={(e) => handleOrderNumberChange(question.id, Number(e.target.value))}
                placeholder="Ordem da questão"
              />
            </div>
          </div>

          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onRemoveQuestion(question.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </Button>
        </div>
      ))}
    </div>
  );
}
