
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { ChecklistQuestion, ScaleType } from "@/types";

interface CategoryQuestionGroupProps {
  category: string;
  questions: ChecklistQuestion[];
  onQuestionsChange: (questions: ChecklistQuestion[]) => void;
  onCategoryChange: (oldCategory: string, newCategory: string) => void;
  onRemoveCategory: (category: string) => void;
  scaleType: ScaleType;
}

export function CategoryQuestionGroup({
  category,
  questions,
  onQuestionsChange,
  onCategoryChange,
  onRemoveCategory,
  scaleType
}: CategoryQuestionGroupProps) {
  const [newQuestionText, setNewQuestionText] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState(category);

  const addQuestion = () => {
    if (newQuestionText.trim()) {
      const newQuestion: ChecklistQuestion = {
        id: `temp-${Date.now()}`,
        template_id: "",
        question_text: newQuestionText.trim(),
        text: newQuestionText.trim(),
        order_number: questions.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      onQuestionsChange([...questions, newQuestion]);
      setNewQuestionText("");
    }
  };

  const updateQuestion = (index: number, field: keyof ChecklistQuestion, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
      updated_at: new Date().toISOString()
    };
    onQuestionsChange(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions);
  };

  const handleCategoryNameChange = () => {
    if (categoryName.trim() && categoryName !== category) {
      onCategoryChange(category, categoryName.trim());
    }
    setEditingCategory(false);
  };

  const getScaleDescription = () => {
    switch (scaleType) {
      case 'likert5':
        return "Escala de 1 (Discordo totalmente) a 5 (Concordo totalmente)";
      case 'likert7':
        return "Escala de 1 (Discordo totalmente) a 7 (Concordo totalmente)";
      case 'yes_no':
        return "Resposta binária: Sim ou Não";
      case 'frequency':
        return "Frequência: Nunca, Raramente, Às vezes, Frequentemente, Sempre";
      case 'psicossocial':
        return "Escala psicossocial: Nunca/Quase nunca até Sempre/Quase sempre";
      default:
        return "Escala personalizada";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {editingCategory ? (
            <div className="flex items-center gap-2">
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onBlur={handleCategoryNameChange}
                onKeyPress={(e) => e.key === 'Enter' && handleCategoryNameChange()}
                className="font-medium"
              />
            </div>
          ) : (
            <CardTitle 
              className="cursor-pointer hover:text-blue-600" 
              onClick={() => setEditingCategory(true)}
            >
              {category}
            </CardTitle>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveCategory(category)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {getScaleDescription()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2 p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <Label htmlFor={`question-${question.id}`}>
                Pergunta {index + 1}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              id={`question-${question.id}`}
              value={question.question_text || question.text}
              onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
              placeholder="Digite o texto da pergunta..."
              className="min-h-[80px]"
            />
            
            {/* Show scale preview for this question */}
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <strong>Escala:</strong> {getScaleDescription()}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor={`new-question-${category}`}>
            Nova Pergunta
          </Label>
          <div className="flex gap-2">
            <Textarea
              id={`new-question-${category}`}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Digite o texto da nova pergunta..."
              className="flex-1 min-h-[80px]"
            />
            <Button
              onClick={addQuestion}
              disabled={!newQuestionText.trim()}
              className="h-fit"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
