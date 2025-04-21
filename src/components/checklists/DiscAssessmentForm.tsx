import { useState } from "react";
import { ChecklistTemplate, DiscQuestion, PsicossocialQuestion } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DiscFactorType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiscAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function DiscAssessmentForm({ template, onSubmit, onCancel }: DiscAssessmentFormProps) {
  const initializeResponses = () => {
    if (template.type === "psicossocial") {
      const initialResponses: Record<string, Record<string, number>> = {};
      
      template.questions.forEach((q) => {
        const question = q as PsicossocialQuestion;
        if (!initialResponses[question.category]) {
          initialResponses[question.category] = {};
        }
        initialResponses[question.category][question.id] = 0;
      });
      
      return initialResponses;
    } else {
      return template.questions.reduce((acc, q) => {
        acc[q.id] = 0;
        return acc;
      }, {} as Record<string, number>);
    }
  };

  const [responses, setResponses] = useState<Record<string, any>>(initializeResponses());
  const [activeTab, setActiveTab] = useState<string>("1");

  const getUniqueCategories = (): string[] => {
    if (template.type !== "psicossocial") return [];
    
    const categories = new Set<string>();
    template.questions.forEach((q) => {
      const question = q as PsicossocialQuestion;
      categories.add(question.category);
    });
    
    return Array.from(categories);
  };

  const getQuestionsByCategory = (category: string): PsicossocialQuestion[] => {
    if (template.type !== "psicossocial") return [];
    
    return template.questions.filter(
      (q) => (q as PsicossocialQuestion).category === category
    ) as PsicossocialQuestion[];
  };

  const getQuestionsByFactor = (factor: DiscFactorType): DiscQuestion[] => {
    if (template.type !== "disc") return [];
    
    return template.questions.filter(
      (q) => (q as DiscQuestion).targetFactor === factor
    ) as DiscQuestion[];
  };

  const handleResponse = (questionId: string, value: number) => {
    if (template.type === "psicossocial") {
      const category = template.questions.find(q => q.id === questionId) as PsicossocialQuestion;
      if (category) {
        setResponses({
          ...responses,
          [category.category]: {
            ...(responses[category.category] || {}),
            [questionId]: value
          }
        });
      }
    } else {
      setResponses({
        ...responses,
        [questionId]: value
      });
    }
  };

  const handleSubmit = () => {
    if (template.type === "psicossocial") {
      const categorizedResults: Record<string, number> = {};
      let totalScore = 0;
      let totalQuestions = 0;
      
      Object.keys(responses).forEach(category => {
        const categoryResponses = responses[category];
        let categoryTotal = 0;
        let categoryQuestions = 0;
        
        Object.keys(categoryResponses).forEach(questionId => {
          if (categoryResponses[questionId] > 0) {
            categoryTotal += categoryResponses[questionId];
            categoryQuestions++;
            totalScore += categoryResponses[questionId];
            totalQuestions++;
          }
        });
        
        if (categoryQuestions > 0) {
          categorizedResults[category] = categoryTotal / categoryQuestions;
        }
      });
      
      let dominantFactor = "Não determinado";
      let highestScore = 0;
      
      Object.keys(categorizedResults).forEach(category => {
        if (categorizedResults[category] > highestScore) {
          highestScore = categorizedResults[category];
          dominantFactor = category;
        }
      });
      
      onSubmit({
        results: categorizedResults,
        dominantFactor,
        overall: totalQuestions > 0 ? totalScore / totalQuestions : 0,
        responses
      });
    } else {
      const factors = { D: 0, I: 0, S: 0, C: 0 };
      const factorCounts = { D: 0, I: 0, S: 0, C: 0 };

      template.questions.forEach((q) => {
        if (template.type === "disc") {
          const question = q as DiscQuestion;
          if (responses[q.id]) {
            factors[question.targetFactor] += responses[q.id] * (question.weight || 1);
            factorCounts[question.targetFactor]++;
          }
        }
      });

      Object.keys(factors).forEach((factor) => {
        const key = factor as keyof typeof factors;
        if (factorCounts[key] > 0) {
          factors[key] = factors[key] / factorCounts[key];
        }
      });

      let dominantFactor = "D";
      let highestScore = 0;

      Object.keys(factors).forEach((factor) => {
        const key = factor as keyof typeof factors;
        if (factors[key] > highestScore) {
          highestScore = factors[key];
          dominantFactor = factor;
        }
      });

      onSubmit({
        results: factors,
        dominantFactor,
        responses
      });
    }
  };

  const renderAssessmentByType = () => {
    if (template.type === "psicossocial") {
      const categories = getUniqueCategories();
      
      return (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {categories.map((category, index) => (
              <TabsTrigger key={category} value={(index + 1).toString()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category, index) => (
            <TabsContent key={category} value={(index + 1).toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getQuestionsByCategory(category).map((question) => (
                      <div key={question.id} className="border-b pb-4">
                        <p className="mb-3 font-medium">{question.text}</p>
                        <RadioGroup
                          value={
                            responses[category] && 
                            responses[category][question.id]?.toString() || "0"
                          }
                          onValueChange={(value) => 
                            handleResponse(question.id, parseInt(value))
                          }
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
            </TabsContent>
          ))}
        </Tabs>
      );
    } else if (template.type === "disc") {
      const dQuestions = getQuestionsByFactor("D");
      const iQuestions = getQuestionsByFactor("I");
      const sQuestions = getQuestionsByFactor("S");
      const cQuestions = getQuestionsByFactor("C");
      
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="1">D - Dominância</TabsTrigger>
            <TabsTrigger value="2">I - Influência</TabsTrigger>
            <TabsTrigger value="3">S - Estabilidade</TabsTrigger>
            <TabsTrigger value="4">C - Conformidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="1">
            <Card>
              <CardHeader>
                <CardTitle>D - Dominância</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4">
                      <p className="mb-3 font-medium">{question.text}</p>
                      <RadioGroup
                        value={responses[question.id]?.toString() || "0"}
                        onValueChange={(value) => 
                          handleResponse(question.id, parseInt(value))
                        }
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
          </TabsContent>
          
          <TabsContent value="2">
            <Card>
              <CardHeader>
                <CardTitle>I - Influência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4">
                      <p className="mb-3 font-medium">{question.text}</p>
                      <RadioGroup
                        value={responses[question.id]?.toString() || "0"}
                        onValueChange={(value) => 
                          handleResponse(question.id, parseInt(value))
                        }
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
          </TabsContent>
          
          <TabsContent value="3">
            <Card>
              <CardHeader>
                <CardTitle>S - Estabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4">
                      <p className="mb-3 font-medium">{question.text}</p>
                      <RadioGroup
                        value={responses[question.id]?.toString() || "0"}
                        onValueChange={(value) => 
                          handleResponse(question.id, parseInt(value))
                        }
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
          </TabsContent>
          
          <TabsContent value="4">
            <Card>
              <CardHeader>
                <CardTitle>C - Conformidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cQuestions.map((question) => (
                    <div key={question.id} className="border-b pb-4">
                      <p className="mb-3 font-medium">{question.text}</p>
                      <RadioGroup
                        value={responses[question.id]?.toString() || "0"}
                        onValueChange={(value) => 
                          handleResponse(question.id, parseInt(value))
                        }
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
          </TabsContent>
        </Tabs>
      );
    } else {
      return (
        <div className="space-y-4">
          <p>Tipo de checklist personalizado não implementado.</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {template.title}
      </h2>
      
      {template.description && (
        <p className="text-gray-600">
          {template.description}
        </p>
      )}
      
      {renderAssessmentByType()}
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Concluir Avaliação
        </Button>
      </div>
    </div>
  );
}
