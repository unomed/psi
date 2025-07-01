import { DiscFactorType, DiscQuestion } from "@/types/disc";
import { PsicossocialQuestion, ChecklistTemplateType } from "@/types/checklist";
import { ScaleType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Categorias expandidas baseadas no Guia MTE
export type PsicossocialCategory = 
  | "demandas_trabalho"
  | "controle_autonomia" 
  | "condicoes_ambientais"
  | "relacoes_socioprofissionais"
  | "reconhecimento_crescimento"
  | "elo_trabalho_vida_social"
  | "suporte_social"
  | "clareza_papel"
  | "reconhecimento_recompensas"
  | "gestao_mudancas"
  | "impactos_saude";

export const PSICOSSOCIAL_CATEGORIES: Record<PsicossocialCategory, string> = {
  demandas_trabalho: "Demandas de Trabalho",
  controle_autonomia: "Controle e Autonomia",
  condicoes_ambientais: "Condições Ambientais", 
  relacoes_socioprofissionais: "Relações Socioprofissionais",
  reconhecimento_crescimento: "Reconhecimento e Crescimento",
  elo_trabalho_vida_social: "Elo Trabalho-Vida Social",
  suporte_social: "Suporte Social",
  clareza_papel: "Clareza de Papel",
  reconhecimento_recompensas: "Reconhecimento e Recompensas",
  gestao_mudancas: "Gestão de Mudanças",
  impactos_saude: "Impactos na Saúde"
};

// Pesos das categorias para cálculo de risco (baseado no Guia MTE)
export const CATEGORY_RISK_WEIGHTS: Record<PsicossocialCategory, number> = {
  demandas_trabalho: 1.2,        // Categoria crítica
  controle_autonomia: 1.1,       // Categoria muito importante
  condicoes_ambientais: 1.0,     // Categoria importante
  relacoes_socioprofissionais: 1.1, // Categoria muito importante
  reconhecimento_crescimento: 0.9,   // Categoria moderada
  elo_trabalho_vida_social: 0.8,     // Categoria moderada
  suporte_social: 1.0,               // Categoria importante
  clareza_papel: 1.0,                // Categoria importante
  reconhecimento_recompensas: 0.9,   // Categoria moderada
  gestao_mudancas: 0.8,              // Categoria moderada
  impactos_saude: 1.3                // Categoria crítica (indicador de resultado)
};

// Template type helper functions
export function isTemplateTypePsicossocial(template: { type: string }): boolean {
  return template.type === "psicossocial";
}

export function getTemplateTypeDisplayName(template: { type: string }): string {
  const typeMap: Record<string, string> = {
    'disc': 'DISC',
    'psicossocial': 'Psicossocial',
    'custom': 'Personalizado',
    'srq20': 'SRQ-20',
    'phq9': 'PHQ-9',
    'gad7': 'GAD-7',
    'mbi': 'MBI',
    'audit': 'AUDIT',
    'pss': 'PSS',
    'personal_life': 'Vida Pessoal',
    'evaluation_360': 'Avaliação 360°'
  };
  
  return typeMap[template.type] || template.type;
}

// Database type safety functions
export function getSafeDbScaleType(scaleType: ScaleType): string {
  return scaleType as string;
}

export function getSafeDbTemplateType(templateType: ChecklistTemplateType): string {
  return templateType as string;
}

export function formatQuestionsForDb(
  questions: (DiscQuestion | PsicossocialQuestion)[], 
  templateId: string, 
  templateType: string
): any[] {
  return questions.map((question, index) => {
    if ('targetFactor' in question) {
      // DISC question
      return {
        template_id: templateId,
        question_text: question.text,
        order_number: index + 1,
        target_factor: question.targetFactor,
        weight: question.weight || 1
      };
    } else {
      // Psicossocial question
      return {
        template_id: templateId,
        question_text: question.text,
        order_number: index + 1,
        target_factor: question.category,
        weight: question.weight || 1
      };
    }
  });
}

export function getDefaultDiscQuestions(): DiscQuestion[] {
  return [
    {
      id: crypto.randomUUID(),
      text: "Sou uma pessoa que gosta de liderar projetos e tomar decisões importantes",
      targetFactor: DiscFactorType.D,
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Prefiro trabalhar em equipe e colaborar com outras pessoas",
      targetFactor: DiscFactorType.I,
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Valorizo a estabilidade e a consistência no trabalho",
      targetFactor: DiscFactorType.S,
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Sou detalhista e gosto de seguir procedimentos estabelecidos",
      targetFactor: DiscFactorType.C,
      weight: 2
    }
  ];
}

// FUNÇÃO SÍNCRONA: Para compatibilidade com código existente
export function getDefaultPsicossocialQuestions(): PsicossocialQuestion[] {
  return getFallbackPsicossocialQuestions();
}

// NOVA FUNÇÃO: Para fallback síncrono
export function getFallbackPsicossocialQuestions(): PsicossocialQuestion[] {
  return [
    {
      id: crypto.randomUUID(),
      text: "Tenho que trabalhar muito rapidamente para cumprir prazos",
      category: "demandas_trabalho",
      weight: 1
    },
    {
      id: crypto.randomUUID(),
      text: "Posso decidir como realizar minhas tarefas",
      category: "controle_autonomia",
      weight: 1
    },
    {
      id: crypto.randomUUID(),
      text: "O ambiente físico do meu trabalho é adequado",
      category: "condicoes_ambientais",
      weight: 1
    },
    {
      id: crypto.randomUUID(),
      text: "A comunicação entre colegas e superiores é clara e eficaz",
      category: "relacoes_socioprofissionais",
      weight: 1
    },
    {
      id: crypto.randomUUID(),
      text: "Recebo reconhecimento pelo meu trabalho e esforços",
      category: "reconhecimento_crescimento",
      weight: 1
    }
  ];
}

// FUNÇÃO ASSÍNCRONA: Para carregar do banco de dados
export async function loadPsicossocialQuestionsFromDatabase(): Promise<PsicossocialQuestion[]> {
  try {
    console.log("🔍 Buscando perguntas psicossociais MTE do banco de dados...");
    
    // Buscar o template MTE no banco
    const { data: template, error: templateError } = await supabase
      .from('checklist_templates')
      .select('id, title')
      .eq('title', 'Avaliação Psicossocial - MTE Completa')
      .eq('type', 'psicossocial')
      .eq('is_standard', true)
      .single();

    if (templateError || !template) {
      console.log("⚠️ Template MTE não encontrado, usando perguntas de fallback");
      return getFallbackPsicossocialQuestions();
    }

    console.log(`✅ Template MTE encontrado: ${template.title} (ID: ${template.id})`);

    // Buscar perguntas do template
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('template_id', template.id)
      .order('order_number');

    if (questionsError || !questions || questions.length === 0) {
      console.log("⚠️ Perguntas não encontradas no template, usando fallback");
      return getFallbackPsicossocialQuestions();
    }

    console.log(`🎯 ${questions.length} perguntas psicossociais MTE carregadas do banco`);

    // Mapear perguntas do banco para formato da aplicação
    const mappedQuestions = questions.map(q => ({
      id: q.id,
      text: q.question_text,
      category: q.target_factor || 'geral',
      weight: q.weight || 1
    }));

    // Validar categorias das perguntas
    const categoriesFound = new Set(mappedQuestions.map(q => q.category));
    console.log(`📊 Categorias encontradas: ${Array.from(categoriesFound).join(', ')}`);

    return mappedQuestions;

  } catch (error) {
    console.error("❌ Erro ao buscar perguntas psicossociais:", error);
    return getFallbackPsicossocialQuestions();
  }
}

// Generic function to get default questions based on type
export async function getDefaultQuestions(templateType: ChecklistTemplateType): Promise<(DiscQuestion | PsicossocialQuestion)[]> {
  switch (templateType) {
    case "disc":
      return getDefaultDiscQuestions();
    case "psicossocial":
      return await loadPsicossocialQuestionsFromDatabase();
    case "srq20":
      return getSRQ20Questions();
    case "phq9":
      return getPHQ9Questions();
    case "gad7":
      return getGAD7Questions();
    case "mbi":
      return getMBIQuestions();
    case "audit":
      return getAUDITQuestions();
    case "pss":
      return getPSSQuestions();
    case "personal_life":
      return getPersonalLifeQuestions();
    case "evaluation_360":
      return getEvaluation360ColleagueQuestions();
    default:
      return [];
  }
}

// 360 evaluation questions
export function get360Questions(evaluationType: "colleague" | "manager"): PsicossocialQuestion[] {
  if (evaluationType === "colleague") {
    return getEvaluation360ColleagueQuestions();
  } else {
    return getEvaluation360ManagerQuestions();
  }
}

// Função para calcular risco psicossocial baseado nas categorias
export function calculatePsicossocialRisk(responses: Record<string, number>, questions: PsicossocialQuestion[]): {
  categoryScores: Record<string, number>;
  overallRisk: number;
  riskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
  criticalCategories: string[];
} {
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  console.log("Calculando risco psicossocial para", questions.length, "perguntas");
  console.log("Respostas:", responses);

  // Agrupar respostas por categoria
  questions.forEach(question => {
    const category = question.category;
    const response = responses[question.id] || 0;

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
      categoryCounts[category] = 0;
    }

    categoryScores[category] += response;
    categoryCounts[category]++;
  });

  // Calcular médias por categoria (escala 1-5 convertida para 0-100)
  Object.keys(categoryScores).forEach(category => {
    const average = categoryScores[category] / categoryCounts[category];
    categoryScores[category] = Math.round((average / 5) * 100);
  });

  console.log("Scores por categoria:", categoryScores);

  // Calcular risco geral ponderado
  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(categoryScores).forEach(([category, score]) => {
    const weight = CATEGORY_RISK_WEIGHTS[category as PsicossocialCategory] || 1.0;
    weightedSum += score * weight;
    totalWeight += weight;
  });

  const overallRisk = Math.round(weightedSum / totalWeight);

  // Determinar nível de risco
  let riskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
  if (overallRisk >= 80) {
    riskLevel = 'critico';
  } else if (overallRisk >= 60) {
    riskLevel = 'alto';
  } else if (overallRisk >= 40) {
    riskLevel = 'medio';
  } else {
    riskLevel = 'baixo';
  }

  // Identificar categorias críticas (>= 70)
  const criticalCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score >= 70)
    .map(([category, _]) => PSICOSSOCIAL_CATEGORIES[category as PsicossocialCategory] || category);

  console.log("Risco calculado:", { overallRisk, riskLevel, criticalCategories });

  return {
    categoryScores,
    overallRisk,
    riskLevel,
    criticalCategories
  };
}

