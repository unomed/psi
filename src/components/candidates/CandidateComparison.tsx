import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { FileText, Users, Star, TrendingUp, Brain, Award, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Employee } from "@/types/employee";

interface CandidateComparisonProps {
  selectedCompany: string | null;
}

export function CandidateComparison({ selectedCompany }: CandidateComparisonProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Buscar candidatos da empresa
  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates-comparison', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          employee_tags(
            tag_type_id,
            employee_tag_types(name, category)
          ),
          roles(name, required_tags)
        `)
        .eq('company_id', selectedCompany)
        .eq('employee_type', 'candidato')
        .eq('status', 'active');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Buscar funções da empresa
  const { data: roles = [] } = useQuery({
    queryKey: ['roles-comparison', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          role_required_tags(
            tag_type_id,
            employee_tag_types(name, category)
          )
        `)
        .eq('company_id', selectedCompany);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Buscar respostas de avaliações dos candidatos
  const { data: assessmentResponses = [] } = useQuery({
    queryKey: ['candidate-assessments', selectedCompany, selectedCandidates],
    queryFn: async () => {
      if (!selectedCompany || selectedCandidates.length === 0) return [];
      
      const { data, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees(name, id),
          checklist_templates(title, type)
        `)
        .in('employee_id', selectedCandidates)
        .not('completed_at', 'is', null);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany && selectedCandidates.length > 0
  });

  // Calcular score de adequação baseado nas tags relacionais
  const calculateCandidateScore = (candidate: any, roleId: string) => {
    const candidateTags = candidate.employee_tags?.map((et: any) => et.employee_tag_types?.name) || [];
    const role = roles.find((r: any) => r.id === roleId);
    const requiredTags = role?.role_required_tags?.map((rt: any) => rt.employee_tag_types?.name) || [];
    
    if (requiredTags.length === 0) return 0;
    
    const matchingTags = candidateTags.filter((tag: string) => 
      requiredTags.includes(tag)
    ).length;
    
    return Math.round((matchingTags / requiredTags.length) * 100);
  };

  // Calcular score baseado nas respostas de avaliações
  const calculateAssessmentScore = (candidateId: string) => {
    const candidateAssessments = assessmentResponses.filter((ar: any) => ar.employee_id === candidateId);
    if (candidateAssessments.length === 0) return null;
    
    const totalScore = candidateAssessments.reduce((sum: number, assessment: any) => {
      return sum + (assessment.raw_score || 0);
    }, 0);
    
    return Math.round(totalScore / candidateAssessments.length);
  };

  // Dados para o gráfico de radar baseado em avaliações reais
  const radarData = useMemo(() => {
    if (selectedCandidates.length === 0) return [];
    
    const categories = ['DISC-D', 'DISC-I', 'DISC-S', 'DISC-C', 'Psicossocial', 'Performance'];
    
    return categories.map(category => {
      const categoryData: any = { category };
      
      selectedCandidates.forEach(candidateId => {
        const candidate = candidates.find((c: any) => c.id === candidateId);
        const assessments = assessmentResponses.filter((ar: any) => ar.employee_id === candidateId);
        
        // Calcular score para cada categoria baseado nas avaliações
        let score = 0;
        if (category.startsWith('DISC')) {
          const discAssessment = assessments.find((a: any) => a.checklist_templates?.type === 'disc');
          if (discAssessment?.factors_scores) {
            const factor = category.split('-')[1];
            score = discAssessment.factors_scores[factor] || 0;
          }
        } else if (category === 'Psicossocial') {
          const psyAssessment = assessments.find((a: any) => a.checklist_templates?.type === 'psicossocial');
          score = psyAssessment?.raw_score || 0;
        } else {
          score = calculateAssessmentScore(candidateId) || 0;
        }
        
        categoryData[candidate?.name || candidateId] = score;
      });
      
      return categoryData;
    });
  }, [selectedCandidates, candidates, assessmentResponses]);

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
      const candidate = candidates.find((c: any) => c.id === candidateId);
      const candidateTags = candidate?.employee_tags?.map((et: any) => et.employee_tag_types?.name) || [];
      const assessmentScore = calculateAssessmentScore(candidateId);
      
      return {
        name: candidate?.name,
        tagScore: calculateCandidateScore(candidate, selectedRole),
        assessmentScore,
        overallScore: assessmentScore ? Math.round((calculateCandidateScore(candidate, selectedRole) + assessmentScore) / 2) : calculateCandidateScore(candidate, selectedRole),
        tags: candidateTags,
        assessments: assessmentResponses.filter((ar: any) => ar.employee_id === candidateId).length
      };
    });
    
    // Ordenar por score geral
    reportData.sort((a, b) => b.overallScore - a.overallScore);
    
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
            Compare candidatos com base em tags, competências e avaliações comportamentais
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role: any) => (
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
            {candidates.map((candidate: any) => {
              const candidateTags = candidate.employee_tags?.map((et: any) => et.employee_tag_types?.name) || [];
              const assessmentScore = calculateAssessmentScore(candidate.id);
              
              return (
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
                        {assessmentScore && (
                          <div className="flex items-center gap-2 mt-1">
                            <Brain className="h-3 w-3 text-purple-500" />
                            <span className="text-xs text-purple-600">Score: {assessmentScore}%</span>
                          </div>
                        )}
                      </div>
                      {selectedRole && (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium">
                              {calculateCandidateScore(candidate, selectedRole)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">adequação</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidateTags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {candidateTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidateTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {candidates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum candidato encontrado para esta empresa
              </p>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {selectedCandidates.length > 0 ? (
            <Tabs defaultValue="behavioral" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="behavioral">Perfil Comportamental</TabsTrigger>
                <TabsTrigger value="ranking">Ranking</TabsTrigger>
                <TabsTrigger value="detailed">Análise Detalhada</TabsTrigger>
              </TabsList>

              <TabsContent value="behavioral" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Perfil Comportamental
                    </CardTitle>
                    <CardDescription>
                      Comparação baseada em avaliações DISC e Psicossociais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        {selectedCandidates.map((candidateId, index) => {
                          const candidate = candidates.find((c: any) => c.id === candidateId);
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
              </TabsContent>

              <TabsContent value="ranking" className="space-y-4">
                {selectedRole && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Ranking de Adequação à Função
                      </CardTitle>
                      <CardDescription>
                        Baseado na correspondência com tags obrigatórias e avaliações
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedCandidates
                          .map(candidateId => {
                            const candidate = candidates.find((c: any) => c.id === candidateId);
                            const tagScore = calculateCandidateScore(candidate, selectedRole);
                            const assessmentScore = calculateAssessmentScore(candidateId);
                            const overallScore = assessmentScore ? Math.round((tagScore + assessmentScore) / 2) : tagScore;
                            
                            return {
                              candidate,
                              tagScore,
                              assessmentScore,
                              overallScore
                            };
                          })
                          .sort((a, b) => b.overallScore - a.overallScore)
                          .map(({ candidate, tagScore, assessmentScore, overallScore }, index) => (
                            <div key={candidate?.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-800' :
                                  index === 2 ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{candidate?.name}</p>
                                  <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>Tags: {tagScore}%</span>
                                    {assessmentScore && <span>Avaliações: {assessmentScore}%</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-xl">{overallScore}%</p>
                                <Progress value={overallScore} className="w-32 h-3" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCandidates.map(candidateId => {
                    const candidate = candidates.find((c: any) => c.id === candidateId);
                    const candidateTags = candidate?.employee_tags?.map((et: any) => et.employee_tag_types?.name) || [];
                    const candidateAssessments = assessmentResponses.filter((ar: any) => ar.employee_id === candidateId);
                    
                    return (
                      <Card key={candidateId}>
                        <CardHeader>
                          <CardTitle className="text-lg">{candidate?.name}</CardTitle>
                          <CardDescription>{candidate?.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              Competências ({candidateTags.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {candidateTags.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Avaliações Concluídas ({candidateAssessments.length})
                            </h4>
                            <div className="space-y-2">
                              {candidateAssessments.map((assessment: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                  <span className="text-sm">{assessment.checklist_templates?.title}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {assessment.raw_score?.toFixed(1)}%
                                  </Badge>
                                </div>
                              ))}
                              {candidateAssessments.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhuma avaliação concluída</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
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