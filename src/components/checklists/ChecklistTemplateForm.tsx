
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DiscQuestion, ChecklistTemplate, ScaleType } from "@/types";
import { QuestionForm } from "./form/QuestionForm";
import { QuestionList } from "./form/QuestionList";
import { ChecklistBasicInfo } from "./form/ChecklistBasicInfo";
import { toast } from "sonner";

interface ChecklistTemplateFormProps {
  onSubmit: (data: Omit<ChecklistTemplate, "id" | "createdAt"> | ChecklistTemplate) => void;
  existingTemplate?: ChecklistTemplate | null;
  isEditing?: boolean;
}

export function ChecklistTemplateForm({ 
  onSubmit, 
  existingTemplate, 
  isEditing = false 
}: ChecklistTemplateFormProps) {
  const [questions, setQuestions] = useState<Omit<DiscQuestion, "id">[]>([]);
  const [scaleType, setScaleType] = useState<ScaleType>(existingTemplate?.scaleType || "likert5");

  const form = useForm({
    defaultValues: {
      title: existingTemplate?.title || "",
      description: existingTemplate?.description || "",
      type: existingTemplate?.type || "disc" as const,
    },
  });

  // Load existing data when editing
  useEffect(() => {
    if (existingTemplate) {
      form.reset({
        title: existingTemplate.title,
        description: existingTemplate.description || "",
        type: existingTemplate.type,
      });
      
      setScaleType(existingTemplate.scaleType || "likert5");
      
      // Convert questions to the format needed for the form
      if (existingTemplate.questions) {
        const formattedQuestions = existingTemplate.questions.map(q => ({
          text: q.text,
          targetFactor: q.targetFactor,
          weight: q.weight,
        }));
        setQuestions(formattedQuestions);
      }
    }
  }, [existingTemplate, form]);

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
    const questionsWithIds: DiscQuestion[] = questions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));

    if (isEditing && existingTemplate) {
      // Update the existing template
      onSubmit({
        ...existingTemplate,
        ...data,
        questions: questionsWithIds,
        scaleType,
      });
    } else {
      // Create a new template
      onSubmit({
        ...data,
        questions: questionsWithIds,
        scaleType,
      });
    }
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
          <Button type="submit">
            {isEditing ? "Atualizar Checklist" : "Criar Checklist"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