// Novas funções para templates psicossociais específicos
export function getCompletePsicossocialQuestions(): PsicossocialQuestion[] {
  return [
    // Demandas de Trabalho
    { id: crypto.randomUUID(), text: "Tenho que trabalhar muito rapidamente para cumprir prazos", category: "demandas_trabalho", weight: 1 },
    { id: crypto.randomUUID(), text: "Meu trabalho exige que eu aprenda coisas novas constantemente", category: "demandas_trabalho", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho uma quantidade excessiva de trabalho para fazer", category: "demandas_trabalho", weight: 1 },
    
    // Controle e Autonomia
    { id: crypto.randomUUID(), text: "Posso decidir como realizar minhas tarefas", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho liberdade para decidir quando fazer pausas", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Posso influenciar nas decisões que afetam meu trabalho", category: "controle_autonomia", weight: 1 },
    
    // Suporte Social
    { id: crypto.randomUUID(), text: "Recebo apoio adequado dos meus colegas", category: "suporte_social", weight: 1 },
    { id: crypto.randomUUID(), text: "Meu supervisor me dá apoio quando necessário", category: "suporte_social", weight: 1 },
    { id: crypto.randomUUID(), text: "Posso contar com ajuda dos colegas quando tenho dificuldades", category: "suporte_social", weight: 1 },
    
    // Reconhecimento e Crescimento
    { id: crypto.randomUUID(), text: "Recebo reconhecimento pelo meu trabalho e esforços", category: "reconhecimento_crescimento", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho oportunidades de crescimento profissional", category: "reconhecimento_crescimento", weight: 1 },
    { id: crypto.randomUUID(), text: "Meu trabalho oferece possibilidades de desenvolvimento", category: "reconhecimento_crescimento", weight: 1 },
    
    // Condições Ambientais
    { id: crypto.randomUUID(), text: "O ambiente físico do meu trabalho é adequado", category: "condicoes_ambientais", weight: 1 },
    { id: crypto.randomUUID(), text: "O ruído no meu local de trabalho é aceitável", category: "condicoes_ambientais", weight: 1 },
    { id: crypto.randomUUID(), text: "A iluminação do meu local de trabalho é adequada", category: "condicoes_ambientais", weight: 1 }
  ];
}

export function getOccupationalStressQuestions(): PsicossocialQuestion[] {
  return [
    // Demandas de Trabalho - Estresse
    { id: crypto.randomUUID(), text: "Sinto-me sobrecarregado com a quantidade de trabalho", category: "demandas_trabalho", weight: 1 },
    { id: crypto.randomUUID(), text: "Os prazos são muito apertados para completar as tarefas", category: "demandas_trabalho", weight: 1 },
    { id: crypto.randomUUID(), text: "Preciso trabalhar em ritmo muito acelerado", category: "demandas_trabalho", weight: 1 },
    { id: crypto.randomUUID(), text: "Frequentemente levo trabalho para casa", category: "demandas_trabalho", weight: 1 },
    
    // Controle - Estresse
    { id: crypto.randomUUID(), text: "Tenho pouco controle sobre meu ritmo de trabalho", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Não posso decidir quando fazer pausas", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho pouca influência sobre as decisões que me afetam", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Sinto que não tenho autonomia suficiente", category: "controle_autonomia", weight: 1 }
  ];
}

export function getSocialWorkEnvironmentQuestions(): PsicossocialQuestion[] {
  return [
    // Suporte Social
    { id: crypto.randomUUID(), text: "Meus colegas me apoiam quando preciso", category: "suporte_social", weight: 1 },
    { id: crypto.randomUUID(), text: "Existe boa comunicação entre os colegas", category: "suporte_social", weight: 1 },
    { id: crypto.randomUUID(), text: "Posso conversar com meus colegas sobre problemas de trabalho", category: "suporte_social", weight: 1 },
    { id: crypto.randomUUID(), text: "O ambiente de trabalho é colaborativo", category: "suporte_social", weight: 1 },
    
    // Relacionamentos
    { id: crypto.randomUUID(), text: "Tenho bons relacionamentos com meus colegas", category: "relacionamentos", weight: 1 },
    { id: crypto.randomUUID(), text: "Sinto-me integrado à equipe de trabalho", category: "relacionamentos", weight: 1 },
    { id: crypto.randomUUID(), text: "Existe respeito mútuo entre os colegas", category: "relacionamentos", weight: 1 },
    { id: crypto.randomUUID(), text: "Raramente há conflitos interpessoais no trabalho", category: "relacionamentos", weight: 1 }
  ];
}

export function getWorkOrganizationQuestions(): PsicossocialQuestion[] {
  return [
    // Clareza de Papel
    { id: crypto.randomUUID(), text: "Sei exatamente o que se espera de mim no trabalho", category: "clareza_papel", weight: 1 },
    { id: crypto.randomUUID(), text: "Minhas responsabilidades estão claramente definidas", category: "clareza_papel", weight: 1 },
    { id: crypto.randomUUID(), text: "Recebo informações claras sobre meus objetivos", category: "clareza_papel", weight: 1 },
    { id: crypto.randomUUID(), text: "Entendo como meu trabalho contribui para os objetivos da empresa", category: "clareza_papel", weight: 1 },
    
    // Controle Organizacional
    { id: crypto.randomUUID(), text: "Posso planejar meu próprio trabalho", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho influência sobre a organização do meu trabalho", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Posso decidir a ordem em que faço minhas tarefas", category: "controle_autonomia", weight: 1 },
    { id: crypto.randomUUID(), text: "Tenho autonomia para resolver problemas do dia a dia", category: "controle_autonomia", weight: 1 }
  ];
}

// Outras funções de templates (mantidas para compatibilidade)
export function getSRQ20Questions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Tem dores de cabeça frequentes?", category: "sintomas_fisicos" },
    { id: crypto.randomUUID(), text: "Tem falta de apetite?", category: "sintomas_fisicos" },
    { id: crypto.randomUUID(), text: "Dorme mal?", category: "sintomas_fisicos" },
    { id: crypto.randomUUID(), text: "Assusta-se com facilidade?", category: "sintomas_psiquicos" },
    { id: crypto.randomUUID(), text: "Tem tremores nas mãos?", category: "sintomas_fisicos" }
  ];
}

export function getPHQ9Questions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Pouco interesse ou prazer em fazer as coisas", category: "humor_depressivo" },
    { id: crypto.randomUUID(), text: "Sentir-se desanimado, deprimido ou sem esperança", category: "humor_depressivo" },
    { id: crypto.randomUUID(), text: "Dificuldade para adormecer, continuar dormindo ou dormir demais", category: "sintomas_sono" }
  ];
}

