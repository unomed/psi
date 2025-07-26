/**
 * FASE 4: HOOK PARA GERAÇÃO DE PDF
 * RESPONSABILIDADE: Gerar PDFs dos relatórios consolidados
 * 
 * FUNCIONALIDADES:
 * - Captura de componentes com html2canvas
 * - Geração de PDF com jsPDF
 * - Layout otimizado para impressão
 * - Múltiplas páginas automáticas
 * 
 * INTEGRAÇÃO:
 * - Usa dados do useConsolidatedReports
 * - Layout responsivo para PDF
 * - Compatible com sistema de relatórios
 */

import { useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ConsolidatedReportData } from "./useConsolidatedReports";
import { FactorRiskData } from "./useFactorAnalysis";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  includeSectorAnalysis?: boolean;
  includeRoleAnalysis?: boolean;
  includeActionPlans?: boolean;
  includeFactorAnalysis?: boolean;
  includeComplianceNR01?: boolean;
}

export function usePDFGenerator() {
  
  const generatePDF = useCallback(async (
    reportData: ConsolidatedReportData,
    factorData?: FactorRiskData[],
    options: PDFGenerationOptions = {}
  ) => {
    const {
      filename = `relatorio-frprt-${reportData.companyInfo.name}-${format(new Date(), 'yyyy-MM-dd')}`,
      quality = 1.0,
      includeSectorAnalysis = true,
      includeRoleAnalysis = true,
      includeActionPlans = true,
      includeFactorAnalysis = true,
      includeComplianceNR01 = true
    } = options;

    try {
      console.log('📄 [FASE 4] Iniciando geração de PDF:', filename);

      // Criar elemento temporário para o relatório
      const reportElement = createReportElement(reportData, factorData, {
        includeSectorAnalysis,
        includeRoleAnalysis,
        includeActionPlans,
        includeFactorAnalysis,
        includeComplianceNR01
      });

      // Adicionar ao DOM temporariamente
      document.body.appendChild(reportElement);

      // Configurações do html2canvas
      const canvas = await html2canvas(reportElement, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: reportElement.scrollHeight
      });

      // Remover elemento do DOM
      document.body.removeChild(reportElement);

      // Configurações do PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Adicionar primeira página
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download do PDF
      pdf.save(`${filename}.pdf`);

      console.log('✅ [FASE 4] PDF gerado com sucesso:', filename);
      return true;

    } catch (error) {
      console.error('❌ [FASE 4] Erro ao gerar PDF:', error);
      throw error;
    }
  }, []);

  const generateQuickPDF = useCallback(async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento com ID ${elementId} não encontrado`);
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);

      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF rápido:', error);
      throw error;
    }
  }, []);

  return {
    generatePDF,
    generateQuickPDF
  };
}

// Função para criar elemento HTML do relatório
function createReportElement(
  data: ConsolidatedReportData,
  factorData: FactorRiskData[] | undefined, 
  options: { 
    includeSectorAnalysis: boolean; 
    includeRoleAnalysis: boolean; 
    includeActionPlans: boolean;
    includeFactorAnalysis: boolean;
    includeComplianceNR01: boolean;
  }
): HTMLElement {
  const element = document.createElement('div');
  element.style.width = '1200px';
  element.style.backgroundColor = '#ffffff';
  element.style.fontFamily = "'Segoe UI', sans-serif";
  element.style.padding = '40px';
  element.style.color = '#333333';

  const formatDate = (date: string | null) => {
    return date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';
  };

  const formatPercentage = (value: number) => value.toFixed(1) + '%';

  element.innerHTML = `
    <!-- Cabeçalho Técnico -->
    <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #20c997; padding-bottom: 20px;">
      <h1 style="font-size: 32px; color: #495057; margin-bottom: 10px;">📋 RELATÓRIO TÉCNICO FRPRT</h1>
      <p style="font-size: 18px; color: #666; margin-bottom: 5px;"><strong>ANÁLISE DE FATORES DE RISCOS PSICOSSOCIAIS RELACIONADOS AO TRABALHO</strong></p>
      <p style="font-size: 16px; color: #666; margin-bottom: 15px;">Conforme NR-01 - Disposições Gerais e Gerenciamento de Riscos Ocupacionais</p>
      <p style="font-size: 14px; color: #666;">Documento gerado em ${formatDate(new Date().toISOString())} para fins de auditoria do Ministério do Trabalho</p>
    </div>

    <!-- Resumo Executivo -->
    <div style="margin-bottom: 40px; background: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 5px solid #20c997;">
      <h2 style="color: #495057; margin-bottom: 20px;">📋 RESUMO EXECUTIVO</h2>
      <p style="text-align: justify; line-height: 1.6; margin-bottom: 15px;">
        Este relatório apresenta a análise técnica dos fatores de riscos psicossociais relacionados ao trabalho (FRPRT) 
        na empresa <strong>${data.companyInfo.name}</strong>, realizada em conformidade com a NR-01. 
        A avaliação abrangeu ${data.totalStats.totalEmployees} funcionários, dos quais ${data.totalStats.completedAssessments} 
        completaram o processo de avaliação, representando ${formatPercentage(data.totalStats.assessmentCoverage)} de cobertura.
      </p>
      <p style="text-align: justify; line-height: 1.6;">
        <strong>Objetivo:</strong> Identificar, avaliar e classificar os riscos psicossociais presentes no ambiente laboral, 
        estabelecendo medidas preventivas e corretivas necessárias para proteção da saúde mental dos trabalhadores.
      </p>
    </div>

    <!-- Metodologia -->
    <div style="margin-bottom: 40px; background: #e3f2fd; padding: 25px; border-radius: 10px;">
      <h2 style="color: #495057; margin-bottom: 20px;">🔬 METODOLOGIA APLICADA</h2>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1976d2; margin-bottom: 10px;">1. Base Legal e Normativa</h3>
        <p style="text-align: justify; line-height: 1.6;">
          A análise foi conduzida seguindo as diretrizes da NR-01 (Portaria SEPRT n° 6.730/2020), 
          que estabelece as disposições gerais sobre o gerenciamento de riscos ocupacionais.
        </p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1976d2; margin-bottom: 10px;">2. Instrumento de Avaliação</h3>
        <p style="text-align: justify; line-height: 1.6;">
          Utilizou-se questionário estruturado baseado nos 11 fatores psicossociais estabelecidos pela literatura científica 
          e normas técnicas: Demandas de Trabalho, Controle e Autonomia, Condições Ambientais, Relações Socioprofissionais, 
          Reconhecimento e Crescimento, Elo Trabalho-Vida Social, Suporte Social, Clareza do Papel, 
          Reconhecimento e Recompensas, Gestão de Mudanças, e Impactos na Saúde.
        </p>
      </div>
      <div>
        <h3 style="color: #1976d2; margin-bottom: 10px;">3. Classificação de Riscos</h3>
        <p style="text-align: justify; line-height: 1.6;">
          Os riscos foram classificados em quatro níveis: <strong>Baixo</strong> (0-25 pontos), 
          <strong>Médio</strong> (26-50 pontos), <strong>Alto</strong> (51-75 pontos) e 
          <strong>Crítico</strong> (76-100 pontos), conforme escala validada cientificamente.
        </p>
      </div>
    </div>

    <!-- Caracterização da Empresa -->
    <div style="margin-bottom: 40px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
      <h2 style="color: #495057; margin-bottom: 20px;">🏢 CARACTERIZAÇÃO DA EMPRESA</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
        <div><strong>Razão Social:</strong> ${data.companyInfo.name}</div>
        <div><strong>CNPJ:</strong> ${data.companyInfo.cnpj || 'N/A'}</div>
        <div><strong>Responsável Técnico:</strong> ${data.companyInfo.contact_name || 'N/A'}</div>
        <div><strong>Contato:</strong> ${data.companyInfo.contact_email || 'N/A'}</div>
        <div><strong>Setor de Atividade:</strong> ${'N/A'}</div>
        <div><strong>Data da Avaliação:</strong> ${formatDate(new Date().toISOString())}</div>
      </div>
    </div>

    <!-- Análise Quantitativa -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #495057; margin-bottom: 20px;">📊 ANÁLISE QUANTITATIVA</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #1976d2;">${data.totalStats.totalEmployees}</div>
          <div style="font-size: 12px; color: #666;">Total de Funcionários</div>
        </div>
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #2e7d32;">${data.totalStats.completedAssessments}</div>
          <div style="font-size: 12px; color: #666;">Avaliações Concluídas</div>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #f57c00;">${data.totalStats.pendingAssessments}</div>
          <div style="font-size: 12px; color: #666;">Avaliações Pendentes</div>
        </div>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #c2185b;">${formatPercentage(data.totalStats.assessmentCoverage)}</div>
          <div style="font-size: 12px; color: #666;">Cobertura de Avaliação</div>
        </div>
      </div>
    </div>

    <!-- Distribuição de Risco -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #495057; margin-bottom: 20px;">⚠️ CLASSIFICAÇÃO DE RISCOS IDENTIFICADOS</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #0c5460;">${data.riskDistribution.baixo}</div>
          <div style="font-size: 12px; color: #666;">Risco Baixo</div>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #f57c00;">${data.riskDistribution.medio}</div>
          <div style="font-size: 12px; color: #666;">Risco Médio</div>
        </div>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #d32f2f;">${data.riskDistribution.alto}</div>
          <div style="font-size: 12px; color: #666;">Risco Alto</div>
        </div>
        <div style="background: #fce4ec; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #c2185b;">${data.riskDistribution.critico}</div>
          <div style="font-size: 12px; color: #666;">Risco Crítico</div>
        </div>
      </div>
    </div>

    ${options.includeSectorAnalysis ? `
    <!-- Análise por Setor -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">🏭 Análise por Setor</h2>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Setor</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Funcionários</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Avaliações</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Cobertura</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Score Médio</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Nível de Risco</th>
          </tr>
        </thead>
        <tbody>
          ${data.sectorAnalysis.map(sector => `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px; font-weight: 500;">${sector.sectorName}</td>
              <td style="padding: 12px; text-align: center;">${sector.totalEmployees}</td>
              <td style="padding: 12px; text-align: center;">${sector.assessments}</td>
              <td style="padding: 12px; text-align: center;">${formatPercentage(sector.coverage)}</td>
              <td style="padding: 12px; text-align: center;">${sector.averageScore.toFixed(1)}</td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; 
                  ${getRiskLevelStyle(sector.riskLevel)}">${sector.riskLevel.toUpperCase()}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${options.includeRoleAnalysis ? `
    <!-- Análise por Função -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">👥 Análise por Função</h2>
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Função</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Funcionários</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Avaliações</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Cobertura</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Score Médio</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Nível de Risco</th>
          </tr>
        </thead>
        <tbody>
          ${data.roleAnalysis.map(role => `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px; font-weight: 500;">${role.roleName}</td>
              <td style="padding: 12px; text-align: center;">${role.totalEmployees}</td>
              <td style="padding: 12px; text-align: center;">${role.assessments}</td>
              <td style="padding: 12px; text-align: center;">${formatPercentage(role.coverage)}</td>
              <td style="padding: 12px; text-align: center;">${role.averageScore.toFixed(1)}</td>
              <td style="padding: 12px; text-align: center;">
                <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; 
                  ${getRiskLevelStyle(role.riskLevel)}">${role.riskLevel.toUpperCase()}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${options.includeFactorAnalysis && factorData ? `
    <!-- Análise dos 11 Fatores de Risco -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #495057; margin-bottom: 20px;">🔍 ANÁLISE DETALHADA DOS FATORES DE RISCO PSICOSSOCIAL</h2>
      ${factorData.map(factor => `
        <div style="margin-bottom: 25px; background: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px;">
          <h3 style="color: #343a40; margin-bottom: 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 5px;">
            ${factor.factorName}
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
            <div>
              <h4 style="color: #495057; margin-bottom: 10px;">Resultado Geral</h4>
              <div style="text-align: center; padding: 15px; background: ${factor.overall.averageScore >= 75 ? '#ffebee' : factor.overall.averageScore >= 50 ? '#fff3e0' : factor.overall.averageScore >= 25 ? '#fff9c4' : '#e8f5e8'}; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: ${factor.overall.averageScore >= 75 ? '#c62828' : factor.overall.averageScore >= 50 ? '#f57c00' : factor.overall.averageScore >= 25 ? '#f9a825' : '#2e7d32'};">
                  ${factor.overall.averageScore.toFixed(1)}
                </div>
                <div style="font-size: 12px; color: #666;">Score Médio</div>
              </div>
            </div>
            <div>
              <h4 style="color: #495057; margin-bottom: 10px;">Distribuição de Riscos</h4>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <div style="text-align: center; padding: 8px; background: #e8f5e8; border-radius: 4px;">
                  <div style="font-weight: bold; color: #2e7d32;">${factor.overall.baixo}</div>
                  <div style="font-size: 10px;">Baixo</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #fff9c4; border-radius: 4px;">
                  <div style="font-weight: bold; color: #f9a825;">${factor.overall.medio}</div>
                  <div style="font-size: 10px;">Médio</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #fff3e0; border-radius: 4px;">
                  <div style="font-weight: bold; color: #f57c00;">${factor.overall.alto}</div>
                  <div style="font-size: 10px;">Alto</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #ffebee; border-radius: 4px;">
                  <div style="font-weight: bold; color: #c62828;">${factor.overall.critico}</div>
                  <div style="font-size: 10px;">Crítico</div>
                </div>
              </div>
            </div>
          </div>
          ${factor.bySector.length > 0 ? `
          <div style="margin-top: 15px;">
            <h4 style="color: #495057; margin-bottom: 10px;">Análise por Setor</h4>
            <div style="max-height: 120px; overflow-y: auto;">
              ${factor.bySector.map(sector => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f0f0f0;">
                  <span>${sector.sectorName}</span>
                  <span style="font-weight: bold; color: ${sector.averageScore >= 75 ? '#c62828' : sector.averageScore >= 50 ? '#f57c00' : '#2e7d32'};">
                    ${sector.averageScore.toFixed(1)}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${options.includeActionPlans ? `
    <!-- Status dos Planos de Ação -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #495057; margin-bottom: 20px;">📋 PLANOS DE AÇÃO E MEDIDAS IMPLEMENTADAS</h2>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #1976d2;">${data.actionPlansStatus.total}</div>
          <div style="font-size: 12px; color: #666;">Total de Planos</div>
        </div>
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #2e7d32;">${data.actionPlansStatus.completed}</div>
          <div style="font-size: 12px; color: #666;">Concluídos</div>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #f57c00;">${data.actionPlansStatus.inProgress}</div>
          <div style="font-size: 12px; color: #666;">Em Andamento</div>
        </div>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #d32f2f;">${data.actionPlansStatus.overdue}</div>
          <div style="font-size: 12px; color: #666;">Em Atraso</div>
        </div>
      </div>
    </div>
    ` : ''}

    ${options.includeComplianceNR01 ? `
    <!-- Conformidade NR-01 -->
    <div style="margin-bottom: 40px;">
      <h2 style="color: #495057; margin-bottom: 20px;">✅ CONFORMIDADE NR-01 E CRONOGRAMA DE REAVALIAÇÕES</h2>
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
            <strong>Última Avaliação:</strong><br>
            <span style="color: #1976d2; font-weight: bold;">${formatDate(data.complianceMetrics.lastAssessmentDate)}</span>
          </div>
          <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
            <strong>Próxima Avaliação:</strong><br>
            <span style="color: #f57c00; font-weight: bold;">${formatDate(data.complianceMetrics.nextAssessmentDue)}</span>
          </div>
          <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
            <strong>Status de Conformidade:</strong><br>
            <span style="padding: 6px 15px; border-radius: 15px; font-size: 14px; font-weight: bold;
              ${getComplianceStatusStyle(data.complianceMetrics.complianceStatus)}">
              ${getComplianceStatusLabel(data.complianceMetrics.complianceStatus)}
            </span>
          </div>
        </div>
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #2e7d32;">
          <p style="margin: 0; font-weight: bold; color: #2e7d32;">Cronograma de Reavaliações:</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">
            Conforme NR-01, as reavaliações devem ser realizadas periodicamente ou quando houver mudanças significativas 
            nos processos de trabalho, tecnologia ou organização que possam impactar os riscos psicossociais.
          </p>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Parecer Técnico -->
    <div style="margin-bottom: 40px; background: #e8f5e8; padding: 25px; border-radius: 10px; border-left: 5px solid #2e7d32;">
      <h2 style="color: #495057; margin-bottom: 20px;">📝 PARECER TÉCNICO</h2>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2e7d32; margin-bottom: 15px;">Conclusões da Análise</h3>
        <p style="text-align: justify; line-height: 1.6; margin-bottom: 15px;">
          Com base na análise dos fatores de riscos psicossociais relacionados ao trabalho, conclui-se que a empresa 
          <strong>${data.companyInfo.name}</strong> apresenta o seguinte panorama de riscos:
        </p>
        <ul style="margin-left: 20px; line-height: 1.6;">
          <li><strong>Risco Baixo:</strong> ${data.riskDistribution.baixo} funcionários (${((data.riskDistribution.baixo / (data.riskDistribution.baixo + data.riskDistribution.medio + data.riskDistribution.alto + data.riskDistribution.critico)) * 100).toFixed(1)}%)</li>
          <li><strong>Risco Médio:</strong> ${data.riskDistribution.medio} funcionários (${((data.riskDistribution.medio / (data.riskDistribution.baixo + data.riskDistribution.medio + data.riskDistribution.alto + data.riskDistribution.critico)) * 100).toFixed(1)}%)</li>
          <li><strong>Risco Alto:</strong> ${data.riskDistribution.alto} funcionários (${((data.riskDistribution.alto / (data.riskDistribution.baixo + data.riskDistribution.medio + data.riskDistribution.alto + data.riskDistribution.critico)) * 100).toFixed(1)}%)</li>
          <li><strong>Risco Crítico:</strong> ${data.riskDistribution.critico} funcionários (${((data.riskDistribution.critico / (data.riskDistribution.baixo + data.riskDistribution.medio + data.riskDistribution.alto + data.riskDistribution.critico)) * 100).toFixed(1)}%)</li>
        </ul>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2e7d32; margin-bottom: 15px;">Recomendações Técnicas</h3>
        <p style="text-align: justify; line-height: 1.6;">
          Recomenda-se a implementação imediata de medidas preventivas e corretivas para os funcionários 
          classificados em risco alto e crítico. As ações devem priorizar:
        </p>
        <ol style="margin-left: 20px; line-height: 1.6;">
          <li>Redução das demandas excessivas de trabalho</li>
          <li>Melhoria do suporte social e organizacional</li>
          <li>Clarificação de papéis e responsabilidades</li>
          <li>Implementação de programas de reconhecimento</li>
          <li>Melhoria das condições ambientais de trabalho</li>
        </ol>
      </div>
      <div>
        <h3 style="color: #2e7d32; margin-bottom: 15px;">Conformidade Normativa</h3>
        <p style="text-align: justify; line-height: 1.6;">
          Esta análise está em conformidade com as exigências da NR-01 e constitui documento técnico válido 
          para apresentação em auditorias do Ministério do Trabalho e Emprego.
        </p>
      </div>
    </div>

    <!-- Assinatura e Responsabilidade Técnica -->
    <div style="margin-top: 40px; padding: 25px; border: 2px solid #dee2e6; border-radius: 10px;">
      <h2 style="color: #495057; margin-bottom: 20px; text-align: center;">📋 RESPONSABILIDADE TÉCNICA</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <p style="margin-bottom: 40px;"><strong>Responsável Técnico pela Análise</strong></p>
          <div style="border-top: 1px solid #333; margin: 20px auto; width: 200px;"></div>
          <p style="margin: 5px 0; font-size: 14px;">${data.companyInfo.contact_name || 'Nome do Responsável'}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">Registro Profissional</p>
        </div>
        <div style="text-align: center; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <p style="margin-bottom: 40px;"><strong>Representante da Empresa</strong></p>
          <div style="border-top: 1px solid #333; margin: 20px auto; width: 200px;"></div>
          <p style="margin: 5px 0; font-size: 14px;">Nome do Representante</p>
          <p style="margin: 0; font-size: 12px; color: #666;">Cargo/Função</p>
        </div>
      </div>
      <div style="text-align: center; background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <p style="margin: 0; font-size: 12px; color: #666;">
          <strong>Documento gerado em:</strong> ${formatDate(new Date().toISOString())} | 
          <strong>Conforme NR-01</strong> - Portaria SEPRT n° 6.730/2020 | 
          <strong>Válido para auditoria do Ministério do Trabalho</strong>
        </p>
      </div>
    </div>
  `;

  return element;
}

function getRiskLevelStyle(riskLevel: string): string {
  switch (riskLevel) {
    case 'baixo':
      return 'background: #d1ecf1; color: #0c5460;';
    case 'medio':
      return 'background: #fff3e0; color: #f57c00;';
    case 'alto':
      return 'background: #ffebee; color: #d32f2f;';
    case 'critico':
      return 'background: #fce4ec; color: #c2185b;';
    default:
      return 'background: #f5f5f5; color: #666;';
  }
}

function getComplianceStatusStyle(status: string): string {
  switch (status) {
    case 'compliant':
      return 'background: #e8f5e8; color: #2e7d32;';
    case 'attention':
      return 'background: #fff3e0; color: #f57c00;';
    case 'critical':
      return 'background: #ffebee; color: #d32f2f;';
    default:
      return 'background: #f5f5f5; color: #666;';
  }
}

function getComplianceStatusLabel(status: string): string {
  switch (status) {
    case 'compliant':
      return 'CONFORME';
    case 'attention':
      return 'ATENÇÃO';
    case 'critical':
      return 'CRÍTICO';
    default:
      return 'N/A';
  }
}