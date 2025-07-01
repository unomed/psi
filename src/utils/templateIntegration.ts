
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

// Cache para templates para melhor performance
const templateCache = new Map<string, ChecklistTemplate>();

export function getTemplatePreview(templateId: string): TemplatePreview | null {
  const template = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    console.error(`❌ Template preview não encontrado: ${templateId}`);
    return null;
  }

  try {
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
  } catch (error) {
    console.error(`❌ Erro ao criar preview do template ${templateId}:`, error);
    return null;
  }
}

export function createTemplateFromId(templateId: string): ChecklistTemplate | null {
  // Verificar cache primeiro
  if (templateCache.has(templateId)) {
    console.log(`✅ Template recuperado do cache: ${templateId}`);
    return templateCache.get(templateId)!;
  }

  try {
    console.log(`🔄 Criando template: ${templateId}`);
    
    const template = createStandardTemplate(templateId);
    
    if (template) {
      // Validação adicional do template criado
      if (!validateTemplateStructure(template)) {
        console.error(`❌ Template criado é inválido: ${templateId}`);
        return null;
      }

      // Adicionar ao cache
      templateCache.set(templateId, template);
      console.log(`✅ Template criado e cacheado: ${templateId}`);
      
      return template;
    }
    
    console.error(`❌ Falha ao criar template: ${templateId}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Erro ao criar template ${templateId}:`, error);
    return null;
  }
}

// Validação de estrutura do template
function validateTemplateStructure(template: ChecklistTemplate): boolean {
  if (!template) return false;
  
  if (!template.title || template.title.trim() === "") {
    console.error("❌ Template sem título válido");
    return false;
  }
  
  if (!template.questions || !Array.isArray(template.questions) || template.questions.length === 0) {
    console.error("❌ Template sem perguntas válidas");
    return false;
  }
  
  if (!template.type) {
    console.error("❌ Template sem tipo definido");
    return false;
  }
  
  return true;
}

export function getTemplatesByType(type?: string): TemplatePreview[] {
  try {
    return STANDARD_QUESTIONNAIRE_TEMPLATES
      .filter(template => !type || getTypeLabel(template.id).toLowerCase() === type.toLowerCase())
      .map(template => getTemplatePreview(template.id)!)
      .filter(Boolean);
  } catch (error) {
    console.error("❌ Erro ao filtrar templates por tipo:", error);
    return [];
  }
}

export function searchTemplates(query: string): TemplatePreview[] {
  if (!query || query.trim() === "") {
    return [];
  }

  try {
    const lowercaseQuery = query.toLowerCase();
    return STANDARD_QUESTIONNAIRE_TEMPLATES
      .filter(template => {
        const searchableText = [
          template.name,
          template.description,
          ...(template.categories || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(lowercaseQuery);
      })
      .map(template => getTemplatePreview(template.id)!)
      .filter(Boolean);
  } catch (error) {
    console.error("❌ Erro ao buscar templates:", error);
    return [];
  }
}

// Limpar cache quando necessário
export function clearTemplateCache(): void {
  templateCache.clear();
  console.log("🔄 Cache de templates limpo");
}

// Obter estatísticas do cache
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: templateCache.size,
    keys: Array.from(templateCache.keys())
  };
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
