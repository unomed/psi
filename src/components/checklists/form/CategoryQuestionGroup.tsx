
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { ScaleType } from "@/types";

export interface CategoryQuestion {
  id: string;
  text: string;
  category: string;
  weight?: number;
}

interface CategoryQuestionGroupProps {
  categories: string[];
  questions: CategoryQuestion[];
  onAddCategory: (category: string) => void;
  onAddQuestion: (question: CategoryQuestion) => void;
  onRemoveQuestion: (questionId: string) => void;
  onUpdateQuestion: (question: CategoryQuestion) => void;
  selectedScaleType: ScaleType;
}

export function CategoryQuestionGroup({
  categories,
  questions,
  onAddCategory,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  selectedScaleType
}: CategoryQuestionGroupProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || "");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setSelectedCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim() && selectedCategory) {
      const newQuestion: CategoryQuestion = {
        id: uuidv4(),
        text: newQuestionText.trim(),
        category: selectedCategory,
        weight: 1
      };
      onAddQuestion(newQuestion);
      setNewQuestionText("");
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Agrupar questões por categoria
  const questionsByCategory = categories.reduce((acc, category) => {
    acc[category] = questions.filter(q => q.category === category);
    return acc;
  }, {} as Record<string, CategoryQuestion[]>);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Categorias e Perguntas</h3>
        
        {/* Adicionar nova categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="new-category">Nova Categoria</Label>
            <div className="flex space-x-2">
              <Input 
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Demandas de Trabalho"
              />
              <Button 
                type="button" 
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        {/* Adicionar nova pergunta */}
        <div className="space-y-2">
          <h4 className="text-md font-medium">Adicionar Nova Pergunta</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="question-category">Categoria</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                disabled={categories.length === 0}
              >
                <SelectTrigger id="question-category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-question">Texto da Pergunta</Label>
              <div className="flex space-x-2">
                <Input 
                  id="new-question"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ex: Tenho tempo suficiente para realizar minhas tarefas diárias"
                />
                <Button 
                  type="button" 
                  onClick={handleAddQuestion}
                  disabled={!newQuestionText.trim() || !selectedCategory}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de categorias e perguntas */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Categorias e Perguntas ({questions.length})</h4>
        
        {categories.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">Nenhuma categoria foi adicionada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(category => (
              <Card key={category}>
                <CardHeader 
                  className="py-3 cursor-pointer flex flex-row items-center justify-between"
                  onClick={() => toggleCategory(category)}
                >
                  <CardTitle className="text-md font-medium flex items-center">
                    {expandedCategory === category ? (
                      <ChevronDown className="h-5 w-5 mr-2" />
                    ) : (
                      <ChevronUp className="h-5 w-5 mr-2" />
                    )}
                    {category} ({questionsByCategory[category]?.length || 0})
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Escala: {selectedScaleType === ScaleType.Likert ? "Likert (1-5)" : 
                             selectedScaleType === ScaleType.YesNo ? "Sim/Não" : 
                             selectedScaleType === ScaleType.Psicossocial ? "Psicossocial (1-5)" :
                             "Personalizada"}
                  </div>
                </CardHeader>
                
                {expandedCategory === category && (
                  <CardContent>
                    {questionsByCategory[category]?.length ? (
                      <div className="space-y-2">
                        {questionsByCategory[category].map((question, index) => (
                          <div key={question.id} className="flex items-start justify-between p-2 border rounded-md">
                            <div className="flex-1">
                              <p className="text-sm">{index + 1}. {question.text}</p>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onRemoveQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma pergunta nesta categoria.</p>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
