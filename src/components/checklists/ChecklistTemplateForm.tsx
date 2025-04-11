
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DiscQuestion, ChecklistTemplate, ScaleType } from "@/types/checklist";
import { QuestionForm } from "./form/QuestionForm";
import { QuestionList } from "./form/QuestionList";
import { ChecklistBasicInfo } from "./form/ChecklistBasicInfo";
import { toast } from "sonner";

interface ChecklistTemplateFormProps {
  onSubmit: (data: Omit<ChecklistTemplate, "id" | "createdAt">) => void;
}

export function ChecklistTemplateForm({ onSubmit }: ChecklistTemplateFormProps) {
  const [questions, setQuestions] = useState<Omit<DiscQuestion, "id">[]>([]);
  const [scaleType, setScaleType] = useState<ScaleType>("likert5");

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "disc" as const,
    },
  });

  const handleAddQuestion = (question: Omit<DiscQuestion, "id">) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma questão ao checklist");
      return;
    }

    // Create unique IDs for each question
    const questionsWithIds = questions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));

    onSubmit({
      ...data,
      questions: questionsWithIds,
      scaleType,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ChecklistBasicInfo 
          form={form} 
          scaleType={scaleType} 
          onScaleTypeChange={setScaleType} 
        />

        <div className="space-y-4">
          <div className="font-medium text-sm">Questões</div>
          <QuestionForm onAddQuestion={handleAddQuestion} />

          <QuestionList 
            questions={questions} 
            onRemoveQuestion={handleRemoveQuestion} 
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Criar Checklist</Button>
        </div>
      </form>
    </Form>
  );
}