export function getGAD7Questions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Sentir-se nervoso, ansioso ou muito tenso", category: "ansiedade" },
    { id: crypto.randomUUID(), text: "Não conseguir parar ou controlar as preocupações", category: "ansiedade" },
    { id: crypto.randomUUID(), text: "Preocupar-se muito com coisas diferentes", category: "ansiedade" }
  ];
}

export function getMBIQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Sinto-me emocionalmente esgotado pelo meu trabalho", category: "exaustao_emocional" },
    { id: crypto.randomUUID(), text: "Sinto-me usado ao final de um dia de trabalho", category: "exaustao_emocional" },
    { id: crypto.randomUUID(), text: "Trabalhar com pessoas o dia todo me causa estresse", category: "despersonalizacao" }
  ];
}

export function getAUDITQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Com que frequência você toma bebidas alcoólicas?", category: "consumo_alcool" },
    { id: crypto.randomUUID(), text: "Quantas doses você toma em um dia típico?", category: "consumo_alcool" },
    { id: crypto.randomUUID(), text: "Com que frequência toma mais de 6 doses em uma ocasião?", category: "consumo_pesado" }
  ];
}

export function getPSSQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Com que frequência você ficou chateado por causa de algo inesperado?", category: "estresse_percebido" },
    { id: crypto.randomUUID(), text: "Com que frequência você sentiu que não conseguia controlar as coisas importantes da vida?", category: "estresse_percebido" },
    { id: crypto.randomUUID(), text: "Com que frequência você se sentiu nervoso ou estressado?", category: "estresse_percebido" }
  ];
}

