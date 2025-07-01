
import { STANDARD_QUESTIONNAIRE_TEMPLATES, createStandardTemplate } from "@/data/standardQuestionnaires";
import { ChecklistTemplate } from "@/types/checklist";

export interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  categories: string[];
  estimatedQuestions: number;
  estimatedTimeMinutes: number;
  typeLabel: string;
  icon: string;
  colorScheme: string;
}

export function getTemplatePreview(templateId: string): TemplatePreview | null {
  const template = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    categories: template.categories || ['Geral'],
    estimatedQuestions: template.questions.length,
    estimatedTimeMinutes: template.estimatedTimeMinutes,
    typeLabel: getTypeLabel(template.id),
    icon: getTemplateIcon(template.id),
    colorScheme: getTemplateColorScheme(template.id)
  };
}

export function createTemplateFromId(templateId: string): ChecklistTemplate | null {
  return createStandardTemplate(templateId);
}

export function getTemplatesByType(type?: string): TemplatePreview[] {
  return STANDARD_QUESTIONNAIRE_TEMPLATES
    .filter(template => !type || getTypeLabel(template.id).toLowerCase() === type.toLowerCase())
    .map(template => getTemplatePreview(template.id)!)
    .filter(Boolean);
}

export function searchTemplates(query: string): TemplatePreview[] {
  const lowercaseQuery = query.toLowerCase();
  return STANDARD_QUESTIONNAIRE_TEMPLATES
    .filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      (template.categories || []).some(cat => cat.toLowerCase().includes(lowercaseQuery))
    )
    .map(template => getTemplatePreview(template.id)!)
    .filter(Boolean);
}

function getTypeLabel(templateId: string): string {
  if (templateId.includes("disc")) return "DISC";
  if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
  if (templateId.includes("360")) return "360°";
  if (templateId.includes("personal")) return "Vida Pessoal";
  return "Saúde Mental";
}

function getTemplateIcon(templateId: string): string {
  if (templateId.includes("disc")) return "target";
  if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "brain";
  if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return "activity";
  if (templateId.includes("personal")) return "heart";
  if (templateId.includes("360")) return "refresh-cw";
  if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "activity";
  return "file-text";
}

function getTemplateColorScheme(templateId: string): string {
  if (templateId.includes("disc")) return "orange";
  if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "purple";
  if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return "red";
  if (templateId.includes("personal")) return "pink";
  if (templateId.includes("360")) return "indigo";
  if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "blue";
  return "gray";
}

export const TEMPLATE_CATEGORIES = {
  // DISC
  dominancia: "Dominância",
  influencia: "Influência", 
  estabilidade: "Estabilidade",
  conformidade: "Conformidade",
  
  // Psicossocial
  demandas_trabalho: "Demandas Trabalho",
  controle_autonomia: "Controle Autonomia",
  condicoes_ambientais: "Condições Ambientais",
  relacoes_socioprofissionais: "Relações Socioprofissionais",
  reconhecimento_crescimento: "Reconhecimento Crescimento",
  suporte_social: "Suporte Social",
  relacionamentos: "Relacionamentos",
  clareza_papel: "Clareza Papel",
  
  // Saúde Mental
  sintomas_fisicos: "Sintomas Físicos",
  sintomas_psiquicos: "Sintomas Psíquicos",
  humor_depressivo: "Humor Depressivo",
  sintomas_sono: "Sintomas Sono",
  ansiedade: "Ansiedade",
  exaustao_emocional: "Exaustão Emocional",
  despersonalizacao: "Despersonalização",
  consumo_alcool: "Consumo Álcool",
  consumo_pesado: "Consumo Pesado",
  estresse_percebido: "Estresse Percebido",
  
  // Vida Pessoal
  situacao_financeira: "Situação Financeira",
  relacionamentos_familiares: "Relacionamentos Familiares",
  saude_fisica: "Saúde Física",
  
  // 360°
  colaboracao: "Colaboração",
  comunicacao: "Comunicação",
  confiabilidade: "Confiabilidade",
  lideranca: "Liderança",
  feedback: "Feedback",
  desenvolvimento: "Desenvolvimento"
};
