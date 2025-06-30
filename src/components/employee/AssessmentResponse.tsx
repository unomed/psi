
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChecklistTemplate } from "@/types";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { supabase } from "@/integrations/supabase/client";

interface AssessmentResponseProps {
  templateId: string;
  employeeId: string;
  onComplete: () => void;
}

export function AssessmentResponse({
  templateId,
  employeeId,
  onComplete
}: AssessmentResponseProps) {
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;

      // Map database fields to ChecklistTemplate interface
      const mappedTemplate: ChecklistTemplate = {
        id: data.id,
        name: data.title,
        title: data.title,
        description: data.description,
        category: 'default', // Add required category field
        type: data.type,
        scale_type: data.scale_type,
        is_active: data.is_active,
        is_standard: data.is_standard || false,
        estimated_time_minutes: data.estimated_time_minutes,
        version: data.version,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_id: data.company_id,
        created_by: data.created_by,
        cutoff_scores: data.cutoff_scores,
        derived_from_id: data.derived_from_id,
        instructions: data.instructions
      };

      setTemplate(mappedTemplate);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Erro ao carregar template');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (responses: any) => {
    try {
      const { error } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: templateId,
          employee_id: employeeId,
          response_data: responses,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('Error saving response:', err);
      setError('Erro ao salvar resposta');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando avaliação...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!template) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Template não encontrado</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <DiscAssessmentForm
        template={template}
        onSubmit={handleSubmit}
        onCancel={onComplete}
      />
    </div>
  );
}
