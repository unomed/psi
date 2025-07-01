
import { useState } from "react";
import { toast } from "sonner";
import { DiscFactorType, ChecklistTemplate } from "@/types";

interface UseAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
}

export function useAssessmentForm({ template, onSubmit }: UseAssessmentFormProps) {
  const initializeResponses = () => {
    if (template.type === "psicossocial") {
      const initialResponses: Record<string, Record<string, number>> = {};
      template.questions.forEach((q: any) => {
        if (!initialResponses[q.category]) {
          initialResponses[q.category] = {};
        }
        initialResponses[q.category][q.id] = 0;
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

  const handleResponse = (questionId: string, value: number, category?: string) => {
    if (template.type === "psicossocial" && category) {
      setResponses({
        ...responses,
        [category]: {
          ...(responses[category] || {}),
          [questionId]: value
        }
      });
    } else {
      setResponses({
        ...responses,
        [questionId]: value
      });
    }
  };

  return {
    responses,
    activeTab,
    setActiveTab,
    handleResponse
  };
}
