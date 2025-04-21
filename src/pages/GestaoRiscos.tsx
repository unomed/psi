import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Download, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import RiskMatrixConfigurator from "@/components/risks/RiskMatrixConfigurator";
import RiskMatrixSettingsForm from "@/components/settings/RiskMatrixSettingsForm";
import RiskAnalysisForm from "@/components/risks/RiskAnalysisForm";

export default function GestaoRiscos() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeRiskTab, setActiveRiskTab] = useState("identificacao");
  const [riskType, setRiskType] = useState("todos");
  const { userRole } = useAuth();

  // Matrix configurator state for "Análise"
  const [matrixSize, setMatrixSize] = useState(3);
  const defaultLabels = (size: number, prefix: string) =>
    Array.from({ length: size }, (_, i) => `${prefix} ${i + 1}`);

  const calculateRiskValue = (row: number, col: number) => (row + 1) * (col + 1);

  const [rowLabels, setRowLabels] = useState(defaultLabels(matrixSize, "Severidade"));
  const [colLabels, setColLabels] = useState(defaultLabels(matrixSize, "Probabilidade"));
  const [riskMatrix, setRiskMatrix] = useState(
    Array.from({ length: matrixSize }, (_, r) =>
      Array.from({ length: matrixSize }, (_, c) => calculateRiskValue(r, c))
    )
  );

  // When matrix size changes, reset labels and matrix values
  useEffect(() => {
    setRowLabels(defaultLabels(matrixSize, "Severidade"));
    setColLabels(defaultLabels(matrixSize, "Probabilidade"));
    setRiskMatrix(
      Array.from({ length: matrixSize }, (_, r) =>
        Array.from({ length: matrixSize }, (_, c) => calculateRiskValue(r, c))
      )
    );
  }, [matrixSize]);

  // State to capture dropdown selection for Análise step
  const [selectedSeverityIndex, setSelectedSeverityIndex] = useState(0); // index from 0
  const [selectedProbabilityIndex, setSelectedProbabilityIndex] = useState(0); // index from 0
  const [calculatedRiskValue, setCalculatedRiskValue] = useState(0);

  // Options for Severity and Probability dropdowns - linked to current matrix labels
  // For demonstration, descriptions are static, you could make this dynamic
  const severityOptions = rowLabels.map((label, i) => ({
    label,
    description: `Nível ${i + 1} de severidade`,
  }));
  const probabilityOptions = colLabels.map((label, i) => ({
    label,
    description: `Nível ${i + 1} de probabilidade`,
  }));

  useEffect(() => {
    // Calculate risk value from current matrix based on selected indexes
    if (
      selectedSeverityIndex >= 0 &&
      selectedSeverityIndex < riskMatrix.length &&
      selectedProbabilityIndex >= 0 &&
      selectedProbabilityIndex < riskMatrix.length
    ) {
      const risk = riskMatrix[selectedSeverityIndex][selectedProbabilityIndex];
      setCalculatedRiskValue(risk);
    }
  }, [selectedProbabilityIndex, selectedSeverityIndex, riskMatrix]);

  if (userRole !== "superadmin") {
    return (
      <div className="p-8 text-center">
        <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Riscos</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de riscos psicossociais conforme NR-01.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="riscos">Gerenciamento</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground">Total de riscos</div>
                <div className="text-3xl font-bold">82</div>
                <div className="text-sm text-green-600">+4 este mês</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground">Riscos críticos</div>
                <div className="text-3xl font-bold text-red-600">36</div>
                <div className="text-sm text-red-600">+2 este mês</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground">Riscos psicossociais</div>
                <div className="text-3xl font-bold text-amber-600">15</div>
                <div className="text-sm text-blue-600">Em avaliação</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground">Ações pendentes</div>
                <div className="text-3xl font-bold text-orange-600">24</div>
                <div className="text-sm text-red-600">8 atrasadas</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Matriz de Riscos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="grid grid-cols-3 gap-1 w-full">
                  {/* Alto impacto */}
                  <div className="bg-amber-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Mitigar</div>
                    <div className="text-xl font-bold mt-2">09</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Evitar</div>
                    <div className="text-xl font-bold mt-2">11</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Evitar</div>
                    <div className="text-xl font-bold mt-2">09</div>
                  </div>
                  
                  {/* Impacto médio */}
                  <div className="bg-green-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Reter</div>
                    <div className="text-xl font-bold mt-2">08</div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Mitigar</div>
                    <div className="text-xl font-bold mt-2">07</div>
                  </div>
                  <div className="bg-red-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Evitar</div>
                    <div className="text-xl font-bold mt-2">16</div>
                  </div>
                  
                  {/* Baixo impacto */}
                  <div className="bg-green-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Reter</div>
                    <div className="text-xl font-bold mt-2">05</div>
                  </div>
                  <div className="bg-green-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Reter</div>
                    <div className="text-xl font-bold mt-2">06</div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded border border-gray-200 flex flex-col items-center">
                    <div className="font-bold">Mitigar</div>
                    <div className="text-xl font-bold mt-2">11</div>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-3 text-center text-sm">
                  <div>Probabilidade baixa</div>
                  <div>Probabilidade média</div>
                  <div>Probabilidade alta</div>
                </div>
                
                <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-bold">
                  Impacto
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Riscos Psicossociais por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Sobrecarga de trabalho</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <span className="font-bold">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Assédio moral</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Falta de autonomia</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-amber-500 h-4 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <span className="font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conflitos interpessoais</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-amber-500 h-4 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Baixo reconhecimento</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <span className="font-bold">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trabalho isolado</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="font-bold">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
              
            <Card>
              <CardHeader>
                <CardTitle>Ações por Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Maria Silva (Recursos Humanos)</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <span className="font-bold">9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>João Pereira (SESMT)</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Carlos Santos (Segurança)</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ana Oliveira (Produção)</span>
                    <div className="w-2/3 bg-gray-200 rounded-full h-4">
                      <div className="bg-primary h-4 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <span className="font-bold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="riscos" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciamento de Riscos</h2>
            <div className="flex space-x-4">
              <select 
                className="border p-2 rounded"
                value={riskType}
                onChange={(e) => setRiskType(e.target.value)}
              >
                <option value="todos">Todos os tipos</option>
                <option value="fisicos">Físicos</option>
                <option value="quimicos">Químicos</option>
                <option value="biologicos">Biológicos</option>
                <option value="acidentes">Acidentes</option>
                <option value="ergonomicos">Ergonômicos</option>
                <option value="psicossociais">Psicossociais</option>
              </select>
              <Button>+ Novo Risco</Button>
            </div>
          </div>
            
          <Card>
            <CardContent className="pt-6">
              <Tabs 
                defaultValue="identificacao" 
                onValueChange={setActiveRiskTab} 
                value={activeRiskTab}
              >
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="identificacao">1. Identificação</TabsTrigger>
                  <TabsTrigger value="analise">2. Análise</TabsTrigger>
                  <TabsTrigger value="planejamento">3. Planejamento</TabsTrigger>
                  <TabsTrigger value="implementacao">4. Implementação</TabsTrigger>
                  <TabsTrigger value="eficacia">5. Eficácia</TabsTrigger>
                </TabsList>
              
                <TabsContent value="identificacao" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID do Risco</label>
                      <Input type="text" placeholder="PS001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Risco</label>
                      <select className="border p-2 w-full rounded">
                        <option>Psicossocial</option>
                        <option>Físico</option>
                        <option>Químico</option>
                        <option>Biológico</option>
                        <option>Acidente</option>
                        <option>Ergonômico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Identificação</label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Risco</label>
                    <Input type="text" placeholder="Sobrecarga de trabalho no setor de atendimento" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Específica (Psicossocial)</label>
                      <select className="border p-2 w-full rounded">
                        <option>Sobrecarga de trabalho</option>
                        <option>Assédio moral</option>
                        <option>Falta de autonomia</option>
                        <option>Baixo reconhecimento</option>
                        <option>Relações interpessoais</option>
                        <option>Falta de clareza nas funções</option>
                        <option>Trabalho isolado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Possíveis consequências</label>
                      <select className="border p-2 w-full rounded" multiple>
                        <option>Estresse</option>
                        <option>Esgotamento (Burnout)</option>
                        <option>Transtornos de ansiedade</option>
                        <option>Depressão</option>
                        <option>DORT</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                      <select className="border p-2 w-full rounded">
                        <option>Atendimento ao cliente</option>
                        <option>Produção</option>
                        <option>Administrativo</option>
                        <option>RH</option>
                        <option>TI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupos de trabalhadores expostos</label>
                      <Input type="text" placeholder="Atendentes de telemarketing" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fonte ou circunstância</label>
                    <Textarea className="h-24" placeholder="Descreva as condições específicas que caracterizam este risco" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      Salvar e Avançar
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="analise" className="space-y-6">
                  <RiskAnalysisForm />
                </TabsContent>
                
                <TabsContent value="planejamento" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Plano de Ação - PS001 Sobrecarga de trabalho</h3>
                    <Button variant="secondary">+ Nova Ação</Button>
                  </div>
                  
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">O que deve ser feito</th>
                        <th className="p-2 text-left">Quem deve fazer</th>
                        <th className="p-2 text-left">Até quando</th>
                        <th className="p-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Implementar sistema de priorização de tarefas no setor de atendimento</td>
                        <td className="p-2">Maria Silva (RH)</td>
                        <td className="p-2">15/06/2025</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Realizar reuniões semanais com equipe para distribuição de demandas</td>
                        <td className="p-2">Carlos Mendes (Supervisor)</td>
                        <td className="p-2">01/06/2025</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Implementar pausas obrigatórias no sistema de atendimento</td>
                        <td className="p-2">Joana Lima (TI)</td>
                        <td className="p-2">30/06/2025</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 p-4 border rounded">
                    <h3 className="font-bold mb-2">Nova Ação</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">O que deve ser feito</label>
                        <Textarea placeholder="Descreva a ação a ser realizada" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quem deve fazer</label>
                          <select className="border p-2 w-full rounded">
                            <option>Selecione...</option>
                            <option>Maria Silva (RH)</option>
                            <option>João Pereira (SESMT)</option>
                            <option>Carlos Mendes (Supervisor)</option>
                            <option>Joana Lima (TI)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Até quando</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Adicionar Ação</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="implementacao" className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-bold mb-2">Status de Implementação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded shadow">
                        <div className="text-xl font-bold text-red-600">2</div>
                        <div className="text-sm text-gray-600">Não iniciadas</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow">
                        <div className="text-xl font-bold text-amber-600">1</div>
                        <div className="text-sm text-gray-600">Em andamento</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow">
                        <div className="text-xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600">Concluídas</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow">
                        <div className="text-xl font-bold">3</div>
                        <div className="text-sm text-gray-600">Total de ações</div>
                      </div>
                    </div>
                  </div>
                  
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Ação</th>
                        <th className="p-2 text-left">Responsável</th>
                        <th className="p-2 text-center">Prazo</th>
                        <th className="p-2 text-center">Status</th>
                        <th className="p-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Implementar sistema de priorização de tarefas</td>
                        <td className="p-2">Maria Silva (RH)</td>
                        <td className="p-2 text-center">15/06/2025</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Não iniciada</span>
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Realizar reuniões semanais com equipe</td>
                        <td className="p-2">Carlos Mendes (Supervisor)</td>
                        <td className="p-2 text-center">01/06/2025</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Em andamento</span>
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Implementar pausas obrigatórias no sistema</td>
                        <td className="p-2">Joana Lima (TI)</td>
                        <td className="p-2 text-center">30/06/2025</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Não iniciada</span>
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 p-4 border rounded">
                    <h3 className="font-bold mb-2">Atualizar Status da Ação</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Ação</label>
                        <select className="border p-2 w-full rounded">
                          <option>Implementar sistema de priorização de tarefas</option>
                          <option>Realizar reuniões semanais com equipe</option>
                          <option>Implementar pausas obrigatórias no sistema</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Novo Status</label>
                        <select className="border p-2 w-full rounded">
                          <option>Não iniciada</option>
                          <option>Em andamento</option>
                          <option>Concluída</option>
                          <option>Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comentários</label>
                        <Textarea placeholder="Adicione comentários sobre a atualização de status" />
                      </div>
                      <div className="flex justify-end">
                        <Button>Atualizar Status</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="eficacia" className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-bold mb-2">Avaliação da Eficácia</h3>
                    <p className="text-sm text-gray-600">Avalie a eficácia das medidas implementadas para controle do risco PS001 - Sobrecarga de trabalho no setor de atendimento.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Avaliação Geral</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-center">
                          <div className="text-xl font-bold text-amber-600">Antes</div>
                          <div className="mt-2 text-2xl font-bold">8</div>
                          <div className="text-sm text-gray-600">Nível de Risco (Alto)</div>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">Atual</div>
                          <div className="mt-2 text-2xl font-bold">6</div>
                          <div className="text-sm text-gray-600">Nível de Risco (Médio)</div>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">Meta</div>
                          <div className="mt-2 text-2xl font-bold">4</div>
                          <div className="text-sm text-gray-600">Nível de Risco (Médio-Baixo)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Indicadores de Monitoramento</h3>
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Indicador</th>
                          <th className="p-2 text-center">Antes</th>
                          <th className="p-2 text-center">Depois</th>
                          <th className="p-2 text-center">Variação</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Índice de afastamentos relacionados ao estresse</td>
                          <td className="p-2 text-center">7%</td>
                          <td className="p-2 text-center">5%</td>
                          <td className="p-2 text-center text-green-600">-2%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Média de horas extras mensais por funcionário</td>
                          <td className="p-2 text-center">16h</td>
                          <td className="p-2 text-center">10h</td>
                          <td className="p-2 text-center text-green-600">-6h</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Taxa de turnover no setor</td>
                          <td className="p-2 text-center">23%</td>
                          <td className="p-2 text-center">18%</td>
                          <td className="p-2 text-center text-green-600">-5%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Satisfação dos trabalhadores (escala 1-10)</td>
                          <td className="p-2 text-center">5,2</td>
                          <td className="p-2 text-center">6,8</td>
                          <td className="p-2 text-center text-green-600">+1,6</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Avaliação Qualitativa</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">O risco está controlado adequadamente?</label>
                        <select className="border p-2 w-full rounded">
                          <option>Parcialmente controlado</option>
                          <option>Totalmente controlado</option>
                          <option>Não controlado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Eficácia das medidas implementadas</label>
                        <select className="border p-2 w-full rounded">
                          <option>Média</option>
                          <option>Alta</option>
                          <option>Baixa</option>
                          <option>Não avaliado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback dos trabalhadores</label>
                        <Textarea placeholder="Descreva comentários e observações dos trabalhadores sobre as medidas implementadas" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ações adicionais necessárias</label>
                        <Textarea placeholder="Descreva ações complementares para melhorar o controle do risco" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Voltar
                    </Button>
                    <Button>
                      Salvar Avaliação
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Riscos Psicossociais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Funcionalidade em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Módulo de Riscos</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="matrizRisco" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="matrizRisco">Matriz de Risco</TabsTrigger>
                  <TabsTrigger value="categorias">Categorias</TabsTrigger>
                  <TabsTrigger value="geral">Configurações Gerais</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matrizRisco" className="space-y-6">
                  <RiskMatrixSettingsForm />
                </TabsContent>
                
                <TabsContent value="categorias" className="space-y-6">
                  <p className="text-muted-foreground">Configuração de categorias de riscos em desenvolvimento...</p>
                </TabsContent>
                
                <TabsContent value="geral" className="space-y-6">
                  <p className="text-muted-foreground">Configurações gerais em desenvolvimento...</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
