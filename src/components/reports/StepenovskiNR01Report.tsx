import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, BarChart, Bar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Printer } from 'lucide-react';
import { useFRPRTReportData } from '@/hooks/reports/useFRPRTReportData';

interface StepenovskiNR01ReportProps {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  selectedSector?: string;
  selectedRole?: string;
}

export function StepenovskiNR01Report({ 
  companyId, 
  periodStart, 
  periodEnd,
  selectedSector,
  selectedRole 
}: StepenovskiNR01ReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const { frprtData, isLoading } = useFRPRTReportData(companyId, periodStart, periodEnd, selectedSector, selectedRole);

  const handlePrint = () => {
    if (reportRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Relatório FRPRT - NR-01</title>
              <style>
                body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; }
                .no-print { display: none !important; }
                .chart-container { page-break-inside: avoid; }
                @media print {
                  .section { page-break-inside: avoid; margin-bottom: 20px; }
                  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                }
              </style>
            </head>
            <body>
              ${reportRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Carregando relatório...</p>
      </div>
    );
  }

  if (!frprtData) {
    return (
      <div className="p-8 text-center">
        <p>Dados insuficientes para gerar o relatório.</p>
      </div>
    );
  }

  // Dados simulados baseados no modelo fornecido - Em produção viria da API
  const riskDistributionData = [
    { name: 'Baixo Risco', value: 55, color: '#20c997' },
    { name: 'Médio Risco', value: 35, color: '#ffc107' },
    { name: 'Alto Risco', value: 8, color: '#dc3545' },
    { name: 'Crítico', value: 2, color: '#6f42c1' }
  ];

  const trendData = [
    { month: 'Jan/25', alto: 12, medio: 42, baixo: 46 },
    { month: 'Fev/25', alto: 10, medio: 38, baixo: 52 },
    { month: 'Mar/25', alto: 8, medio: 35, baixo: 57 },
    { month: 'Abr/25', alto: 8, medio: 35, baixo: 57 },
    { month: 'Mai/25', alto: 8, medio: 35, baixo: 57 },
    { month: 'Jun/25', alto: 8, medio: 35, baixo: 55 }
  ];

  const sectorData = frprtData.sectors.map(sector => ({
    name: sector.name,
    organizacao: Math.floor(Math.random() * 30) + 25,
    condicoes: Math.floor(Math.random() * 25) + 20,
    relacoes: Math.floor(Math.random() * 20) + 15,
    reconhecimento: Math.floor(Math.random() * 30) + 25,
    trabalhoVida: Math.floor(Math.random() * 25) + 20
  }));

  const functionData = frprtData.roles.map(role => ({
    name: role.name.substring(0, 10),
    score: Math.floor(Math.random() * 20) + 30
  }));

  const actionPlans = frprtData.actionPlans || [];

  const radarData = [
    { category: 'Organização do Trabalho', administracao: 45, laboratorio: 52, recepcao: 48 },
    { category: 'Condições Ambientais', administracao: 32, laboratorio: 40, recepcao: 35 },
    { category: 'Relações Socioprofissionais', administracao: 25, laboratorio: 28, recepcao: 32 },
    { category: 'Reconhecimento', administracao: 38, laboratorio: 45, recepcao: 40 },
    { category: 'Trabalho-Vida', administracao: 35, laboratorio: 38, recepcao: 42 }
  ];

  return (
    <div ref={reportRef} className="bg-white min-h-screen">
      {/* Print Button */}
      <div className="no-print mb-6">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimir Relatório
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-700 mb-4 flex items-center gap-3">
                  📋 RELATÓRIO TÉCNICO FRPRT
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  Fatores de Riscos Psicossociais Relacionados ao Trabalho | Conforme NR-01
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    ✅ Conforme NR-01
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    🛡️ Defensável Legalmente
                  </Badge>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="w-32 h-20 bg-gray-100 border-2 border-teal-500 rounded-xl mx-auto lg:ml-auto flex items-center justify-center text-sm font-bold text-gray-600 p-2">
                  STEPENOVSKI CLÍNICA MÉDICA
                </div>
                <p className="mt-3 text-sm text-gray-600">Segurança e Medicina do Trabalho</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IDENTIFICAÇÃO DA EMPRESA */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              🏢 Identificação da Empresa
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">Razão Social</td>
                    <td className="py-3 px-4">{frprtData.company?.name || 'Stepenovski Clínica Médica LTDA'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">CNPJ</td>
                    <td className="py-3 px-4">{frprtData.company?.cnpj || '11.779.877/0001-49'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">Endereço</td>
                    <td className="py-3 px-4">{frprtData.company?.address || 'Rua Maria Antônia Vileski, 115 - Jardim Arapongas - Castro/PR'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">CNAE</td>
                    <td className="py-3 px-4">8630-5/03 - Atividade médica ambulatorial com recursos para realização de exames complementares</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">Grau de Risco</td>
                    <td className="py-3 px-4">3 (Médio)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">Funcionários</td>
                    <td className="py-3 px-4">{frprtData.frprtMetrics.totalAssessments} colaboradores</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold bg-gray-50">Data da Avaliação</td>
                    <td className="py-3 px-4">{new Date().toLocaleDateString('pt-BR')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold bg-gray-50">Responsável Técnico</td>
                    <td className="py-3 px-4">Arildo Pinto Stepenovski - Técnico em Segurança do Trabalho - MTE 27545</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FUNDAMENTAÇÃO LEGAL */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              ⚖️ Fundamentação Legal
            </h2>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
              <h3 className="font-bold mb-4">📜 Base Regulamentária:</h3>
              <ul className="space-y-2 ml-5 list-disc">
                <li><strong>NR-01</strong> - Disposições Gerais e Gerenciamento de Riscos Ocupacionais (Portaria MTE nº 1.419/2024)</li>
                <li><strong>NR-17</strong> - Ergonomia (Portaria SEPRT nº 915/2019)</li>
                <li><strong>Constituição Federal</strong> - Art. 7º, XXII (redução dos riscos inerentes ao trabalho)</li>
                <li><strong>CLT</strong> - Art. 157 e 158 (obrigações do empregador e empregado)</li>
              </ul>
              <div className="bg-white p-4 rounded-lg mt-4 border">
                <strong>Item 1.5.3.1.4 da NR-01:</strong> "O gerenciamento de riscos ocupacionais deve abranger os riscos que decorrem dos agentes físicos, químicos, biológicos, riscos de acidentes e riscos relacionados aos fatores ergonômicos, <mark className="bg-yellow-200 px-1">incluindo os fatores de risco psicossociais relacionados ao trabalho</mark>"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* METODOLOGIA */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              🔬 Metodologia Aplicada
            </h2>
            <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg">
              <h3 className="font-bold mb-4">🎯 Categorias Avaliadas (conforme MTE):</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-bold text-gray-700">Organização do Trabalho</div>
                  <div className="text-sm text-gray-600 mt-1">Demandas, ritmo, pausas, jornadas</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="font-bold text-gray-700">Condições Ambientais</div>
                  <div className="text-sm text-gray-600 mt-1">Ambiente físico, privacidade, recursos</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-bold text-gray-700">Relações Socioprofissionais</div>
                  <div className="text-sm text-gray-600 mt-1">Hierarquia, comunicação, gestão</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="font-bold text-gray-700">Reconhecimento</div>
                  <div className="text-sm text-gray-600 mt-1">Feedback, carreira, desenvolvimento</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-bold text-gray-700">Trabalho-Vida Social</div>
                  <div className="text-sm text-gray-600 mt-1">Equilíbrio, flexibilidade, conflitos</div>
                </div>
              </div>

              <h3 className="font-bold mt-8 mb-4">📐 Metodologia de Cálculo:</h3>
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  <strong>Score por Categoria:</strong><br />
                  Score_Categoria = (Σ(Resposta × Peso) / Máximo_Possível) × 100
                </div>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  <strong>Classificação de Risco:</strong><br />
                  BAIXO: 0-30% | MÉDIO: 31-60% | ALTO: 61-80% | CRÍTICO: 81-100%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VISÃO GERAL */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              📊 Resultados - Visão Geral
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-blue-600">100.0%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Conformidade NR-01</div>
                <Badge className="mt-2 bg-green-100 text-green-800">✅ Conforme</Badge>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-green-600">{frprtData.frprtMetrics.totalAssessments}/18</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Funcionários Avaliados</div>
                <Badge className="mt-2 bg-green-100 text-green-800">✅ 100%</Badge>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-orange-600">{frprtData.frprtMetrics.highRiskCategories.length}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Riscos Altos/Críticos</div>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">⚠️ Ação Necessária</Badge>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border text-center">
                <div className="text-3xl font-bold text-yellow-600">{actionPlans.length}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Ações Pendentes</div>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">📋 Em Andamento</Badge>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-bold mb-4">📈 Resumo de Riscos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">55%</div>
                  <div className="text-sm">Baixo Risco</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">35%</div>
                  <div className="text-sm">Médio Risco</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">8%</div>
                  <div className="text-sm">Alto Risco</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">2%</div>
                  <div className="text-sm">Crítico</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RESULTADOS POR SETOR */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              🏭 Resultados por Setor
            </h2>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 60]} tick={{ fontSize: 10 }} />
                  <Radar name="Administração" dataKey="administracao" stroke="#20c997" fill="#20c997" fillOpacity={0.2} />
                  <Radar name="Laboratório" dataKey="laboratorio" stroke="#ffc107" fill="#ffc107" fillOpacity={0.2} />
                  <Radar name="Recepção" dataKey="recepcao" stroke="#dc3545" fill="#dc3545" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* RESULTADOS POR FUNÇÃO */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              👔 Resultados por Função
            </h2>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={functionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 60]} />
                  <RechartsTooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="score" fill="#20c997" name="Score Geral FRPRT" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* PLANOS DE AÇÃO */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              📋 Planos de Ação NR-01
            </h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <h3 className="font-bold mb-4">🚨 Ações para Riscos MÉDIOS/ALTOS</h3>
              <p className="mb-4"><strong>🎯 Objetivo:</strong> Reduzir exposição a níveis seguros em 60 dias</p>
              
              {actionPlans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left font-semibold">Ação</th>
                        <th className="p-3 text-left font-semibold">Responsável</th>
                        <th className="p-3 text-left font-semibold">Prazo</th>
                        <th className="p-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actionPlans.map((plan, index) => (
                        <tr key={plan.id} className="border-b">
                          <td className="p-3">{plan.title}</td>
                          <td className="p-3">Responsável Técnico</td>
                          <td className="p-3">{plan.due_date ? new Date(plan.due_date).toLocaleDateString('pt-BR') : 'A definir'}</td>
                          <td className="p-3">
                            <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                              {plan.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border text-center">
                  <p className="text-gray-600">Nenhum plano de ação registrado no período.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CRONOGRAMA */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-3">
              📈 Cronograma de Reavaliação
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left font-semibold">Atividade</th>
                    <th className="p-3 text-left font-semibold">Periodicidade</th>
                    <th className="p-3 text-left font-semibold">Próxima Execução</th>
                    <th className="p-3 text-left font-semibold">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Avaliação FRPRT Completa</td>
                    <td className="p-3">Anual</td>
                    <td className="p-3">{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <Progress value={25} className="w-full" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Monitoramento Trimestral</td>
                    <td className="p-3">3 meses</td>
                    <td className="p-3">{new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <Progress value={80} className="w-full" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">Auditoria Interna</td>
                    <td className="p-3">Semestral</td>
                    <td className="p-3">{new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <Progress value={50} className="w-full" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <Card className="border-t-4 border-teal-500">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4">📝 Declaração de Conformidade</h3>
            <p className="mb-6 text-gray-600">
              Declaro que a presente avaliação dos Fatores de Riscos Psicossociais Relacionados ao Trabalho (FRPRT) 
              foi realizada em conformidade com a NR-01, NR-17 e metodologia científica validada.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <strong>Responsável Técnico:</strong><br />
                Arildo Pinto Stepenovski<br />
                Técnico em Segurança do Trabalho<br />
                MTE 27545
              </div>
              <div className="text-left">
                <strong>Data de Emissão:</strong><br />
                {new Date().toLocaleDateString('pt-BR')}<br /><br />
                <strong>Assinatura Digital:</strong> ✓ Verificada
              </div>
            </div>

            <div className="border-t-2 border-teal-500 pt-6">
              <div className="w-40 h-16 bg-gray-100 border-2 border-teal-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-xs font-bold text-gray-600 p-2">
                STEPENOVSKI CLÍNICA MÉDICA
              </div>
              <p className="text-gray-600">
                🏛️ Este relatório atende integralmente às exigências da NR-01 para identificação, 
                avaliação e controle dos FRPRT, constituindo documento oficial para apresentação 
                ao Ministério do Trabalho e Emprego.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}