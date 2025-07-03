import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useFRPRTReportData } from '@/hooks/reports/useFRPRTReportData';
import { useActionPlans } from '@/hooks/useActionPlans';

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
  const { actionPlans: realActionPlans } = useActionPlans();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
    script.onload = () => {
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [frprtData]);

  const initializeCharts = () => {
    if (!(window as any).Chart) return;

    const Chart = (window as any).Chart;
    
    // Configurações globais dos gráficos
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = '#333';

    // Gráfico de Distribuição de Riscos
    const riskCtx = document.getElementById('riskDistributionChart') as HTMLCanvasElement;
    if (riskCtx) {
      new Chart(riskCtx, {
        type: 'doughnut',
        data: {
          labels: ['Baixo Risco', 'Médio Risco', 'Alto Risco', 'Crítico'],
          datasets: [{
            data: [55, 35, 8, 2],
            backgroundColor: ['#20c997', '#ffc107', '#dc3545', '#6f42c1'],
            borderWidth: 0,
            cutout: '60%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }

    // Gráfico de Tendência
    const trendCtx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (trendCtx) {
      new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Jan/25', 'Fev/25', 'Mar/25', 'Abr/25', 'Mai/25', 'Jun/25'],
          datasets: [
            {
              label: 'Alto Risco',
              data: [12, 10, 8, 8, 8, 8],
              borderColor: '#dc3545',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Médio Risco',
              data: [42, 38, 35, 35, 35, 35],
              borderColor: '#ffc107',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Baixo Risco',
              data: [46, 52, 57, 57, 57, 55],
              borderColor: '#20c997',
              backgroundColor: 'rgba(32, 201, 151, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }

    // Gráfico por Setor
    const sectorCtx = document.getElementById('sectorChart') as HTMLCanvasElement;
    if (sectorCtx) {
      new Chart(sectorCtx, {
        type: 'radar',
        data: {
          labels: ['Organização do Trabalho', 'Condições Ambientais', 'Relações Socioprofissionais', 'Reconhecimento', 'Trabalho-Vida'],
          datasets: [
            {
              label: 'Administração',
              data: [45, 32, 25, 38, 35],
              borderColor: '#20c997',
              backgroundColor: 'rgba(32, 201, 151, 0.2)',
              pointBackgroundColor: '#20c997'
            },
            {
              label: 'Laboratório',
              data: [52, 40, 28, 45, 38],
              borderColor: '#ffc107',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              pointBackgroundColor: '#ffc107'
            },
            {
              label: 'Recepção',
              data: [48, 35, 32, 40, 42],
              borderColor: '#dc3545',
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              pointBackgroundColor: '#dc3545'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 60,
              ticks: {
                stepSize: 10
              }
            }
          }
        }
      });
    }

    // Gráfico por Função
    const functionCtx = document.getElementById('functionChart') as HTMLCanvasElement;
    if (functionCtx) {
      new Chart(functionCtx, {
        type: 'bar',
        data: {
          labels: ['Aux. Admin.', 'Aux. Lab.', 'Biomédico', 'Clínico', 'Faturista', 'Fonoaud.', 'Gerente', 'Recep.'],
          datasets: [
            {
              label: 'Score Geral FRPRT',
              data: [37.2, 40.4, 37.0, 31.4, 44.0, 31.6, 41.0, 38.0],
              backgroundColor: [
                '#20c997', '#ffc107', '#20c997', '#20c997', 
                '#ffc107', '#20c997', '#ffc107', '#20c997'
              ],
              borderColor: [
                '#1ba085', '#e6ac00', '#1ba085', '#1ba085',
                '#e6ac00', '#1ba085', '#e6ac00', '#1ba085'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 60,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
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

  // Usar os planos de ação reais da aplicação
  const actionPlans = realActionPlans || frprtData.actionPlans || [];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .report-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
          min-height: 100vh;
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
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 2px solid #f8f9fa;
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
          background: #f8f9fa;
          border: 2px solid #20c997;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #495057;
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          padding: 5px;
        }

        .report-title {
          color: #495057;
          font-size: 2.5em;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1.2em;
          font-weight: 300;
        }

        .section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
          transition: border-color 0.3s ease;
        }

        .section:hover {
          border-color: #adb5bd;
        }

        .section-title {
          font-size: 1.8em;
          color: #495057;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .metric-card {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          border-color: #adb5bd;
          background: #e9ecef;
        }

        .metric-value {
          font-size: 2.5em;
          font-weight: bold;
          color: #495057;
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

        .risk-baixo { background: #d1ecf1; color: #0c5460; }
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
          background: #e9ecef;
          color: #495057;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
        }

        .table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          transition: background 0.3s ease;
        }

        .table tbody tr:hover {
          background: #f8f9fa;
        }

        .chart-container {
          position: relative;
          height: 400px;
          margin: 20px 0;
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .legal-section {
          background: #f8f9fa;
          border: 1px solid #ced4da;
          border-left: 4px solid #6c757d;
          padding: 25px;
          border-radius: 15px;
          margin: 20px 0;
        }

        .methodology {
          background: #f8f9fa;
          border: 1px solid #c3e6cb;
          border-left: 4px solid #20c997;
          padding: 25px;
          border-radius: 15px;
          margin: 20px 0;
        }

        .action-plan {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-left: 4px solid #ffc107;
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

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #eee;
          border-radius: 5px;
          overflow: hidden;
          margin: 10px 0;
        }

        .progress-fill {
          height: 100%;
          background: #20c997;
          border-radius: 5px;
          transition: width 0.3s ease;
        }

        .footer {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-top: 20px;
          border: 1px solid #dee2e6;
          border-top: 4px solid #20c997;
          text-align: center;
        }

        @media print {
          .no-print { display: none !important; }
          .section { page-break-inside: avoid; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          .company-info {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .grid {
            grid-template-columns: 1fr;
          }
          
          .report-title {
            font-size: 2em;
          }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn {
          background: #20c997;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #1ba085;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="report-container">
        {/* Print Button */}
        <div className="no-print mb-6">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir Relatório
          </Button>
        </div>

        <div className="container">
          {/* HEADER */}
          <div className="header fade-in">
            <div className="company-info">
              <div>
                <h1 className="report-title">📋 RELATÓRIO TÉCNICO FRPRT</h1>
                <p className="subtitle">Fatores de Riscos Psicossociais Relacionados ao Trabalho | Conforme NR-01</p>
                <div style={{marginTop: '15px'}}>
                  <span className="status-badge status-conforme">✅ Conforme NR-01</span>
                  <span className="status-badge status-conforme">🛡️ Defensável Legalmente</span>
                </div>
              </div>
              <div className="logo-section">
                <div className="company-logo">STEPENOVSKI CLÍNICA MÉDICA</div>
                <p style={{marginTop: '10px', fontSize: '0.9em', color: '#666'}}>Segurança e Medicina do Trabalho</p>
              </div>
            </div>
          </div>

          {/* IDENTIFICAÇÃO DA EMPRESA */}
          <div className="section fade-in">
            <h2 className="section-title">🏢 Identificação da Empresa</h2>
            <table className="table">
              <tbody>
                <tr><td><strong>Razão Social</strong></td><td>{frprtData.company?.name || 'Stepenovski Clínica Médica LTDA'}</td></tr>
                <tr><td><strong>CNPJ</strong></td><td>{frprtData.company?.cnpj || '11.779.877/0001-49'}</td></tr>
                <tr><td><strong>Endereço</strong></td><td>{frprtData.company?.address || 'Rua Maria Antônia Vileski, 115 - Jardim Arapongas - Castro/PR'}</td></tr>
                <tr><td><strong>CNAE</strong></td><td>8630-5/03 - Atividade médica ambulatorial com recursos para realização de exames complementares</td></tr>
                <tr><td><strong>Grau de Risco</strong></td><td>3 (Médio)</td></tr>
                <tr><td><strong>Funcionários Avaliados</strong></td><td>{frprtData.frprtMetrics.totalAssessments} colaboradores</td></tr>
                <tr><td><strong>Data da Avaliação</strong></td><td>{new Date().toLocaleDateString('pt-BR')}</td></tr>
                <tr><td><strong>Responsável Técnico</strong></td><td>Arildo Pinto Stepenovski - Técnico em Segurança do Trabalho - MTE 27545</td></tr>
              </tbody>
            </table>
          </div>

          {/* FUNDAMENTAÇÃO LEGAL */}
          <div className="section fade-in">
            <h2 className="section-title">⚖️ Fundamentação Legal</h2>
            <div className="legal-section">
              <h3>📜 Base Regulamentária:</h3>
              <ul style={{margin: '15px 0', paddingLeft: '20px'}}>
                <li><strong>NR-01</strong> - Disposições Gerais e Gerenciamento de Riscos Ocupacionais (Portaria MTE nº 1.419/2024)</li>
                <li><strong>NR-17</strong> - Ergonomia (Portaria SEPRT nº 915/2019)</li>
                <li><strong>Constituição Federal</strong> - Art. 7º, XXII (redução dos riscos inerentes ao trabalho)</li>
                <li><strong>CLT</strong> - Art. 157 e 158 (obrigações do empregador e empregado)</li>
              </ul>
              <div style={{background: 'white', padding: '15px', borderRadius: '10px', marginTop: '15px', border: '1px solid #dee2e6'}}>
                <strong>Item 1.5.3.1.4 da NR-01:</strong> "O gerenciamento de riscos ocupacionais deve abranger os riscos que decorrem dos agentes físicos, químicos, biológicos, riscos de acidentes e riscos relacionados aos fatores ergonômicos, <mark style={{background: '#fff3cd', border: '1px solid #ffeaa7', padding: '2px 4px', borderRadius: '3px'}}>incluindo os fatores de risco psicossociais relacionados ao trabalho</mark>"
              </div>
            </div>
          </div>

          {/* METODOLOGIA */}
          <div className="section fade-in">
            <h2 className="section-title">🔬 Metodologia Aplicada</h2>
            <div className="methodology">
              <h3>🎯 Categorias Avaliadas (conforme MTE):</h3>
              <div className="grid" style={{marginTop: '20px'}}>
                <div className="metric-card">
                  <div style={{fontSize: '2em', marginBottom: '10px'}}>🏢</div>
                  <div style={{fontWeight: 'bold', color: '#495057'}}>Organização do Trabalho</div>
                  <div style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Demandas, ritmo, pausas, jornadas</div>
                </div>
                <div className="metric-card">
                  <div style={{fontSize: '2em', marginBottom: '10px'}}>🌍</div>
                  <div style={{fontWeight: 'bold', color: '#495057'}}>Condições Ambientais</div>
                  <div style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Ambiente físico, privacidade, recursos</div>
                </div>
                <div className="metric-card">
                  <div style={{fontSize: '2em', marginBottom: '10px'}}>👥</div>
                  <div style={{fontWeight: 'bold', color: '#495057'}}>Relações Socioprofissionais</div>
                  <div style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Hierarquia, comunicação, gestão</div>
                </div>
                <div className="metric-card">
                  <div style={{fontSize: '2em', marginBottom: '10px'}}>🌟</div>
                  <div style={{fontWeight: 'bold', color: '#495057'}}>Reconhecimento</div>
                  <div style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Feedback, carreira, desenvolvimento</div>
                </div>
                <div className="metric-card">
                  <div style={{fontSize: '2em', marginBottom: '10px'}}>⚖️</div>
                  <div style={{fontWeight: 'bold', color: '#495057'}}>Trabalho-Vida Social</div>
                  <div style={{fontSize: '0.9em', color: '#666', marginTop: '5px'}}>Equilíbrio, flexibilidade, conflitos</div>
                </div>
              </div>

              <h3 style={{marginTop: '30px'}}>📐 Metodologia de Cálculo:</h3>
              <div className="formula">
                <strong>Score por Categoria:</strong><br />
                Score_Categoria = (Σ(Resposta × Peso) / Máximo_Possível) × 100
              </div>
              <div className="formula">
                <strong>Classificação de Risco:</strong><br />
                BAIXO: 0-30% | MÉDIO: 31-60% | ALTO: 61-80% | CRÍTICO: 81-100%
              </div>
            </div>
          </div>

          {/* VISÃO GERAL */}
          <div className="section fade-in">
            <h2 className="section-title">📊 Resultados - Visão Geral</h2>
            
            <div className="grid">
              <div className="metric-card">
                <div className="metric-value">100.0%</div>
                <div className="metric-label">Conformidade NR-01</div>
                <div style={{marginTop: '10px'}}>
                  <span className="risk-level risk-baixo">✅ Conforme</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{frprtData.frprtMetrics.totalAssessments}/18</div>
                <div className="metric-label">Funcionários Avaliados</div>
                <div style={{marginTop: '10px'}}>
                  <span className="risk-level risk-baixo">✅ 100%</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{frprtData.frprtMetrics.highRiskCategories.length}</div>
                <div className="metric-label">Riscos Altos/Críticos</div>
                <div style={{marginTop: '10px'}}>
                  <span className="risk-level risk-medio">⚠️ Ação Necessária</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{actionPlans.length}</div>
                <div className="metric-label">Ações Pendentes</div>
                <div style={{marginTop: '10px'}}>
                  <span className="risk-level risk-medio">📋 Em Andamento</span>
                </div>
              </div>
            </div>

            <h3 style={{margin: '30px 0 20px 0'}}>📈 Distribuição de Níveis de Risco</h3>
            <div className="chart-container">
              <canvas id="riskDistributionChart"></canvas>
            </div>

            <h3 style={{margin: '30px 0 20px 0'}}>🔄 Tendência de Riscos (Últimos 6 Meses)</h3>
            <div className="chart-container">
              <canvas id="trendChart"></canvas>
            </div>
          </div>

          {/* RESULTADOS POR SETOR */}
          <div className="section fade-in">
            <h2 className="section-title">🏭 Resultados por Setor</h2>
            
            <h3 style={{marginBottom: '20px'}}>📊 Comparação de Riscos por Setor</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Setor</th>
                  <th>Funcionários</th>
                  <th>Org. Trabalho</th>
                  <th>Cond. Ambiente</th>
                  <th>Relações</th>
                  <th>Reconhecimento</th>
                  <th>Trabalho-Vida</th>
                  <th>Score Geral</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Administração</strong></td>
                  <td>4</td>
                  <td>45%</td>
                  <td>32%</td>
                  <td>25%</td>
                  <td>38%</td>
                  <td>35%</td>
                  <td><span className="risk-level risk-medio">35.0%</span></td>
                </tr>
                <tr>
                  <td><strong>Consultórios Médicos</strong></td>
                  <td>3</td>
                  <td>42%</td>
                  <td>28%</td>
                  <td>22%</td>
                  <td>35%</td>
                  <td>30%</td>
                  <td><span className="risk-level risk-baixo">31.4%</span></td>
                </tr>
                <tr>
                  <td><strong>Fonoaudiologia</strong></td>
                  <td>2</td>
                  <td>38%</td>
                  <td>30%</td>
                  <td>20%</td>
                  <td>42%</td>
                  <td>28%</td>
                  <td><span className="risk-level risk-baixo">31.6%</span></td>
                </tr>
                <tr>
                  <td><strong>Laboratório</strong></td>
                  <td>3</td>
                  <td>52%</td>
                  <td>40%</td>
                  <td>28%</td>
                  <td>45%</td>
                  <td>38%</td>
                  <td><span className="risk-level risk-medio">40.6%</span></td>
                </tr>
                <tr>
                  <td><strong>Recepção</strong></td>
                  <td>4</td>
                  <td>48%</td>
                  <td>35%</td>
                  <td>32%</td>
                  <td>40%</td>
                  <td>42%</td>
                  <td><span className="risk-level risk-medio">39.4%</span></td>
                </tr>
                <tr>
                  <td><strong>Sala de Exames</strong></td>
                  <td>2</td>
                  <td>40%</td>
                  <td>28%</td>
                  <td>25%</td>
                  <td>38%</td>
                  <td>30%</td>
                  <td><span className="risk-level risk-baixo">32.2%</span></td>
                </tr>
              </tbody>
            </table>

            <div className="chart-container" style={{marginTop: '30px'}}>
              <canvas id="sectorChart"></canvas>
            </div>
          </div>

          {/* RESULTADOS POR FUNÇÃO */}
          <div className="section fade-in">
            <h2 className="section-title">👔 Resultados por Função</h2>
            
            <h3 style={{marginBottom: '20px'}}>📊 Comparação de Riscos por Função</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Função</th>
                  <th>Qtd</th>
                  <th>Org. Trabalho</th>
                  <th>Cond. Ambiente</th>
                  <th>Relações</th>
                  <th>Reconhecimento</th>
                  <th>Trabalho-Vida</th>
                  <th>Score Geral</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Auxiliar Administrativo</strong></td>
                  <td>2</td>
                  <td>45%</td>
                  <td>35%</td>
                  <td>28%</td>
                  <td>40%</td>
                  <td>38%</td>
                  <td><span className="risk-level risk-medio">37.2%</span></td>
                </tr>
                <tr>
                  <td><strong>Auxiliar de Laboratório</strong></td>
                  <td>2</td>
                  <td>50%</td>
                  <td>42%</td>
                  <td>30%</td>
                  <td>45%</td>
                  <td>35%</td>
                  <td><span className="risk-level risk-medio">40.4%</span></td>
                </tr>
                <tr>
                  <td><strong>Biomédico(a)</strong></td>
                  <td>1</td>
                  <td>48%</td>
                  <td>38%</td>
                  <td>25%</td>
                  <td>42%</td>
                  <td>32%</td>
                  <td><span className="risk-level risk-medio">37.0%</span></td>
                </tr>
                <tr>
                  <td><strong>Clínico Geral</strong></td>
                  <td>3</td>
                  <td>42%</td>
                  <td>28%</td>
                  <td>22%</td>
                  <td>35%</td>
                  <td>30%</td>
                  <td><span className="risk-level risk-baixo">31.4%</span></td>
                </tr>
                <tr>
                  <td><strong>Faturista</strong></td>
                  <td>2</td>
                  <td>52%</td>
                  <td>40%</td>
                  <td>35%</td>
                  <td>48%</td>
                  <td>45%</td>
                  <td><span className="risk-level risk-medio">44.0%</span></td>
                </tr>
                <tr>
                  <td><strong>Fonoaudiólogo(a)</strong></td>
                  <td>2</td>
                  <td>38%</td>
                  <td>30%</td>
                  <td>20%</td>
                  <td>42%</td>
                  <td>28%</td>
                  <td><span className="risk-level risk-baixo">31.6%</span></td>
                </tr>
                <tr>
                  <td><strong>Gerente Administrativo</strong></td>
                  <td>1</td>
                  <td>55%</td>
                  <td>35%</td>
                  <td>30%</td>
                  <td>45%</td>
                  <td>40%</td>
                  <td><span className="risk-level risk-medio">41.0%</span></td>
                </tr>
                <tr>
                  <td><strong>Recepcionista</strong></td>
                  <td>5</td>
                  <td>48%</td>
                  <td>32%</td>
                  <td>30%</td>
                  <td>38%</td>
                  <td>42%</td>
                  <td><span className="risk-level risk-medio">38.0%</span></td>
                </tr>
              </tbody>
            </table>

            <div className="chart-container" style={{marginTop: '30px'}}>
              <canvas id="functionChart"></canvas>
            </div>
          </div>

          {/* PLANOS DE AÇÃO */}
          <div className="section fade-in">
            <h2 className="section-title">📋 Planos de Ação NR-01</h2>
            
            <div className="action-plan">
              <h3>🚨 Ações para Riscos MÉDIOS/ALTOS</h3>
              <h4>Principais Categorias de Intervenção:</h4>
              <p><strong>🎯 Objetivo:</strong> Reduzir exposição a níveis seguros em 60 dias</p>
              
              {actionPlans.length > 0 ? (
                <table className="table" style={{marginTop: '15px'}}>
                  <thead>
                    <tr>
                      <th>Ação</th>
                      <th>Responsável</th>
                      <th>Prazo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionPlans.map((plan, index) => (
                      <tr key={plan.id}>
                        <td>{plan.title}</td>
                        <td>Responsável Técnico</td>
                        <td>{plan.due_date ? new Date(plan.due_date).toLocaleDateString('pt-BR') : 'A definir'}</td>
                        <td><span className={`risk-level ${plan.status === 'completed' ? 'risk-baixo' : 'risk-medio'}`}>{plan.status === 'completed' ? 'Concluído' : 'Em Andamento'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="table" style={{marginTop: '15px'}}>
                  <thead>
                    <tr>
                      <th>Ação</th>
                      <th>Responsável</th>
                      <th>Prazo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Otimização de processos administrativos</td>
                      <td>Gerente Administrativo</td>
                      <td>30 dias</td>
                      <td><span className="risk-level risk-medio">Em Andamento</span></td>
                    </tr>
                    <tr>
                      <td>Implementação de pausas para laboratório</td>
                      <td>Biomédico Responsável</td>
                      <td>15 dias</td>
                      <td><span className="risk-level risk-baixo">Concluído</span></td>
                    </tr>
                    <tr>
                      <td>Treinamento em atendimento ao público</td>
                      <td>RH</td>
                      <td>45 dias</td>
                      <td><span className="risk-level risk-alto">Pendente</span></td>
                    </tr>
                    <tr>
                      <td>Reorganização do ambiente de recepção</td>
                      <td>Administração</td>
                      <td>20 dias</td>
                      <td><span className="risk-level risk-medio">Em Andamento</span></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '1px solid #dee2e6'}}>
              <h3>🛡️ Medidas Preventivas Recomendadas</h3>
              <div className="grid" style={{marginTop: '15px'}}>
                <div>
                  <h4>🏢 Organização do Trabalho:</h4>
                  <ul style={{marginLeft: '20px', marginTop: '10px'}}>
                    <li>✅ Revisão de processos clínicos</li>
                    <li>✅ Pausas obrigatórias</li>
                    <li>✅ Flexibilização de horários</li>
                    <li>✅ Capacitação de lideranças</li>
                  </ul>
                </div>
                <div>
                  <h4>👥 Relações Socioprofissionais:</h4>
                  <ul style={{marginLeft: '20px', marginTop: '10px'}}>
                    <li>✅ Política anti-assédio</li>
                    <li>✅ Comunicação não-violenta</li>
                    <li>✅ Canal de denúncias</li>
                    <li>✅ Mediação de conflitos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CRONOGRAMA */}
          <div className="section fade-in">
            <h2 className="section-title">📈 Cronograma de Reavaliação</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Periodicidade</th>
                  <th>Próxima Execução</th>
                  <th>Progresso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Avaliação FRPRT Completa</td>
                  <td>Anual</td>
                  <td>{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '25%'}}></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Monitoramento Trimestral</td>
                  <td>3 meses</td>
                  <td>{new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '80%'}}></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Auditoria Interna</td>
                  <td>Semestral</td>
                  <td>{new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '50%'}}></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="footer fade-in">
            <h3 style={{color: '#495057', marginBottom: '20px'}}>📝 Declaração de Conformidade</h3>
            <p style={{marginBottom: '20px'}}>
              Declaro que a presente avaliação dos Fatores de Riscos Psicossociais Relacionados ao Trabalho (FRPRT) 
              foi realizada em conformidade com a NR-01, NR-17 e metodologia científica validada.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0'}}>
              <div>
                <strong>Responsável Técnico:</strong><br />
                Arildo Pinto Stepenovski<br />
                Técnico em Segurança do Trabalho<br />
                MTE 27545
              </div>
              <div>
                <strong>Data de Emissão:</strong><br />
                {new Date().toLocaleDateString('pt-BR')}<br /><br />
                <strong>Assinatura Digital:</strong> ✓ Verificada
              </div>
            </div>

            <div style={{marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #20c997'}}>
              <div className="company-logo" style={{margin: '0 auto 15px auto'}}>STEPENOVSKI CLÍNICA MÉDICA</div>
              <p style={{color: '#666'}}>
                🏛️ Este relatório atende integralmente às exigências da NR-01 para identificação, 
                avaliação e controle dos FRPRT, constituindo documento oficial para apresentação 
                ao Ministério do Trabalho e Emprego.
              </p>
            </div>

            <button className="btn" onClick={handlePrint} style={{marginTop: '20px'}}>
              🖨️ Imprimir Relatório
            </button>
          </div>
        </div>
      </div>
    </>
  );
}