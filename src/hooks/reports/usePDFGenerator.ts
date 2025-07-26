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

      // Configurações do PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm

      // Configurar PDF com quebras de página adequadas
      const sections = reportElement.querySelectorAll('.pdf-page-break');
      
      if (sections.length > 0) {
        // Gerar PDF com quebras de página por seção
        for (let i = 0; i < sections.length; i++) {
          if (i > 0) pdf.addPage();
          
          const section = sections[i] as HTMLElement;
          const sectionCanvas = await html2canvas(section, {
            scale: quality,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 1200
          });
          
          const sectionImgHeight = (sectionCanvas.height * imgWidth) / sectionCanvas.width;
          pdf.addImage(sectionCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, sectionImgHeight);
        }
      } else {
        // Método original para compatibilidade
        const canvas = await html2canvas(reportElement, {
          scale: quality,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 1200,
          height: reportElement.scrollHeight
        });

        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      // Remover elemento do DOM
      document.body.removeChild(reportElement);

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
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px', 
      backgroundColor: '#ffffff',
      color: '#333333'
    }}>
      
      {/* CABEÇALHO TÉCNICO */}
      <div class="pdf-page-break" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a365d', marginBottom: '10px' }}>
          RELATÓRIO TÉCNICO DE AVALIAÇÃO DOS FATORES DE RISCO PSICOSSOCIAL NO TRABALHO (FRPT)
        </h1>
        <h2 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '20px' }}>
          Análise Conforme NR-01 - Programa de Gerenciamento de Riscos (PGR)
        </h2>
        <div style={{ fontSize: '14px', color: '#4a5568' }}>
          <p><strong>Empresa:</strong> ${data.companyInfo.name}</p>
          <p><strong>CNPJ:</strong> ${data.companyInfo.cnpj || 'Não informado'}</p>
          <p><strong>Data do Relatório:</strong> ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}</p>
        </div>
      </div>

      {/* RESUMO EXECUTIVO */}
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          1. RESUMO EXECUTIVO
        </h2>
        <div style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
          <p style={{ marginBottom: '15px' }}>
            Este relatório técnico apresenta a análise completa dos Fatores de Risco Psicossocial no Trabalho (FRPT) 
            da empresa <strong>${data.companyInfo.name}</strong>, realizada em conformidade com a NR-01 - Disposições Gerais 
            e Gerenciamento de Riscos Ocupacionais (Portaria SEPRT nº 6.730/2020).
          </p>
          <p style={{ marginBottom: '15px' }}>
            A avaliação abrangeu <strong>${data.totalStats.totalEmployees} funcionários</strong>, dos quais 
            <strong>${data.totalStats.completedAssessments}</strong> completaram o processo de avaliação, 
            representando uma cobertura de <strong>${formatPercentage(data.totalStats.assessmentCoverage)}</strong>.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>OBJETIVO:</strong> Identificar, avaliar e classificar os riscos psicossociais presentes no ambiente 
            de trabalho, estabelecendo medidas preventivas e corretivas necessárias para a proteção da saúde mental 
            dos trabalhadores.
          </p>
        </div>
      </div>

      {/* METODOLOGIA */}
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          2. METODOLOGIA
        </h2>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
            2.1 Base Legal e Normativa
          </h3>
          <p style={{ marginBottom: '15px', textAlign: 'justify' }}>
            A análise foi conduzida em estrita observância às disposições da NR-01, que estabelece as diretrizes 
            para o gerenciamento de riscos ocupacionais, incluindo os fatores psicossociais relacionados ao trabalho.
          </p>
          
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
            2.2 Instrumento de Avaliação
          </h3>
          <p style={{ marginBottom: '15px', textAlign: 'justify' }}>
            Utilizou-se questionário estruturado baseado nos 11 fatores psicossociais estabelecidos pela literatura 
            científica internacional e adaptado à realidade brasileira:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li>Demandas de Trabalho</li>
            <li>Controle e Autonomia</li>
            <li>Condições Ambientais</li>
            <li>Relações Socioprofissionais</li>
            <li>Reconhecimento e Crescimento</li>
            <li>Elo Trabalho-Vida Social</li>
            <li>Suporte Social</li>
            <li>Clareza do Papel</li>
            <li>Reconhecimento e Recompensas</li>
            <li>Gestão de Mudanças</li>
            <li>Impactos na Saúde</li>
          </ul>
          
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
            2.3 Classificação de Riscos
          </h3>
          <p style={{ marginBottom: '15px', textAlign: 'justify' }}>
            Os riscos foram classificados em quatro níveis: <strong>Baixo (0-25 pontos)</strong>, 
            <strong>Médio (26-50 pontos)</strong>, <strong>Alto (51-75 pontos)</strong> e 
            <strong>Crítico (76-100 pontos)</strong>, conforme escala psicométrica validada.
          </p>
        </div>
      </div>

      {/* CARACTERIZAÇÃO DA EMPRESA */}
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          3. CARACTERIZAÇÃO DA EMPRESA
        </h2>
        <div style={{ fontSize: '14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold', width: '40%' }}>Razão Social:</td>
              <td style={{ padding: '10px' }}>${data.companyInfo.name}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>CNPJ:</td>
              <td style={{ padding: '10px' }}>${data.companyInfo.cnpj || 'Não informado'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Total de Funcionários:</td>
              <td style={{ padding: '10px' }}>${data.totalStats.totalEmployees}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Data da Avaliação:</td>
              <td style={{ padding: '10px' }}>${formatDate(new Date().toISOString())}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>Responsável Técnico:</td>
              <td style={{ padding: '10px' }}>${data.companyInfo.contact_name || 'A ser informado'}</td>
            </tr>
          </table>
        </div>
      </div>

      {/* ANÁLISE QUANTITATIVA */}
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          4. ANÁLISE QUANTITATIVA DOS RESULTADOS
        </h2>
        
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
          4.1 Dados Gerais da Avaliação
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>${data.totalStats.totalEmployees}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total de Funcionários</div>
          </div>
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>${data.totalStats.completedAssessments}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Avaliações Concluídas</div>
          </div>
          <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>${data.totalStats.pendingAssessments}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Funcionários Não Avaliados</div>
          </div>
          <div style={{ background: '#fce4ec', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c2185b' }}>${formatPercentage(data.totalStats.assessmentCoverage)}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Cobertura de Avaliação</div>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
          4.2 Distribuição de Riscos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: '#d1ecf1', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c5460' }}>${data.riskDistribution.baixo}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Risco Baixo</div>
          </div>
          <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57c00' }}>${data.riskDistribution.medio}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Risco Médio</div>
          </div>
          <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d32f2f' }}>${data.riskDistribution.alto}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Risco Alto</div>
          </div>
          <div style={{ background: '#fce4ec', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2185b' }}>${data.riskDistribution.critico}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Risco Crítico</div>
          </div>
        </div>

        ${options.includeSectorAnalysis ? `
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
          4.3 Análise por Setor
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Setor</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Funcionários</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Avaliações</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Cobertura</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Score Médio</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Nível de Risco</th>
            </tr>
          </thead>
          <tbody>
            ${data.sectorAnalysis.map(sector => `
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>${sector.sectorName}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.totalEmployees}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.assessments}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${formatPercentage(sector.coverage)}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.averageScore.toFixed(1)}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.riskLevel.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        ${options.includeRoleAnalysis ? `
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
          4.4 Análise por Função
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Função</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Funcionários</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Avaliações</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Cobertura</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Score Médio</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>Nível de Risco</th>
            </tr>
          </thead>
          <tbody>
            ${data.roleAnalysis.map(role => `
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>${role.roleName}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${role.totalEmployees}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${role.assessments}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${formatPercentage(role.coverage)}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${role.averageScore.toFixed(1)}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>${role.riskLevel.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
      </div>

      ${options.includeFactorAnalysis && factorData ? `
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          5. ANÁLISE DETALHADA DOS FATORES DE RISCO PSICOSSOCIAL
        </h2>
        <p style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'justify' }}>
          Esta seção apresenta a análise detalhada dos 11 fatores de risco psicossocial avaliados, 
          conforme metodologia estabelecida na literatura científica e adaptada às normas brasileiras.
        </p>

        ${factorData.map(factor => `
          <div style={{ marginBottom: '25px', border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
              ${factor.factorName}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Score Médio Geral</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '${factor.overall.averageScore >= 75 ? '#c62828' : factor.overall.averageScore >= 50 ? '#f57c00' : factor.overall.averageScore >= 25 ? '#f9a825' : '#2e7d32'}' }}>
                  ${factor.overall.averageScore.toFixed(1)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Nível: ${factor.overall.averageScore >= 75 ? 'CRÍTICO' : factor.overall.averageScore >= 50 ? 'ALTO' : factor.overall.averageScore >= 25 ? 'MÉDIO' : 'BAIXO'}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Distribuição de Riscos</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', fontSize: '12px' }}>
                  <div style={{ textAlign: 'center', padding: '5px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold' }}>${factor.overall.baixo}</div>
                    <div>Baixo</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '5px', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold' }}>${factor.overall.medio}</div>
                    <div>Médio</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '5px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold' }}>${factor.overall.alto}</div>
                    <div>Alto</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '5px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold' }}>${factor.overall.critico}</div>
                    <div>Crítico</div>
                  </div>
                </div>
              </div>
            </div>
            
            ${factor.bySector.length > 0 ? `
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Análise por Setor</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '5px', textAlign: 'left', border: '1px solid #dee2e6' }}>Setor</th>
                    <th style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>Score Médio</th>
                    <th style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>Baixo</th>
                    <th style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>Médio</th>
                    <th style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>Alto</th>
                    <th style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>Crítico</th>
                  </tr>
                </thead>
                <tbody>
                  ${factor.bySector.map(sector => `
                    <tr>
                      <td style={{ padding: '5px', border: '1px solid #dee2e6' }}>${sector.sectorName}</td>
                      <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: 'bold' }}>${sector.averageScore.toFixed(1)}</td>
                      <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.baixo}</td>
                      <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.medio}</td>
                      <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.alto}</td>
                      <td style={{ padding: '5px', textAlign: 'center', border: '1px solid #dee2e6' }}>${sector.critico}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${options.includeActionPlans ? `
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          6. PLANOS DE AÇÃO E MEDIDAS IMPLEMENTADAS
        </h2>
        <p style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'justify' }}>
          Esta seção apresenta o status dos planos de ação desenvolvidos para mitigação dos riscos psicossociais 
          identificados, conforme exigências da NR-01 para gestão de riscos ocupacionais.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>${data.actionPlansStatus.total}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total de Planos</div>
          </div>
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>${data.actionPlansStatus.completed}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Concluídos</div>
          </div>
          <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57c00' }}>${data.actionPlansStatus.inProgress}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Em Andamento</div>
          </div>
          <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d32f2f' }}>${data.actionPlansStatus.overdue}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Em Atraso</div>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
            Taxa de Conclusão dos Planos de Ação
          </h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }}>
            ${formatPercentage(data.actionPlansStatus.completionRate)}
          </div>
        </div>
      </div>
      ` : ''}

      ${options.includeComplianceNR01 ? `
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          7. CONFORMIDADE NR-01 E CRONOGRAMA DE REAVALIAÇÃO
        </h2>
        <p style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'justify' }}>
          Esta seção apresenta o status de conformidade da empresa com as exigências da NR-01 quanto ao 
          gerenciamento de riscos psicossociais e estabelece o cronograma de reavaliações periódicas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#495057' }}>Última Avaliação</h4>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
              ${formatDate(data.complianceMetrics.lastAssessmentDate)}
            </div>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#495057' }}>Próxima Reavaliação</h4>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f57c00' }}>
              ${formatDate(data.complianceMetrics.nextAssessmentDue)}
            </div>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#495057' }}>Status de Conformidade</h4>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '${getComplianceStatusColor(data.complianceMetrics.complianceStatus)}' }}>
              ${getComplianceStatusLabel(data.complianceMetrics.complianceStatus)}
            </div>
          </div>
        </div>

        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', border: '1px solid #2e7d32' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px' }}>
            Cronograma de Reavaliações
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>
            Conforme NR-01, as reavaliações dos fatores de risco psicossocial devem ser realizadas:
          </p>
          <ul style={{ fontSize: '14px', marginLeft: '20px', lineHeight: '1.6' }}>
            <li>Periodicamente, no máximo a cada 12 meses</li>
            <li>Sempre que houver mudanças significativas nos processos de trabalho</li>
            <li>Quando implementadas novas tecnologias que possam impactar os fatores psicossociais</li>
            <li>Após alterações na organização do trabalho</li>
            <li>Quando identificados novos fatores de risco</li>
          </ul>
        </div>
      </div>
      ` : ''}

      {/* PARECER TÉCNICO */}
      <div class="pdf-page-break" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          8. PARECER TÉCNICO
        </h2>
        
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
            8.1 Conclusões da Análise
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '15px' }}>
            Com base na análise técnica dos fatores de riscos psicossociais relacionados ao trabalho (FRPT) 
            realizada na empresa <strong>${data.companyInfo.name}</strong>, conclui-se que:
          </p>
          <ul style={{ fontSize: '14px', lineHeight: '1.6', marginLeft: '20px', marginBottom: '15px' }}>
            <li>Foram avaliados <strong>${data.totalStats.totalEmployees}</strong> funcionários, com <strong>${data.totalStats.completedAssessments}</strong> avaliações concluídas</li>
            <li>A cobertura da avaliação foi de <strong>${formatPercentage(data.totalStats.assessmentCoverage)}</strong></li>
            <li>Distribuição de riscos identificados:
              <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                <li>Risco Baixo: ${data.riskDistribution.baixo} funcionários</li>
                <li>Risco Médio: ${data.riskDistribution.medio} funcionários</li>
                <li>Risco Alto: ${data.riskDistribution.alto} funcionários</li>
                <li>Risco Crítico: ${data.riskDistribution.critico} funcionários</li>
              </ul>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
            8.2 Recomendações Técnicas
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '10px' }}>
            Com base nos resultados obtidos, recomenda-se:
          </p>
          <ol style={{ fontSize: '14px', lineHeight: '1.6', marginLeft: '20px' }}>
            <li>Implementação imediata de medidas preventivas para funcionários em risco alto e crítico</li>
            <li>Desenvolvimento de programa de redução de demandas excessivas de trabalho</li>
            <li>Melhoria dos mecanismos de suporte social e organizacional</li>
            <li>Clarificação de papéis e responsabilidades profissionais</li>
            <li>Implementação de programas de reconhecimento e valorização profissional</li>
            <li>Melhoria das condições ambientais de trabalho</li>
            <li>Capacitação de gestores em técnicas de gestão de pessoas e prevenção de riscos psicossociais</li>
            <li>Estabelecimento de cronograma de reavaliações periódicas</li>
          </ol>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginBottom: '15px' }}>
            8.3 Conformidade Legal
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
            A presente análise foi realizada em conformidade com as disposições da NR-01 - Disposições Gerais 
            e Gerenciamento de Riscos Ocupacionais (Portaria SEPRT nº 6.730/2020), constituindo documento técnico 
            válido para apresentação em auditorias do Ministério do Trabalho e Emprego. 
            A metodologia aplicada segue as melhores práticas da literatura científica internacional, 
            adaptada à realidade brasileira e aos requisitos normativos vigentes.
          </p>
        </div>
      </div>

      {/* RESPONSABILIDADE TÉCNICA */}
      <div class="pdf-page-break" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          9. RESPONSABILIDADE TÉCNICA
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '30px' }}>Responsável Técnico pela Análise</h3>
            <div style={{ borderTop: '1px solid #333', margin: '40px auto 20px', width: '200px' }}></div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
              ${data.companyInfo.contact_name || 'Nome do Responsável Técnico'}
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Registro Profissional: _____________
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Especialista em Segurança do Trabalho
            </p>
          </div>
          <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '30px' }}>Representante da Empresa</h3>
            <div style={{ borderTop: '1px solid #333', margin: '40px auto 20px', width: '200px' }}></div>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
              Nome do Representante Legal
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              CPF: _____________
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Cargo/Função na Empresa
            </p>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
            <strong>Documento gerado em:</strong> ${formatDate(new Date().toISOString())} | 
            <strong>Conforme NR-01</strong> - Portaria SEPRT nº 6.730/2020 | 
            <strong>Válido para auditoria do Ministério do Trabalho e Emprego</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  return element;
}

function getComplianceStatusColor(status: string): string {
  switch (status) {
    case 'compliant':
      return '#2e7d32';
    case 'attention':
      return '#f57c00';
    case 'critical':
      return '#d32f2f';
    default:
      return '#666';
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