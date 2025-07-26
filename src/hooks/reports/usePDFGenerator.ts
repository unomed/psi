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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  includeSectorAnalysis?: boolean;
  includeRoleAnalysis?: boolean;
  includeActionPlans?: boolean;
}

export function usePDFGenerator() {
  
  const generatePDF = useCallback(async (
    reportData: ConsolidatedReportData,
    options: PDFGenerationOptions = {}
  ) => {
    const {
      filename = `relatorio-frprt-${reportData.companyInfo.name}-${format(new Date(), 'yyyy-MM-dd')}`,
      quality = 1.0,
      includeSectorAnalysis = true,
      includeRoleAnalysis = true,
      includeActionPlans = true
    } = options;

    try {
      console.log('📄 [FASE 4] Iniciando geração de PDF:', filename);

      // Criar elemento temporário para o relatório
      const reportElement = createReportElement(reportData, {
        includeSectorAnalysis,
        includeRoleAnalysis,
        includeActionPlans
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
  options: { includeSectorAnalysis: boolean; includeRoleAnalysis: boolean; includeActionPlans: boolean }
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
    <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #20c997; padding-bottom: 20px;">
      <h1 style="font-size: 32px; color: #495057; margin-bottom: 10px;">📋 RELATÓRIO FRPRT</h1>
      <p style="font-size: 18px; color: #666; margin-bottom: 15px;">Fatores de Riscos Psicossociais Relacionados ao Trabalho</p>
      <p style="font-size: 14px; color: #666;">Conforme NR-01 | Gerado em ${formatDate(new Date().toISOString())}</p>
    </div>

    <!-- Informações da Empresa -->
    <div style="margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 10px;">
      <h2 style="color: #495057; margin-bottom: 15px;">🏢 Informações da Empresa</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Razão Social:</strong> ${data.companyInfo.name}</div>
        <div><strong>CNPJ:</strong> ${data.companyInfo.cnpj || 'N/A'}</div>
        <div><strong>Contato:</strong> ${data.companyInfo.contact_name || 'N/A'}</div>
        <div><strong>Email:</strong> ${data.companyInfo.contact_email || 'N/A'}</div>
      </div>
    </div>

    <!-- Estatísticas Gerais -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">📊 Estatísticas Gerais</h2>
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
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">⚠️ Distribuição de Risco</h2>
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

    ${options.includeActionPlans ? `
    <!-- Status dos Planos de Ação -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">📋 Status dos Planos de Ação</h2>
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

    <!-- Compliance -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #495057; margin-bottom: 15px;">✅ Conformidade NR-01</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div>
            <strong>Última Avaliação:</strong><br>
            ${formatDate(data.complianceMetrics.lastAssessmentDate)}
          </div>
          <div>
            <strong>Próxima Avaliação:</strong><br>
            ${formatDate(data.complianceMetrics.nextAssessmentDue)}
          </div>
          <div>
            <strong>Status:</strong><br>
            <span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;
              ${getComplianceStatusStyle(data.complianceMetrics.complianceStatus)}">
              ${getComplianceStatusLabel(data.complianceMetrics.complianceStatus)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #dee2e6; color: #666;">
      <p>Relatório gerado automaticamente pelo Sistema FRPRT</p>
      <p style="font-size: 12px;">Data: ${formatDate(new Date().toISOString())} | Conforme NR-01</p>
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