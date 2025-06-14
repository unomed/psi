
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileText, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentResultDialog } from "./AssessmentResultDialog";

interface AssessmentResultsTableProps {
  companyId?: string | null;
}

export function AssessmentResultsTable({ companyId }: AssessmentResultsTableProps) {
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['assessmentResults', companyId],
    queryFn: async () => {
      let query = supabase
        .from('assessment_responses')
        .select(`
          *,
          checklist_templates(title, type),
          employees(name, email)
        `)
        .order('completed_at', { ascending: false });

      if (companyId) {
        // Filter by company through employee or template
        const { data: companyEmployees } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);

        if (companyEmployees) {
          const employeeIds = companyEmployees.map(emp => emp.id);
          query = query.in('employee_id', employeeIds);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  const getStatusBadge = (result: any) => {
    if (result.dominant_factor) {
      const riskLevel = getRiskLevel(result);
      return (
        <Badge variant={
          riskLevel === 'Alto' ? 'destructive' : 
          riskLevel === 'Médio' ? 'secondary' : 
          'default'
        }>
          {riskLevel} Risco
        </Badge>
      );
    }
    return <Badge variant="outline">Concluída</Badge>;
  };

  const getRiskLevel = (result: any) => {
    if (result.factors_scores) {
      const scores = Object.values(result.factors_scores) as number[];
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      if (avgScore >= 0.8) return 'Alto';
      if (avgScore >= 0.6) return 'Médio';
      return 'Baixo';
    }
    return 'Indefinido';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando resultados...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resultados das Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum resultado de avaliação encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {result.checklist_templates?.title || 'Avaliação'}
                      </h4>
                      {getStatusBadge(result)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {result.employees?.name || result.employee_name || 'Anônimo'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(result.completed_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {result.dominant_factor && (
                      <div className="mt-1 text-sm">
                        <span className="text-muted-foreground">Fator dominante: </span>
                        <span className="font-medium">{result.dominant_factor}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResult(result)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement export functionality
                        console.log("Export result:", result.id);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AssessmentResultDialog
        result={selectedResult}
        isOpen={isResultDialogOpen}
        onClose={() => {
          setIsResultDialogOpen(false);
          setSelectedResult(null);
        }}
      />
    </>
  );
}
