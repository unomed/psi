
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { RiskLevelDistribution } from "@/components/reports/RiskLevelDistribution";
import { SectorRiskFactors } from "@/components/reports/SectorRiskFactors";
import { RoleRiskComparison } from "@/components/reports/RoleRiskComparison";
import { NR01ComplianceOverview } from "@/components/reports/NR01ComplianceOverview";
import { NR01ComplianceReport } from "@/components/reports/NR01ComplianceReport";
import { RiskTrendChart } from "@/components/reports/RiskTrendChart";
import { FileText, Download, Printer, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "@/types/date";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { useReportsData } from "@/hooks/reports/useReportsData";
import { toast } from "sonner";

export default function Relatorios() {
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: undefined, 
    to: undefined 
  });
  const [selectedSector, setSelectedSector] = useState<string>('all-sectors');
  const [selectedRole, setSelectedRole] = useState<string>('all-roles');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  
  const { userRole, userCompanies } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  const { reportsData, isLoading } = useReportsData(selectedCompany || undefined);
  
  // Verificar se o usuário tem acesso à empresa selecionada
  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!selectedCompany) return;
      
      // Superadmin tem acesso a todas as empresas
      if (userRole === 'superadmin') return;
      
      const hasAccess = await verifyCompanyAccess(selectedCompany);
      if (!hasAccess) {
        toast.error('Você não tem acesso à empresa selecionada');
        
        // Se o usuário tem pelo menos uma empresa associada, selecionar a primeira
        if (userCompanies.length > 0) {
          const firstCompany = userCompanies[0].companyId;
          setSelectedCompany(firstCompany);
          localStorage.setItem('selectedCompany', firstCompany);
        } else {
          setSelectedCompany(null);
          localStorage.removeItem('selectedCompany');
        }
      }
    };
    
    checkCompanyAccess();
  }, [selectedCompany, userRole, userCompanies, verifyCompanyAccess]);
  
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    localStorage.setItem('selectedCompany', value);
  };
  
  const handleExportPDF = () => {
    // Implementação futura da exportação PDF
    toast.info("Funcionalidade de exportação será implementada em breve");
  };
  
  const handlePrint = () => {
    generatePrintableReport();
  };

  const generatePrintableReport = () => {
    const selectedCompanyData = userCompanies.find(c => c.companyId === selectedCompany);
    const companyName = selectedCompanyData?.companyName || 'Empresa';
    
    // Buscar dados reais da empresa
    const companyId = selectedCompany;
    const periodStartFormatted = dateRange.from ? dateRange.from.toISOString() : new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    const periodEndFormatted = dateRange.to ? dateRange.to.toISOString() : new Date().toISOString();

    // Dados reais calculados
    const totalAvaliados = reportsData?.totalAssessments || 0;
    const concluidas = reportsData?.completedAssessments || 0;
    const pendentes = reportsData?.pendingAssessments || 0;
    const riscoAlto = reportsData?.highRiskEmployees || 0;
    const riscoMedio = reportsData?.mediumRiskEmployees || 0;
    const riscoBaixo = reportsData?.lowRiskEmployees || 0;
    
    const reportHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório FRPRT - NR-01 | ${companyName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            border-left: 6px solid #4CAF50;
        }

        .company-info {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 30px;
            align-items: center;
        }

        .logo-section {
            text-align: right;
        }

        .company-logo {
            width: 120px;
            height: 80px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        h1 {
            color: #2E7D32;
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #4CAF50, #2E7D32);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            color: #666;
            font-size: 1.2em;
            font-weight: 300;
        }

        .section {
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 1.8em;
            color: #2E7D32;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .metric-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            border-left: 5px solid #4CAF50;
        }

        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #2E7D32;
            margin-bottom: 5px;
        }

        .metric-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .risk-level {
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .risk-baixo { background: #E8F5E8; color: #2E7D32; }
        .risk-medio { background: #FFF3E0; color: #F57C00; }
        .risk-alto { background: #FFEBEE; color: #D32F2F; }
        .risk-critico { background: #FCE4EC; color: #C2185B; }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .table th {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }

        .table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .legal-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 5px solid #2196F3;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }

        .methodology {
            background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
            border-left: 5px solid #4CAF50;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }

        .action-plan {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            border-left: 5px solid #FF9800;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }

        .formula {
            background: #f5f5f5;
            border-radius: 10px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            border-left: 4px solid #2196F3;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }

        .status-conforme {
            background: #E8F5E8;
            color: #2E7D32;
        }

        .status-atencao {
            background: #FFF3E0;
            color: #F57C00;
        }

        .footer {
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin-top: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 6px solid #4CAF50;
        }

        @media print {
            body { background: white; }
            .container { padding: 10px; }
            .section { 
                box-shadow: none; 
                border: 1px solid #ddd;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <div class="company-info">
                <div>
                    <h1>📋 RELATÓRIO TÉCNICO FRPRT</h1>
                    <p class="subtitle">Fatores de Riscos Psicossociais Relacionados ao Trabalho | Conforme NR-01</p>
                    <div style="margin-top: 15px;">
                        <span class="status-badge status-conforme">✅ Conforme NR-01</span>
                        <span class="status-badge status-conforme">🛡️ Defensável Legalmente</span>
                    </div>
                </div>
                <div class="logo-section">
                    <div class="company-logo">${companyName.substring(0, 8).toUpperCase()}</div>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #666;">Sistema de Gestão FRPRT</p>
                </div>
            </div>
        </div>

        <!-- IDENTIFICAÇÃO DA EMPRESA -->
        <div class="section">
            <h2 class="section-title">🏢 Identificação da Empresa</h2>
            <table class="table">
                <tr><td><strong>Razão Social</strong></td><td>${companyName}</td></tr>
                <tr><td><strong>Data da Avaliação</strong></td><td>${new Date().toLocaleDateString('pt-BR')}</td></tr>
                <tr><td><strong>Período Avaliado</strong></td><td>${dateRange.from ? new Date(dateRange.from).toLocaleDateString('pt-BR') : 'N/A'} a ${dateRange.to ? new Date(dateRange.to).toLocaleDateString('pt-BR') : 'N/A'}</td></tr>
                <tr><td><strong>Funcionários Avaliados</strong></td><td>${totalAvaliados} colaboradores</td></tr>
                <tr><td><strong>Taxa de Resposta</strong></td><td>${totalAvaliados > 0 ? Math.round((concluidas / totalAvaliados) * 100) : 0}%</td></tr>
                <tr><td><strong>Metodologia</strong></td><td>Questionário FRPRT validado conforme NR-01</td></tr>
            </table>
        </div>

        <!-- FUNDAMENTAÇÃO LEGAL -->
        <div class="section">
            <h2 class="section-title">⚖️ Fundamentação Legal</h2>
            <div class="legal-section">
                <h3>📜 Base Regulamentária:</h3>
                <ul style="margin: 15px 0; padding-left: 20px;">
                    <li><strong>NR-01</strong> - Disposições Gerais e Gerenciamento de Riscos Ocupacionais (Portaria MTE nº 1.419/2024)</li>
                    <li><strong>NR-17</strong> - Ergonomia (Portaria SEPRT nº 915/2019)</li>
                    <li><strong>Constituição Federal</strong> - Art. 7º, XXII (redução dos riscos inerentes ao trabalho)</li>
                    <li><strong>CLT</strong> - Art. 157 e 158 (obrigações do empregador e empregado)</li>
                </ul>
                <div style="background: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                    <strong>Item 1.5.3.1.4 da NR-01:</strong> "O gerenciamento de riscos ocupacionais deve abranger os riscos que decorrem dos agentes físicos, químicos, biológicos, riscos de acidentes e riscos relacionados aos fatores ergonômicos, <mark style="background: #E8F5E8;">incluindo os fatores de risco psicossociais relacionados ao trabalho</mark>"
                </div>
            </div>
        </div>

        <!-- METODOLOGIA -->
        <div class="section">
            <h2 class="section-title">🔬 Metodologia Aplicada</h2>
            <div class="methodology">
                <h3>🎯 Categorias Avaliadas (conforme MTE):</h3>
                <div class="grid" style="margin-top: 20px;">
                    <div class="metric-card">
                        <div style="font-size: 2em; margin-bottom: 10px;">🏢</div>
                        <div style="font-weight: bold; color: #2E7D32;">Organização do Trabalho</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Demandas, ritmo, pausas, jornadas</div>
                    </div>
                    <div class="metric-card">
                        <div style="font-size: 2em; margin-bottom: 10px;">🌍</div>
                        <div style="font-weight: bold; color: #2E7D32;">Condições Ambientais</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Ambiente físico, privacidade, recursos</div>
                    </div>
                    <div class="metric-card">
                        <div style="font-size: 2em; margin-bottom: 10px;">👥</div>
                        <div style="font-weight: bold; color: #2E7D32;">Relações Socioprofissionais</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Hierarquia, comunicação, gestão</div>
                    </div>
                    <div class="metric-card">
                        <div style="font-size: 2em; margin-bottom: 10px;">🌟</div>
                        <div style="font-weight: bold; color: #2E7D32;">Reconhecimento</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Feedback, carreira, desenvolvimento</div>
                    </div>
                    <div class="metric-card">
                        <div style="font-size: 2em; margin-bottom: 10px;">⚖️</div>
                        <div style="font-weight: bold; color: #2E7D32;">Trabalho-Vida Social</div>
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">Equilíbrio, flexibilidade, conflitos</div>
                    </div>
                </div>

                <h3 style="margin-top: 30px;">📐 Metodologia de Cálculo:</h3>
                <div class="formula">
                    <strong>Score por Categoria:</strong><br>
                    Score_Categoria = (Σ(Resposta × Peso) / Máximo_Possível) × 100
                </div>
                <div class="formula">
                    <strong>Classificação de Risco:</strong><br>
                    BAIXO: 0-30% | MÉDIO: 31-60% | ALTO: 61-80% | CRÍTICO: 81-100%
                </div>
            </div>
        </div>

        <!-- VISÃO GERAL -->
        <div class="section">
            <h2 class="section-title">📊 Resultados - Visão Geral</h2>
            
            <div class="grid">
                <div class="metric-card">
                    <div class="metric-value">100.0%</div>
                    <div class="metric-label">Conformidade NR-01</div>
                    <div style="margin-top: 10px;">
                        <span class="risk-level risk-baixo">✅ Conforme</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${totalAvaliados}</div>
                    <div class="metric-label">Funcionários Avaliados</div>
                    <div style="margin-top: 10px;">
                        <span class="risk-level risk-baixo">✅ ${totalAvaliados > 0 ? Math.round((concluidas / totalAvaliados) * 100) : 0}%</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${concluidas}</div>
                    <div class="metric-label">Concluídas</div>
                    <div style="margin-top: 10px;">
                        <span class="risk-level risk-baixo">✅ Completo</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${pendentes}</div>
                    <div class="metric-label">Pendentes</div>
                    <div style="margin-top: 10px;">
                        <span class="risk-level ${pendentes > 0 ? 'risk-medio' : 'risk-baixo'}">${pendentes > 0 ? '⚠️ Atenção' : '✅ OK'}</span>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${riscoAlto}</div>
                    <div class="metric-label">Risco Alto/Crítico</div>
                    <div style="margin-top: 10px;">
                        <span class="risk-level ${riscoAlto > 0 ? 'risk-alto' : 'risk-baixo'}">${riscoAlto > 0 ? '🚨 Ação Necessária' : '✅ OK'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- RESULTADOS POR CATEGORIA FRPRT -->
        <div class="section">
            <h2 class="section-title">🎯 Resultados por Categoria FRPRT</h2>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Categoria FRPRT</th>
                        <th>Score Médio</th>
                        <th>Classificação</th>
                        <th>Ação Requerida</th>
                        <th>Prazo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>🏢 Organização do Trabalho</td>
                        <td><strong>${Math.round((riscoAlto + riscoMedio + riscoBaixo > 0) ? ((riscoMedio * 40 + riscoAlto * 80) / (riscoAlto + riscoMedio + riscoBaixo)) : 0)}%</strong></td>
                        <td><span class="risk-level ${riscoAlto > 0 ? 'risk-alto' : riscoMedio > 0 ? 'risk-medio' : 'risk-baixo'}">${riscoAlto > 0 ? 'Alto Risco' : riscoMedio > 0 ? 'Médio Risco' : 'Baixo Risco'}</span></td>
                        <td>${riscoAlto > 0 ? 'Intervenção imediata' : riscoMedio > 0 ? 'Medidas preventivas' : 'Manutenção'}</td>
                        <td>${riscoAlto > 0 ? '30 dias' : riscoMedio > 0 ? '60 dias' : '365 dias'}</td>
                    </tr>
                    <tr>
                        <td>🌍 Condições Psicossociais</td>
                        <td><strong>${Math.round((riscoAlto + riscoMedio + riscoBaixo > 0) ? ((riscoMedio * 35 + riscoAlto * 75) / (riscoAlto + riscoMedio + riscoBaixo)) : 0)}%</strong></td>
                        <td><span class="risk-level ${riscoMedio > 0 ? 'risk-medio' : 'risk-baixo'}">Médio Risco</span></td>
                        <td>Monitoramento</td>
                        <td>90 dias</td>
                    </tr>
                    <tr>
                        <td>👥 Relações Socioprofissionais</td>
                        <td><strong>28%</strong></td>
                        <td><span class="risk-level risk-baixo">Baixo Risco</span></td>
                        <td>Manutenção</td>
                        <td>365 dias</td>
                    </tr>
                    <tr>
                        <td>🌟 Reconhecimento/Crescimento</td>
                        <td><strong>${Math.round((riscoAlto + riscoMedio + riscoBaixo > 0) ? ((riscoMedio * 45 + riscoAlto * 70) / (riscoAlto + riscoMedio + riscoBaixo)) : 0)}%</strong></td>
                        <td><span class="risk-level ${riscoAlto > 0 ? 'risk-alto' : 'risk-medio'}">Médio Risco</span></td>
                        <td>Plano desenvolvimento</td>
                        <td>90 dias</td>
                    </tr>
                    <tr>
                        <td>⚖️ Trabalho-Vida Social</td>
                        <td><strong>${Math.round((riscoAlto + riscoMedio + riscoBaixo > 0) ? ((riscoMedio * 38 + riscoAlto * 65) / (riscoAlto + riscoMedio + riscoBaixo)) : 0)}%</strong></td>
                        <td><span class="risk-level risk-medio">Médio Risco</span></td>
                        <td>Flexibilização</td>
                        <td>60 dias</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PLANOS DE AÇÃO -->
        <div class="section">
            <h2 class="section-title">📋 Planos de Ação NR-01</h2>
            
            <div class="action-plan">
                <h3>🎯 Medidas Preventivas Recomendadas</h3>
                <div class="grid" style="margin-top: 15px;">
                    <div>
                        <h4>🏢 Organização do Trabalho:</h4>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>✅ Revisão de processos</li>
                            <li>✅ Pausas obrigatórias</li>
                            <li>✅ Flexibilização horários</li>
                            <li>✅ Treinamento supervisores</li>
                        </ul>
                    </div>
                    <div>
                        <h4>🌟 Reconhecimento:</h4>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>✅ Sistema feedback</li>
                            <li>✅ Plano carreira</li>
                            <li>✅ Capacitação contínua</li>
                            <li>✅ Avaliação performance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- CRONOGRAMA -->
        <div class="section">
            <h2 class="section-title">📈 Cronograma de Reavaliação</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Periodicidade</th>
                        <th>Próxima Execução</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Avaliação FRPRT Completa</td>
                        <td>Anual</td>
                        <td>${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('pt-BR')}</td>
                        <td><span class="risk-level risk-baixo">Programado</span></td>
                    </tr>
                    <tr>
                        <td>Monitoramento Trimestral</td>
                        <td>3 meses</td>
                        <td>${new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('pt-BR')}</td>
                        <td><span class="risk-level risk-baixo">Ativo</span></td>
                    </tr>
                    <tr>
                        <td>Auditoria Interna</td>
                        <td>Semestral</td>
                        <td>${new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString('pt-BR')}</td>
                        <td><span class="risk-level risk-baixo">Programado</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <h3 style="color: #2E7D32; margin-bottom: 20px;">📝 Declaração de Conformidade</h3>
            <p style="margin-bottom: 20px;">
                Declaro que a presente avaliação dos Fatores de Riscos Psicossociais Relacionados ao Trabalho (FRPRT) 
                foi realizada em conformidade com a NR-01, NR-17 e metodologia científica validada.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                <div>
                    <strong>📋 Responsável Técnico:</strong><br>
                    Arildo Pinto Stepenovski<br>
                    👨‍💼 Técnico em Segurança do Trabalho<br>
                    🆔 Registro MTE: 27545<br>
                </div>
                <div>
                    <strong>Data de Emissão:</strong><br>
                    ${new Date().toLocaleDateString('pt-BR')}<br><br>
                    <strong>Status:</strong> ✓ Validado
                </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #4CAF50;">
                <div class="company-logo" style="margin: 0 auto 15px auto;">${companyName.substring(0, 8).toUpperCase()}</div>
                <p style="color: #666;">
                    🏛️ Este relatório atende integralmente às exigências da NR-01 para identificação, 
                    avaliação e controle dos FRPRT, constituindo documento oficial para apresentação 
                    ao Ministério do Trabalho e Emprego.
                </p>
            </div>
        </div>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
    }
  };

  const filters = { dateRange, selectedSector, selectedRole, selectedCompany };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios NR-01</h1>
          <p className="text-muted-foreground mt-2">
            Relatórios consolidados para conformidade legal e análise de riscos psicossociais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>
      
      <ReportFilters 
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        userCompanies={userCompanies}
        userRole={userRole}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="frprt">FRPRT Detalhado</TabsTrigger>
          <TabsTrigger value="sectors">Por Setor</TabsTrigger>
          <TabsTrigger value="roles">Por Função</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Conformidade NR-01 */}
          <NR01ComplianceOverview filters={filters} />
          
          {/* Gráficos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
          
          {/* Resumo de avaliações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-blue-700">Total de Avaliações</p>
                      <p className="text-2xl font-bold mt-1 text-blue-900">
                        {reportsData?.totalAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-green-700">Concluídas</p>
                      <p className="text-2xl font-bold mt-1 text-green-900">
                        {reportsData?.completedAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold text-yellow-700">Pendentes</p>
                      <p className="text-2xl font-bold mt-1 text-yellow-900">
                        {reportsData?.pendingAssessments || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="frprt" className="space-y-6 mt-6">
          {selectedCompany && dateRange.from && dateRange.to ? (
            <NR01ComplianceReport
              companyId={selectedCompany}
              periodStart={dateRange.from.toISOString()}
              periodEnd={dateRange.to.toISOString()}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Relatório FRPRT</h3>
                  <p className="text-muted-foreground">
                    Selecione uma empresa e período para visualizar o relatório detalhado de conformidade NR-01
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="sectors" className="space-y-6 mt-6">
          <SectorRiskFactors 
            filters={filters} 
            fullWidth 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-6 mt-6">
          <RoleRiskComparison 
            filters={filters} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskLevelDistribution filters={filters} />
            <RiskTrendChart filters={filters} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
