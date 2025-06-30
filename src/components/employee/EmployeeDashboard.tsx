import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";
import { AssessmentResponse } from "./AssessmentResponse";

interface DashboardProps {
  templateId?: string;
  employeeId?: string;
}

export function EmployeeDashboard() {
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { templateId, employeeId } = useParams<DashboardProps>();

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  const fetchTemplate = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        console.error("Erro ao buscar template:", error);
        return;
      }

      setTemplate({
        id: data.id,
        name: data.title,
        title: data.title,
        description: data.description,
        type: data.type,
        scale_type: data.scale_type,
        is_active: data.is_active,
        is_standard: data.is_standard || false,
        estimated_time_minutes: data.estimated_time_minutes,
        version: data.version,
        company_id: data.company_id,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        category: 'default'
      });
    } catch (error) {
      console.error("Erro ao buscar template:", error);
    }
  };

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Assessment Progress */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {template?.title || "Carregando..."}
              </CardTitle>
              <CardDescription>
                Responda as perguntas abaixo para completar a avaliação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {template && employeeId ? (
                <AssessmentResponse
                  template={template}
                  employeeId={employeeId}
                  onComplete={() => setCompleted(true)}
                  onProgress={(p: number) => setProgress(p)}
                />
              ) : (
                <p>Carregando questionário...</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button disabled={!completed}>
                Salvar e Continuar Mais Tarde
              </Button>
              <div className="flex items-center space-x-2">
                <span>Progresso:</span>
                <Progress value={progress} className="w-40" />
                <span>{Math.round(progress)}%</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side - Quick Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription>Informações rápidas sobre a avaliação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Data de Início: Hoje</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Tempo Estimado: 30 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span>Status: {completed ? "Concluído" : "Em Andamento"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>Risco: Médio</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full justify-start">
                Ver Detalhes <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
