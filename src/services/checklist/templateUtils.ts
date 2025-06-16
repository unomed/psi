
import { ChecklistTemplateType } from "@/types/checklist";
import { ScaleType } from "@/types";
import { DiscQuestion, PsicossocialQuestion, DiscFactorType, PersonalLifeQuestion, Evaluation360Question } from "@/types";
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
    case "personal_life":
      return "custom";
    case "evaluation_360":
      return "custom";
    case "custom":
    default:
      return "custom";
  }
}

export function formatQuestionsForDb(
  questions: (DiscQuestion | PsicossocialQuestion | PersonalLifeQuestion | Evaluation360Question)[], 
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

    // Para questões psicossociais, pessoais ou 360°
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
      targetFactor: DiscFactorType.D,
      weight: 1
    },
    {
      id: "disc_2", 
      text: "Eu prefiro trabalhar com pessoas e influenciá-las",
      targetFactor: DiscFactorType.I,
      weight: 1
    },
    {
      id: "disc_3",
      text: "Eu valorizo estabilidade e consistência no trabalho",
      targetFactor: DiscFactorType.S, 
      weight: 1
    },
    {
      id: "disc_4",
      text: "Eu presto atenção aos detalhes e sigo procedimentos",
      targetFactor: DiscFactorType.C,
      weight: 1
    },
    {
      id: "disc_5",
      text: "Eu me sinto confortável assumindo riscos",
      targetFactor: DiscFactorType.D,
      weight: 1
    },
    {
      id: "disc_6",
      text: "Eu gosto de interagir socialmente no ambiente de trabalho",
      targetFactor: DiscFactorType.I,
      weight: 1
    },
    {
      id: "disc_7",
      text: "Eu prefiro trabalhar em um ambiente previsível",
      targetFactor: DiscFactorType.S,
      weight: 1
    },
    {
      id: "disc_8",
      text: "Eu gosto de analisar dados antes de tomar decisões",
      targetFactor: DiscFactorType.C,
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

// Perguntas SRQ-20 (Self-Reporting Questionnaire)
export function getSRQ20Questions(): PsicossocialQuestion[] {
  return [
    { id: "srq_1", text: "Tem dores de cabeça frequentemente?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_2", text: "Tem falta de apetite?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_3", text: "Dorme mal?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_4", text: "Assusta-se com facilidade?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_5", text: "Tem tremores nas mãos?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_6", text: "Sente-se nervoso(a), tenso(a) ou preocupado(a)?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_7", text: "Tem má digestão?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_8", text: "Tem dificuldade de pensar com clareza?", category: "Sintomas Cognitivos", weight: 1 },
    { id: "srq_9", text: "Tem se sentido triste ultimamente?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_10", text: "Tem chorado mais do que de costume?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_11", text: "Encontra dificuldade para realizar com satisfação suas atividades diárias?", category: "Sintomas Funcionais", weight: 1 },
    { id: "srq_12", text: "Tem dificuldade para tomar decisões?", category: "Sintomas Cognitivos", weight: 1 },
    { id: "srq_13", text: "Tem dificuldade no serviço (seu trabalho é penoso, lhe causa sofrimento)?", category: "Sintomas Funcionais", weight: 1 },
    { id: "srq_14", text: "É incapaz de desempenhar um papel útil em sua vida?", category: "Sintomas Funcionais", weight: 1 },
    { id: "srq_15", text: "Tem perdido o interesse pelas coisas?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_16", text: "Você se sente uma pessoa inútil, sem préstimo?", category: "Sintomas Emocionais", weight: 1 },
    { id: "srq_17", text: "Tem tido a ideia de acabar com a vida?", category: "Sintomas Críticos", weight: 1 },
    { id: "srq_18", text: "Sente-se cansado(a) o tempo todo?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_19", text: "Tem sensações desagradáveis no estômago?", category: "Sintomas Físicos", weight: 1 },
    { id: "srq_20", text: "Você se cansa com facilidade?", category: "Sintomas Físicos", weight: 1 }
  ];
}

// Perguntas PHQ-9 (Patient Health Questionnaire)
export function getPHQ9Questions(): PsicossocialQuestion[] {
  return [
    { id: "phq_1", text: "Pouco interesse ou prazer em fazer as coisas", category: "Humor Deprimido", weight: 1 },
    { id: "phq_2", text: "Sentindo-se para baixo, deprimido(a) ou sem esperança", category: "Humor Deprimido", weight: 1 },
    { id: "phq_3", text: "Dificuldade para pegar no sono, continuar dormindo ou dormir demais", category: "Sono", weight: 1 },
    { id: "phq_4", text: "Sentindo-se cansado(a) ou com pouca energia", category: "Energia", weight: 1 },
    { id: "phq_5", text: "Pouco apetite ou comendo demais", category: "Apetite", weight: 1 },
    { id: "phq_6", text: "Sentindo-se mal consigo mesmo(a) ou que você é um fracasso", category: "Autoestima", weight: 1 },
    { id: "phq_7", text: "Dificuldade para se concentrar em coisas como ler jornal ou assistir televisão", category: "Concentração", weight: 1 },
    { id: "phq_8", text: "Mover-se ou falar tão devagar que outras pessoas poderiam ter notado", category: "Psicomotor", weight: 1 },
    { id: "phq_9", text: "Pensamentos de que seria melhor estar morto(a) ou se ferir de alguma forma", category: "Ideação Suicida", weight: 1 }
  ];
}

// Perguntas GAD-7 (Generalized Anxiety Disorder)
export function getGAD7Questions(): PsicossocialQuestion[] {
  return [
    { id: "gad_1", text: "Sentindo-se nervoso(a), ansioso(a) ou muito tenso(a)", category: "Ansiedade", weight: 1 },
    { id: "gad_2", text: "Não conseguindo parar ou controlar as preocupações", category: "Controle", weight: 1 },
    { id: "gad_3", text: "Preocupando-se muito com diferentes coisas", category: "Preocupação", weight: 1 },
    { id: "gad_4", text: "Dificuldade para relaxar", category: "Relaxamento", weight: 1 },
    { id: "gad_5", text: "Ficando tão agitado(a) que se torna difícil ficar parado(a)", category: "Agitação", weight: 1 },
    { id: "gad_6", text: "Ficando facilmente irritado(a) ou chateado(a)", category: "Irritabilidade", weight: 1 },
    { id: "gad_7", text: "Sentindo medo como se algo terrível fosse acontecer", category: "Medo", weight: 1 }
  ];
}

// Perguntas de Vida Pessoal/Familiar
export function getPersonalLifeQuestions(): PersonalLifeQuestion[] {
  return [
    { id: "personal_1", text: "Como você avalia sua situação financeira atual?", category: "Situação Financeira", weight: 1, isPrivate: true },
    { id: "personal_2", text: "Tem dificuldades financeiras que o preocupam?", category: "Situação Financeira", weight: 1, isPrivate: true },
    { id: "personal_3", text: "Como está o relacionamento com sua família?", category: "Relacionamentos Familiares", weight: 1, isPrivate: true },
    { id: "personal_4", text: "Tem conflitos familiares frequentes?", category: "Relacionamentos Familiares", weight: 1, isPrivate: true },
    { id: "personal_5", text: "Como avalia sua saúde física geral?", category: "Saúde Física", weight: 1, isPrivate: true },
    { id: "personal_6", text: "Tem problemas de saúde que o preocupam?", category: "Saúde Física", weight: 1, isPrivate: true },
    { id: "personal_7", text: "Consegue equilibrar trabalho e vida pessoal?", category: "Equilíbrio Vida-Trabalho", weight: 1, isPrivate: true },
    { id: "personal_8", text: "Sente que tem tempo suficiente para sua família?", category: "Equilíbrio Vida-Trabalho", weight: 1, isPrivate: true },
    { id: "personal_9", text: "Como está sua vida social fora do trabalho?", category: "Vida Social", weight: 1, isPrivate: true },
    { id: "personal_10", text: "Tem apoio emocional de amigos/família?", category: "Suporte Social", weight: 1, isPrivate: true }
  ];
}

// Perguntas para Avaliação 360° - Colegas
export function getEvaluation360ColleagueQuestions(): Evaluation360Question[] {
  return [
    { id: "360_col_1", text: "Demonstra colaboração no trabalho em equipe", category: "Trabalho em Equipe", evaluationType: "colleague", weight: 1 },
    { id: "360_col_2", text: "Comunica-se de forma clara e efetiva", category: "Comunicação", evaluationType: "colleague", weight: 1 },
    { id: "360_col_3", text: "É confiável e cumpre com seus compromissos", category: "Confiabilidade", evaluationType: "colleague", weight: 1 },
    { id: "360_col_4", text: "Oferece ajuda quando necessário", category: "Colaboração", evaluationType: "colleague", weight: 1 },
    { id: "360_col_5", text: "Mantém relacionamento profissional respeitoso", category: "Relacionamento", evaluationType: "colleague", weight: 1 },
    { id: "360_col_6", text: "Contribui positivamente para o ambiente de trabalho", category: "Ambiente", evaluationType: "colleague", weight: 1 },
    { id: "360_col_7", text: "Demonstra iniciativa em suas atividades", category: "Proatividade", evaluationType: "colleague", weight: 1 },
    { id: "360_col_8", text: "É receptivo a feedback e sugestões", category: "Feedback", evaluationType: "colleague", weight: 1 }
  ];
}

// Perguntas para Avaliação 360° - Gestores
export function getEvaluation360ManagerQuestions(): Evaluation360Question[] {
  return [
    { id: "360_mgr_1", text: "Fornece direcionamento claro sobre as tarefas", category: "Liderança", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_2", text: "Está disponível quando preciso de suporte", category: "Disponibilidade", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_3", text: "Reconhece e valoriza o bom trabalho", category: "Reconhecimento", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_4", text: "Fornece feedback construtivo", category: "Feedback", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_5", text: "Trata todos os funcionários de forma justa", category: "Justiça", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_6", text: "Apoia o desenvolvimento profissional da equipe", category: "Desenvolvimento", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_7", text: "Comunica mudanças e decisões de forma clara", category: "Comunicação", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_8", text: "Demonstra confiança na capacidade da equipe", category: "Confiança", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_9", text: "Mantém um ambiente de trabalho positivo", category: "Ambiente", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_10", text: "É acessível para discutir problemas e preocupações", category: "Acessibilidade", evaluationType: "manager", weight: 1 }
  ];
}

// Função para carregar perguntas padrão baseado no tipo
export function getDefaultQuestions(templateType: ChecklistTemplateType): (DiscQuestion | PsicossocialQuestion | PersonalLifeQuestion | Evaluation360Question)[] {
  switch (templateType) {
    case "disc":
      return getDefaultDiscQuestions();
    case "psicossocial":
      return getDefaultPsicossocialQuestions();
    case "srq20":
      return getSRQ20Questions();
    case "phq9":
      return getPHQ9Questions();
    case "gad7":
      return getGAD7Questions();
    case "personal_life":
      return getPersonalLifeQuestions();
    case "evaluation_360":
      return getEvaluation360ColleagueQuestions(); // Default para colegas
    default:
      return [];
  }
}

// Função para obter perguntas específicas de avaliação 360°
export function get360Questions(evaluationType: "colleague" | "manager"): Evaluation360Question[] {
  switch (evaluationType) {
    case "colleague":
      return getEvaluation360ColleagueQuestions();
    case "manager":
      return getEvaluation360ManagerQuestions();
    default:
      return getEvaluation360ColleagueQuestions();
  }
}
