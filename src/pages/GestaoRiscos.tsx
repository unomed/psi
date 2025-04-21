import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Download, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import RiskMatrixEditor from "@/components/risks/RiskMatrixEditor";

export default function GestaoRiscos() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeRiskTab, setActiveRiskTab] = useState("identificacao");
  const [riskType, setRiskType] = useState("todos");
  const { userRole } = useAuth();

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

      <Tabs defaultValue="dashboard" className="w-full" 
        onValueChange={(value) => setActiveTab(value)}>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-2">Severidade</h3>
                      <select className="border p-2 w-full rounded">
                        <option>Alta - Pode causar afastamento prolongado</option>
                        <option>Média - Pode causar afastamento temporário</option>
                        <option>Baixa - Não causa afastamento</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Probabilidade</h3>
                      <select className="border p-2 w-full rounded">
                        <option>Alta - Muito provável de ocorrer</option>
                        <option>Média - Pode ocorrer</option>
                        <option>Baixa - Pouco provável de ocorrer</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Nível de Risco Calculado</h3>
                    <div className="text-xl font-bold text-red-600">Alto (9) - Crítico</div>
                    <div className="text-sm text-gray-600 mt-1">Requer ação imediata para controle</div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Método de Avaliação Utilizado</h3>
                    <select className="border p-2 w-full rounded">
                      <option>Observação direta da atividade</option>
                      <option>Questionário de avaliação de riscos psicossociais</option>
                      <option>Entrevistas com trabalhadores</option>
                      <option>Workshop com equipe</option>
                      <option>Dados de afastamentos</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Caracterização da Exposição</h3>
                    <Textarea className="h-24" placeholder="Descreva detalhes sobre a exposição (duração, frequência, intensidade)" />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Voltar
                    </Button>
                    <Button>
                      Salvar e Avançar
                    </Button>
                  </div>
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
                        <Button>
                          Adicionar Ação
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Voltar
                    </Button>
                    <Button>
                      Salvar e Avançar
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="implementacao" className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded border border-amber-200 mb-4">
                    <div className="font-bold text-amber-700 mb-1">Acompanhamento de Implementação</div>
                    <div className="text-sm text-amber-700">Este módulo permite o acompanhamento da implementação das ações definidas no plano de ação.</div>
                  </div>
                  
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Ação</th>
                        <th className="p-2 text-left">Responsável</th>
                        <th className="p-2 text-left">Prazo</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Evidência</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Implementar sistema de priorização de tarefas no setor de atendimento</td>
                        <td className="p-2">Maria Silva</td>
                        <td className="p-2">15/06/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Em andamento</span>
                        </td>
                        <td className="p-2">
                          <button className="text-primary underline text-sm">Anexar evidência</button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Realizar reuniões semanais com equipe para distribuição de demandas</td>
                        <td className="p-2">Carlos Mendes</td>
                        <td className="p-2">01/06/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Concluído</span>
                        </td>
                        <td className="p-2">
                          <button className="text-primary underline text-sm">Ver ata da reunião</button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Implementar pausas obrigatórias no sistema de atendimento</td>
                        <td className="p-2">Joana Lima</td>
                        <td className="p-2">30/06/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Não iniciado</span>
                        </td>
                        <td className="p-2">
                          <button className="text-primary underline text-sm">Anexar evidência</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="bg-gray-50 p-4 rounded border">
                    <h3 className="font-bold mb-2">Atualizar Status da Ação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
                        <select className="border p-2 w-full rounded">
                          <option>Implementar sistema de priorização de tarefas</option>
                          <option>Realizar reuniões semanais</option>
                          <option>Implementar pausas obrigatórias</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="border p-2 w-full rounded">
                          <option>Não iniciado</option>
                          <option>Em andamento</option>
                          <option>Concluído</option>
                          <option>Cancelado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Atualização</label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comentários</label>
                      <Textarea placeholder="Descreva o andamento da implementação" />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anexar evidência</label>
                      <div className="flex">
                        <Input type="file" />
                        <Button className="ml-2">Anexar</Button>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button>
                        Atualizar Status
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Voltar
                    </Button>
                    <Button>
                      Salvar e Avançar
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="eficacia" className="space-y-6">
                  <div className="bg-green-50 p-4 rounded border border-green-200 mb-4">
                    <div className="font-bold text-green-700 mb-1">Avaliação de Eficácia</div>
                    <div className="text-sm text-green-700">Avalie a eficácia das medidas implementadas para controlar o risco.</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-2">Resultado da Avaliação</h3>
                      <select className="border p-2 w-full rounded">
                        <option>Selecione...</option>
                        <option>Eficaz - Risco eliminado</option>
                        <option>Parcialmente eficaz - Risco reduzido</option>
                        <option>Ineficaz - Risco permanece</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Data da Avaliação</h3>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Método de Verificação</h3>
                    <select className="border p-2 w-full rounded">
                      <option>Selecione...</option>
                      <option>Observação direta</option>
                      <option>Entrevistas com trabalhadores</option>
                      <option>Questionário de avaliação</option>
                      <option>Análise de indicadores</option>
                      <option>Inspeção de segurança</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Indicadores Monitorados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-500">Taxa de afastamentos</div>
                        <div className="flex justify-between items-end mt-1">
                          <div className="text-xl font-bold text-green-600">-35%</div>
                          <div className="text-xs text-gray-500">Últimos 3 meses</div>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-500">Escala de estresse (média)</div>
                        <div className="flex justify-between items-end mt-1">
                          <div className="text-xl font-bold text-green-600">3.2/10</div>
                          <div className="text-xs text-gray-500">Era 7.8/10</div>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-500">Reclamações relacionadas</div>
                        <div className="flex justify-between items-end mt-1">
                          <div className="text-xl font-bold text-amber-600">-20%</div>
                          <div className="text-xs text-gray-500">Último mês</div>
                        </div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-sm text-gray-500">Produtividade</div>
                        <div className="flex justify-between items-end mt-1">
                          <div className="text-xl font-bold text-green-600">+15%</div>
                          <div className="text-xs text-gray-500">Último mês</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Observações</h3>
                    <Textarea className="h-24" placeholder="Descreva os resultados obtidos e as observações relevantes" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Ações Adicionais Necessárias</h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <input type="radio" name="acoes_adicionais" id="nao_necessarias" />
                      <label htmlFor="nao_necessarias">Não são necessárias ações adicionais</label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input type="radio" name="acoes_adicionais" id="necessarias" />
                      <label htmlFor="necessarias">São necessárias ações adicionais</label>
                    </div>
                    <div className="mt-2">
                      <Textarea className="h-24" placeholder="Descreva as ações adicionais necessárias" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">
                      Voltar
                    </Button>
                    <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
                      Finalizar Avaliação
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <div className="flex space-x-4">
              <select className="border p-2 rounded">
                <option>Últimos 3 meses</option>
                <option>Últimos 6 meses</option>
                <option>Último ano</option>
                <option>Todos</option>
              </select>
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Riscos Psicossociais - Relatório Consolidado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="font-bold mb-2">Distribuição por categoria</div>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    [Gráfico de pizza mostrando distribuição]
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2">Tendência de indicadores (6 meses)</div>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    [Gráfico de linha mostrando tendência]
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Riscos Críticos (Prioridade Alta)</h3>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Descrição</th>
                        <th className="p-2 text-left">Categoria</th>
                        <th className="p-2 text-left">Departamento</th>
                        <th className="p-2 text-left">Nível</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">PS001</td>
                        <td className="p-2">Sobrecarga de trabalho no setor de atendimento</td>
                        <td className="p-2">Sobrecarga</td>
                        <td className="p-2">Atendimento</td>
                        <td className="p-2">Alto (9)</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Em tratamento</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">PS003</td>
                        <td className="p-2">Assédio moral na equipe de vendas</td>
                        <td className="p-2">Assédio</td>
                        <td className="p-2">Vendas</td>
                        <td className="p-2">Alto (9)</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Controlado</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">PS007</td>
                        <td className="p-2">Falta de autonomia na equipe de produção</td>
                        <td className="p-2">Autonomia</td>
                        <td className="p-2">Produção</td>
                        <td className="p-2">Alto (6)</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Não tratado</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Ações em Andamento</h3>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Ação</th>
                        <th className="p-2 text-left">Risco Associado</th>
                        <th className="p-2 text-left">Responsável</th>
                        <th className="p-2 text-left">Prazo</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Implementar sistema de priorização de tarefas</td>
                        <td className="p-2">PS001</td>
                        <td className="p-2">Maria Silva</td>
                        <td className="p-2">15/06/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Em andamento</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Programa de desenvolvimento de lideranças</td>
                        <td className="p-2">PS003</td>
                        <td className="p-2">João Pereira</td>
                        <td className="p-2">30/07/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Em andamento</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Implementar pausas obrigatórias</td>
                        <td className="p-2">PS001</td>
                        <td className="p-2">Joana Lima</td>
                        <td className="p-2">30/06/2025</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Não iniciado</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">Indicadores de Eficácia</h3>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Indicador</th>
                        <th className="p-2 text-left">Antes</th>
                        <th className="p-2 text-left">Atual</th>
                        <th className="p-2 text-left">Variação</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Taxa de afastamentos</td>
                        <td className="p-2">4.2%</td>
                        <td className="p-2">2.7%</td>
                        <td className="p-2">-35%</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Positivo</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Escala de estresse (média)</td>
                        <td className="p-2">7.8</td>
                        <td className="p-2">3.2</td>
                        <td className="p-2">-59%</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Positivo</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Reclamações no Canal de Denúncias</td>
                        <td className="p-2">15</td>
                        <td className="p-2">12</td>
                        <td className="p-2">-20%</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Neutro</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuracoes" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold">Configurações</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Riscos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">Configuração de Matriz</h3>
                  <select className="border p-2 w-full rounded mb-4">
                    <option>Matriz 3x3</option>
                    <option>Matriz 4x4</option>
                    <option>Matriz 5x5</option>
                  </select>
                  
                  <h3 className="font-bold mb-2">Níveis de Severidade</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                      <input type="text" className="border p-1 w-full" defaultValue="Alta - Afastamento prolongado" />
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-amber-500 rounded-sm mr-2"></div>
                      <input type="text" className="border p-1 w-full" defaultValue="Média - Afastamento temporário" />
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                      <input type="text" className="border p-1 w-full" defaultValue="Baixa - Sem afastamento" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Categorias de Riscos Psicossociais</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Sobrecarga de trabalho</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Assédio moral</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Falta de autonomia</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Baixo reconhecimento</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Conflitos interpessoais</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Falta de clareza nas funções</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Trabalho isolado</span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <input type="text" className="border p-2 flex-grow mr-2" placeholder="Nova categoria..." />
                    <Button>Adicionar</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
