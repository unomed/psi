import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssessmentResponseProps {
  assessment: {
    id: string;
    templateId: string;
    templateName: string;
    questions: any[];
  };
  onSubmit: (responses: Record<string, any>) => void;
}

export function AssessmentResponse({ assessment, onSubmit }: AssessmentResponseProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(responses);
  };

  // Mock template data with corrected scale type
  const mockTemplate = {
    id: assessment.templateId,
    name: assessment.templateName,
    title: assessment.templateName,
    type: "psicossocial" as const,
    scale_type: "likert5" as const,
    questions: assessment.questions
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responder Avaliação: {mockTemplate.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {mockTemplate.questions.map((question) => (
          <div key={question.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{question.text}</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleSubmit}>Enviar Respostas</Button>
      </CardContent>
    </Card>
  );
}
