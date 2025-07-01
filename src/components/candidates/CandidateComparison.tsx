
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { FileText, Users, Star, TrendingUp } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmployeeTags } from "@/hooks/useEmployeeTags";
import { useRoles } from "@/hooks/useRoles";
import type { Employee } from "@/types/employee";

interface CandidateComparisonProps {
  selectedCompany: string | null;
}

export function CandidateComparison({ selectedCompany }: CandidateComparisonProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { employees } = useEmployees();
  const { roles } = useRoles();

  // Filtrar apenas candidatos da empresa selecionada
  const candidates = useMemo(() => {
    if (!selectedCompany) return [];
    return employees?.filter(emp => 
      emp.company_id === selectedCompany && 
      emp.employee_type === 'candidato'
    ) || [];
  }, [employees, selectedCompany]);

  // Calcular score de adequação para um candidato
  const calculateCandidateScore = (candidate: Employee, roleId: string) => {
    // Lógica simplificada de score baseado em tags
    const candidateTags = Array.isArray(candidate.employee_tags) ? candidate.employee_tags as string[] : [];
    const role = roles?.find(r => r.id === roleId);
    const requiredTags = Array.isArray(role?.required_tags) ? role.required_tags as string[] : [];
    
    if (requiredTags.length === 0) return 0;
    
    const matchingTags = candidateTags.filter(tag => 
      requiredTags.includes(tag)
    ).length;
    
    return Math.round((matchingTags / requiredTags.length) * 100);
  };

  // Dados para o gráfico de radar
  const radarData = useMemo(() => {
    if (selectedCandidates.length === 0) return [];
    
    const behavioralCategories = [
      'Comprometido', 'Atento', 'Proativo', 'Comunicativo', 'Liderança', 'Trabalho em Equipe'
    ];
    
    return behavioralCategories.map(category => {
      const categoryData: any = { category };
      
      selectedCandidates.forEach(candidateId => {
        const candidate = candidates.find(c => c.id === candidateId);
        const tags = Array.isArray(candidate?.employee_tags) ? candidate.employee_tags as string[] : [];
        
        // Simular pontuação baseada em tags (0-100)
        const hasTag = tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()));
        categoryData[candidate?.name || candidateId] = hasTag ? Math.random() * 40 + 60 : Math.random() * 40 + 20;
      });
      
      return categoryData;
    });
  }, [selectedCandidates, candidates]);

  const handleCandidateSelection = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const generateComparisonReport = () => {
    if (selectedCandidates.length === 0 || !selectedRole) return;
    
    const reportData = selectedCandidates.map(candidateId => {
      const candidate = candidates.find(c => c.id === candidateId);
      return {
        name: candidate?.name,
        score: calculateCandidateScore(candidate!, selectedRole),
        tags: Array.isArray(candidate?.employee_tags) ? candidate.employee_tags as string[] : []
      };
    });
    
    // Ordenar por score
    reportData.sort((a, b) => b.score - a.score);
    
    console.log('Relatório de Comparação:', reportData);
    // Aqui você pode implementar a geração de PDF ou exportação
  };

  if (!selectedCompany) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para comparar candidatos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Comparação de Candidatos</h2>
          <p className="text-muted-foreground">
            Compare candidatos com base em suas competências e adequação à função
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              {roles?.filter(role => role.companyId === selectedCompany).map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={generateComparisonReport}
            disabled={selectedCandidates.length === 0 || !selectedRole}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Candidatos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidatos Disponíveis
            </CardTitle>
            <CardDescription>
              Selecione os candidatos para comparar ({selectedCandidates.length} selecionados)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidates.map(candidate => (
              <div key={candidate.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedCandidates.includes(candidate.id)}
                  onCheckedChange={(checked) => 
                    handleCandidateSelection(candidate.id, checked as boolean)
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                    {selectedRole && (
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">
                            {calculateCandidateScore(candidate, selectedRole)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.isArray(candidate.employee_tags) && 
                      (candidate.employee_tags as string[]).slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    }
                    {Array.isArray(candidate.employee_tags) && (candidate.employee_tags as string[]).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(candidate.employee_tags as string[]).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {candidates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum candidato encontrado para esta empresa
              </p>
            )}
          </CardContent>
        </Card>

        {/* Área de Comparação */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCandidates.length > 0 ? (
            <>
              {/* Gráfico de Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Perfil Comportamental</CardTitle>
                  <CardDescription>
                    Comparação das competências comportamentais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      {selectedCandidates.map((candidateId, index) => {
                        const candidate = candidates.find(c => c.id === candidateId);
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
                        return (
                          <Radar
                            key={candidateId}
                            name={candidate?.name}
                            dataKey={candidate?.name}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.1}
                          />
                        );
                      })}
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Ranking de Adequação */}
              {selectedRole && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Ranking de Adequação à Função
                    </CardTitle>
                    <CardDescription>
                      Baseado na correspondência com tags obrigatórias da função
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCandidates
                        .map(candidateId => {
                          const candidate = candidates.find(c => c.id === candidateId);
                          return {
                            candidate,
                            score: calculateCandidateScore(candidate!, selectedRole)
                          };
                        })
                        .sort((a, b) => b.score - a.score)
                        .map(({ candidate, score }, index) => (
                          <div key={candidate?.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{candidate?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {Array.isArray(candidate?.employee_tags) ? (candidate.employee_tags as string[]).length : 0} competências
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{score}%</p>
                              <Progress value={score} className="w-24 h-2" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Selecione candidatos para comparar</p>
                  <p className="text-muted-foreground">
                    Escolha ao menos 2 candidatos da lista para ver a comparação
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
