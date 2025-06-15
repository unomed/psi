
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface IndividualReportsProps {
  filters: {
    selectedCompany: string | null;
    dateRange: any;
    selectedSector: string;
    selectedRole: string;
  };
}

export function IndividualReports({ filters }: IndividualReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['individualReports', filters.selectedCompany],
    queryFn: async () => {
      let query = supabase
        .from('assessment_responses')
        .select(`
          *,
          employees!inner(
            id, name, company_id, role_id, sector_id,
            roles(name),
            sectors(name)
          )
        `);

      if (filters.selectedCompany) {
        query = query.eq('employees.company_id', filters.selectedCompany);
      }

      const { data, error } = await query.order('completed_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const filteredAssessments = assessments?.filter(assessment => 
    assessment.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.employees?.roles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.employees?.sectors?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRiskLevel = (percentile: number | null) => {
    if (!percentile) return { level: "N/A", color: "secondary" };
    if (percentile >= 70) return { level: "Alto", color: "destructive" };
    if (percentile >= 30) return { level: "Médio", color: "default" };
    return { level: "Baixo", color: "secondary" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Individuais</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Relatórios Individuais
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAssessments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchTerm ? 
              "Nenhum funcionário encontrado com esse termo de busca" :
              "Nenhuma avaliação individual encontrada"
            }
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredAssessments.map((assessment) => {
              const risk = getRiskLevel(assessment.percentile);
              return (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{assessment.employees?.name || 'Nome não disponível'}</div>
                    <div className="text-sm text-muted-foreground">
                      {assessment.employees?.roles?.name || 'Função não disponível'} • {assessment.employees?.sectors?.name || 'Setor não disponível'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Avaliado em: {assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={risk.color as any}>
                      Risco {risk.level}
                    </Badge>
                    {assessment.percentile && (
                      <div className="text-sm font-medium">
                        {assessment.percentile.toFixed(0)}%
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Relatório
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
