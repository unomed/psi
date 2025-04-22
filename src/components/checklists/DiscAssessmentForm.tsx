
import { ChecklistTemplate, DiscFactorType, DiscQuestion, PsicossocialQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscQuestionForm } from "./disc/DiscQuestionForm";
import { PsicossocialQuestionForm } from "./psicossocial/PsicossocialQuestionForm";
import { useAssessmentForm } from "./hooks/useAssessmentForm";

interface DiscAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function DiscAssessmentForm({ template, onSubmit, onCancel }: DiscAssessmentFormProps) {
  const { responses, activeTab, setActiveTab, handleResponse } = useAssessmentForm({ 
    template, 
    onSubmit 
  });

  const getQuestionsByFactor = (factor: DiscFactorType): DiscQuestion[] => {
    if (template.type !== "disc") return [];
    return template.questions.filter(
      (q) => (q as DiscQuestion).targetFactor === factor
    ) as DiscQuestion[];
  };

  const getQuestionsByCategory = (category: string): PsicossocialQuestion[] => {
    if (template.type !== "psicossocial") return [];
    return template.questions.filter(
      (q) => (q as PsicossocialQuestion).category === category
    ) as PsicossocialQuestion[];
  };

  const getUniqueCategories = (): string[] => {
    if (template.type !== "psicossocial") return [];
    const categories = new Set<string>();
    template.questions.forEach((q) => {
      const question = q as PsicossocialQuestion;
      categories.add(question.category);
    });
    return Array.from(categories);
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {categories.map((category, index) => (
              <TabsTrigger key={category} value={(index + 1).toString()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category, index) => (
            <TabsContent key={category} value={(index + 1).toString()}>
              <PsicossocialQuestionForm
                category={category}
                questions={getQuestionsByCategory(category)}
                responses={responses[category] || {}}
                onResponse={(questionId, value) => handleResponse(questionId, value, category)}
              />
            </TabsContent>
          ))}
        </Tabs>
      );
    } else if (template.type === "disc") {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="1">D - Dominância</TabsTrigger>
            <TabsTrigger value="2">I - Influência</TabsTrigger>
            <TabsTrigger value="3">S - Estabilidade</TabsTrigger>
            <TabsTrigger value="4">C - Conformidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="1">
            <DiscQuestionForm
              questions={getQuestionsByFactor(DiscFactorType.D)}
              responses={responses}
              onResponse={handleResponse}
              factorTitle="D - Dominância"
            />
          </TabsContent>
          
          <TabsContent value="2">
            <DiscQuestionForm
              questions={getQuestionsByFactor(DiscFactorType.I)}
              responses={responses}
              onResponse={handleResponse}
              factorTitle="I - Influência"
            />
          </TabsContent>
          
          <TabsContent value="3">
            <DiscQuestionForm
              questions={getQuestionsByFactor(DiscFactorType.S)}
              responses={responses}
              onResponse={handleResponse}
              factorTitle="S - Estabilidade"
            />
          </TabsContent>
          
          <TabsContent value="4">
            <DiscQuestionForm
              questions={getQuestionsByFactor(DiscFactorType.C)}
              responses={responses}
              onResponse={handleResponse}
              factorTitle="C - Conformidade"
            />
          </TabsContent>
        </Tabs>
      );
    }
    
    return (
      <div className="space-y-4">
        <p>Tipo de checklist personalizado não implementado.</p>
      </div>
    );
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
