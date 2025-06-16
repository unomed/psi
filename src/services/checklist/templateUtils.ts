
import { ChecklistTemplateType } from "@/types/checklist";
import { ScaleType } from "@/types";
import { DiscQuestion, PsicossocialQuestion } from "@/types";
import { scaleTypeToDbScaleType } from "@/types/scale";

export function mapDbTemplateTypeToApp(dbType: string): ChecklistTemplateType {
  // Mapeamento direto dos tipos do banco para os tipos da aplicação
  switch (dbType) {
    case "disc":
      return "disc";
    case "psicossocial":
      return "psicossocial";
    case "srq20":
      return "srq20";
    case "phq9":
      return "phq9";
    case "gad7":
      return "gad7";
    case "mbi":
      return "mbi";
    case "audit":
      return "audit";
    case "pss":
      return "pss";
    case "copsoq":
      return "copsoq";
    case "jcq":
      return "jcq";
    case "eri":
      return "eri";
    case "custom":
    default:
      return "custom";
  }
}

export function mapAppTemplateTypeToDb(appType: ChecklistTemplateType): string {
  // Mapeamento inverso
  return appType;
}

export function isTemplateTypePsicossocial(template: { type: ChecklistTemplateType; title?: string }): boolean {
  // Verifica se é um template psicossocial baseado no tipo ou título
  return template.type === "psicossocial" || 
         (template.type === "custom" && 
          template.title && 
          template.title.toLowerCase().includes("psicossocial"));
}

export function getTemplateTypeDisplayName(template: { type: ChecklistTemplateType; title?: string }): string {
  if (template.type === "disc") return "DISC";
  if (template.type === "psicossocial") return "Psicossocial";
  if (isTemplateTypePsicossocial(template)) return "Psicossocial";
  if (template.type === "srq20") return "SRQ-20";
  if (template.type === "phq9") return "PHQ-9";
  if (template.type === "gad7") return "GAD-7";
  if (template.type === "mbi") return "MBI";
  if (template.type === "audit") return "AUDIT";
  if (template.type === "pss") return "PSS";
  if (template.type === "copsoq") return "COPSOQ";
  if (template.type === "jcq") return "JCQ";
  if (template.type === "eri") return "ERI";
  return "Personalizado";
}

// Usar a função correta do scale.ts para mapeamento
export function getSafeDbScaleType(scaleType: ScaleType): string {
  return scaleTypeToDbScaleType(scaleType);
}

export function getSafeDbTemplateType(templateType: ChecklistTemplateType): string {
  switch (templateType) {
    case "disc":
      return "disc";
    case "psicossocial":
      return "psicossocial";
    case "srq20":
      return "srq20";
    case "phq9":
      return "phq9";
    case "gad7":
      return "gad7";
    case "mbi":
      return "mbi";
    case "audit":
      return "audit";
    case "pss":
      return "pss";
    case "copsoq":
      return "copsoq";
    case "jcq":
      return "jcq";
    case "eri":
      return "eri";
    case "custom":
    default:
      return "custom";
  }
}

export function formatQuestionsForDb(
  questions: (DiscQuestion | PsicossocialQuestion)[], 
  templateId: string, 
  templateType: string
) {
  return questions.map((question, index) => {
    const baseQuestion = {
      template_id: templateId,
      question_text: question.text,
      order_number: index + 1,
      weight: question.weight || 1.0,
      reverse_scored: false
    };

    // Para questões DISC
    if ('targetFactor' in question) {
      return {
        ...baseQuestion,
        target_factor: question.targetFactor
      };
    }

    // Para questões psicossociais ou outras
    if ('category' in question) {
      return {
        ...baseQuestion,
        target_factor: question.category || null
      };
    }

    return baseQuestion;
  });
}

// Perguntas padrão para DISC
export function getDefaultDiscQuestions(): DiscQuestion[] {
  return [
    {
      id: "disc_1",
      text: "Eu gosto de liderar e tomar decisões rapidamente",
      targetFactor: "D",
      weight: 1
    },
    {
      id: "disc_2", 
      text: "Eu prefiro trabalhar com pessoas e influenciá-las",
      targetFactor: "I",
      weight: 1
    },
    {
      id: "disc_3",
      text: "Eu valorizo estabilidade e consistência no trabalho",
      targetFactor: "S", 
      weight: 1
    },
    {
      id: "disc_4",
      text: "Eu presto atenção aos detalhes e sigo procedimentos",
      targetFactor: "C",
      weight: 1
    },
    {
      id: "disc_5",
      text: "Eu me sinto confortável assumindo riscos",
      targetFactor: "D",
      weight: 1
    },
    {
      id: "disc_6",
      text: "Eu gosto de interagir socialmente no ambiente de trabalho",
      targetFactor: "I",
      weight: 1
    },
    {
      id: "disc_7",
      text: "Eu prefiro trabalhar em um ambiente previsível",
      targetFactor: "S",
      weight: 1
    },
    {
      id: "disc_8",
      text: "Eu gosto de analisar dados antes de tomar decisões",
      targetFactor: "C",
      weight: 1
    }
  ];
}

// Perguntas padrão para Psicossocial (baseado no MTE)
export function getDefaultPsicossocialQuestions(): PsicossocialQuestion[] {
  return [
    {
      id: "psico_1",
      text: "Tenho que trabalhar muito rapidamente",
      category: "Demandas de Trabalho",
      weight: 1
    },
    {
      id: "psico_2",
      text: "Meu trabalho exige muito de mim",
      category: "Demandas de Trabalho", 
      weight: 1
    },
    {
      id: "psico_3",
      text: "Tenho tempo suficiente para fazer meu trabalho",
      category: "Demandas de Trabalho",
      weight: 1
    },
    {
      id: "psico_4",
      text: "Posso decidir como fazer meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    {
      id: "psico_5",
      text: "Tenho influência sobre o que acontece no meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    {
      id: "psico_6",
      text: "Recebo ajuda de meus colegas quando necessário",
      category: "Suporte Social",
      weight: 1
    },
    {
      id: "psico_7",
      text: "Meu supervisor me dá apoio quando preciso",
      category: "Suporte Social",
      weight: 1
    },
    {
      id: "psico_8",
      text: "Sei exatamente o que é esperado de mim no trabalho",
      category: "Clareza de Papel",
      weight: 1
    },
    {
      id: "psico_9",
      text: "Tenho objetivos claros para meu trabalho",
      category: "Clareza de Papel",
      weight: 1
    },
    {
      id: "psico_10",
      text: "Sou tratado de forma justa no trabalho",
      category: "Relacionamentos Interpessoais",
      weight: 1
    }
  ];
}

// Função para carregar perguntas padrão baseado no tipo
export function getDefaultQuestions(templateType: ChecklistTemplateType): (DiscQuestion | PsicossocialQuestion)[] {
  switch (templateType) {
    case "disc":
      return getDefaultDiscQuestions();
    case "psicossocial":
      return getDefaultPsicossocialQuestions();
    default:
      return [];
  }
}
