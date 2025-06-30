import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionList } from "./QuestionList";
import { ChecklistTemplate, Question } from "@/types";

interface CategoryQuestionGroupProps {
  category: string;
  questions: Question[];
  template: ChecklistTemplate;
  onQuestionsChange: (questions: Question[]) => void;
  onRemoveCategory: (category: string) => void;
}

export function CategoryQuestionGroup({
  category,
  questions,
  template,
  onQuestionsChange,
  onRemoveCategory
}: CategoryQuestionGroupProps) {
  const [categoryName, setCategoryName] = useState(category);

  useEffect(() => {
    setCategoryName(category);
  }, [category]);

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleQuestionsChange = (updatedQuestions: Question[]) => {
    onQuestionsChange(updatedQuestions);
  };

  const handleRemoveCategory = () => {
    onRemoveCategory(category);
  };

  const getScaleOptions = () => {
    const scaleType = template.scale_type;
    
    if (scaleType === 'likert_5') {  // ✅ usar string literal
      return [
        { value: "1", label: "1 - Discordo totalmente" },
        { value: "2", label: "2 - Discordo" },
        { value: "3", label: "3 - Neutro" },
        { value: "4", label: "4 - Concordo" },
        { value: "5", label: "5 - Concordo totalmente" }
      ];
    } else if (scaleType === 'binary' || scaleType === 'yes_no') {  // ✅ usar string literals
      return [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" }
      ];
    } else if (scaleType === 'psicossocial') {  // ✅ usar string literal
      return [
        { value: "1", label: "1 - Nunca" },
        { value: "2", label: "2 - Raramente" },
        { value: "3", label: "3 - Às vezes" },
        { value: "4", label: "4 - Frequentemente" },
        { value: "5", label: "5 - Sempre" }
      ];
    }
    
    return [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" }
    ];
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`category-name-${category}`}>Nome da Categoria</Label>
            <Button variant="destructive" size="sm" onClick={handleRemoveCategory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </Button>
          </div>
          <Input 
            id={`category-name-${category}`}
            value={categoryName}
            onChange={handleCategoryNameChange}
          />

          <QuestionList 
            category={categoryName}
            questions={questions}
            template={template}
            onQuestionsChange={handleQuestionsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