export function getPersonalLifeQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Minha situação financeira atual me causa preocupação", category: "situacao_financeira" },
    { id: crypto.randomUUID(), text: "Tenho um bom relacionamento familiar", category: "relacionamentos_familiares" },
    { id: crypto.randomUUID(), text: "Minha saúde física está em bom estado", category: "saude_fisica" }
  ];
}

export function getEvaluation360ColleagueQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Este colega colabora efetivamente em projetos de equipe", category: "colaboracao" },
    { id: crypto.randomUUID(), text: "Este colega comunica-se de forma clara e respeitosa", category: "comunicacao" },
    { id: crypto.randomUUID(), text: "Este colega demonstra confiabilidade no cumprimento de compromissos", category: "confiabilidade" }
  ];
}

export function getEvaluation360ManagerQuestions(): PsicossocialQuestion[] {
  return [
    { id: crypto.randomUUID(), text: "Este gestor fornece direcionamento claro sobre as tarefas", category: "lideranca" },
    { id: crypto.randomUUID(), text: "Este gestor oferece feedback construtivo regularmente", category: "feedback" },
    { id: crypto.randomUUID(), text: "Este gestor demonstra interesse no desenvolvimento da equipe", category: "desenvolvimento" }
  ];
}

export function mapDbTemplateTypeToApp(dbType: string): ChecklistTemplateType {
  const typeMap: Record<string, ChecklistTemplateType> = {
    'psicossocial': 'psicossocial',
    'disc': 'disc',
    'custom': 'custom',
    'srq20': 'srq20',
    'phq9': 'phq9',
    'gad7': 'gad7',
    'mbi': 'mbi',
    'audit': 'audit',
    'pss': 'pss',
    'personal_life': 'personal_life',
    'evaluation_360': 'evaluation_360'
  };
  
  console.log(`Mapeando tipo do banco '${dbType}' para tipo da aplicação:`, typeMap[dbType] || 'custom');
  return typeMap[dbType] || 'custom';
}

export function mapAppTemplateTypeToDb(appType: ChecklistTemplateType): string {
  const typeMap: Record<ChecklistTemplateType, string> = {
    'psicossocial': 'psicossocial',
    'disc': 'disc', 
    'custom': 'custom',
    'srq20': 'srq20',
    'phq9': 'phq9',
    'gad7': 'gad7',
    'mbi': 'mbi',
    'audit': 'audit',
    'pss': 'pss',
    'copsoq': 'copsoq',
    'jcq': 'jcq',
    'eri': 'eri',
    'personal_life': 'personal_life',
    'evaluation_360': 'evaluation_360'
  };
  
  return typeMap[appType] || appType;
}
