
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

// Perguntas padrão para Psicossocial (baseado no MTE) - COMPLETO
export function getDefaultPsicossocialQuestions(): PsicossocialQuestion[] {
  return [
    // Demandas de Trabalho
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
      text: "Frequentemente tenho que trabalhar com muito esforço",
      category: "Demandas de Trabalho",
      weight: 1
    },
    {
      id: "psico_5",
      text: "Meu trabalho me deixa mentalmente exausto",
      category: "Demandas de Trabalho",
      weight: 1
    },
    
    // Controle e Autonomia
    {
      id: "psico_6",
      text: "Posso decidir como fazer meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    {
      id: "psico_7",
      text: "Tenho influência sobre o que acontece no meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    {
      id: "psico_8",
      text: "Posso decidir o ritmo do meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    {
      id: "psico_9",
      text: "Tenho liberdade para decidir como fazer meu trabalho",
      category: "Controle e Autonomia",
      weight: 1
    },
    
    // Suporte Social
    {
      id: "psico_10",
      text: "Recebo ajuda de meus colegas quando necessário",
      category: "Suporte Social",
      weight: 1
    },
    {
      id: "psico_11",
      text: "Meu supervisor me dá apoio quando preciso",
      category: "Suporte Social",
      weight: 1
    },
    {
      id: "psico_12",
      text: "Sinto-me isolado dos meus colegas de trabalho",
      category: "Suporte Social",
      weight: 1
    },
    {
      id: "psico_13",
      text: "Tenho bom relacionamento com meus colegas",
      category: "Suporte Social",
      weight: 1
    },
    
    // Relacionamentos Interpessoais
    {
      id: "psico_14",
      text: "Existe conflito entre as pessoas no meu local de trabalho",
      category: "Relacionamentos Interpessoais",
      weight: 1
    },
    {
      id: "psico_15",
      text: "As pessoas no meu trabalho são hostis umas com as outras",
      category: "Relacionamentos Interpessoais",
      weight: 1
    },
    {
      id: "psico_16",
      text: "Sou tratado de forma justa no trabalho",
      category: "Relacionamentos Interpessoais",
      weight: 1
    },
    {
      id: "psico_17",
      text: "Existe boa comunicação entre os colegas",
      category: "Relacionamentos Interpessoais",
      weight: 1
    },
    
    // Clareza de Papel
    {
      id: "psico_18",
      text: "Sei exatamente o que é esperado de mim no trabalho",
      category: "Clareza de Papel",
      weight: 1
    },
    {
      id: "psico_19",
      text: "Tenho objetivos claros para meu trabalho",
      category: "Clareza de Papel",
      weight: 1
    },
    {
      id: "psico_20",
      text: "Sei quais são minhas responsabilidades",
      category: "Clareza de Papel",
      weight: 1
    },
    {
      id: "psico_21",
      text: "Recebo informações contraditórias sobre meu trabalho",
      category: "Clareza de Papel",
      weight: 1
    },
    
    // Reconhecimento e Recompensas
    {
      id: "psico_22",
      text: "Recebo reconhecimento adequado pelo meu trabalho",
      category: "Reconhecimento e Recompensas",
      weight: 1
    },
    {
      id: "psico_23",
      text: "Sou recompensado de acordo com meus esforços",
      category: "Reconhecimento e Recompensas",
      weight: 1
    },
    {
      id: "psico_24",
      text: "Meu salário é adequado para o trabalho que realizo",
      category: "Reconhecimento e Recompensas",
      weight: 1
    },
    {
      id: "psico_25",
      text: "Tenho oportunidades de crescimento profissional",
      category: "Reconhecimento e Recompensas",
      weight: 1
    },
    
    // Gestão de Mudanças
    {
      id: "psico_26",
      text: "Sou informado sobre mudanças que afetam meu trabalho",
      category: "Gestão de Mudanças",
      weight: 1
    },
    {
      id: "psico_27",
      text: "Tenho tempo adequado para me adaptar às mudanças",
      category: "Gestão de Mudanças",
      weight: 1
    },
    {
      id: "psico_28",
      text: "Recebo treinamento quando há mudanças no processo",
      category: "Gestão de Mudanças",
      weight: 1
    },
    {
      id: "psico_29",
      text: "Posso expressar minhas opiniões sobre as mudanças",
      category: "Gestão de Mudanças",
      weight: 1
    },
    {
      id: "psico_30",
      text: "As mudanças organizacionais são bem planejadas",
      category: "Gestão de Mudanças",
      weight: 1
    },
    
    // Equilíbrio Trabalho-Vida
    {
      id: "psico_31",
      text: "Consigo equilibrar trabalho e vida pessoal",
      category: "Equilíbrio Trabalho-Vida",
      weight: 1
    },
    {
      id: "psico_32",
      text: "Tenho tempo suficiente para minha família",
      category: "Equilíbrio Trabalho-Vida",
      weight: 1
    },
    {
      id: "psico_33",
      text: "O trabalho interfere na minha vida pessoal",
      category: "Equilíbrio Trabalho-Vida",
      weight: 1
    },
    {
      id: "psico_34",
      text: "Tenho flexibilidade de horários quando necessário",
      category: "Equilíbrio Trabalho-Vida",
      weight: 1
    },
    {
      id: "psico_35",
      text: "Posso tirar férias quando preciso",
      category: "Equilíbrio Trabalho-Vida",
      weight: 1
    },
    
    // Impactos na Saúde
    {
      id: "psico_36",
      text: "O trabalho tem afetado minha saúde física",
      category: "Impactos na Saúde",
      weight: 1
    },
    {
      id: "psico_37",
      text: "O trabalho tem afetado minha saúde mental",
      category: "Impactos na Saúde",
      weight: 1
    },
    {
      id: "psico_38",
      text: "Tenho dificuldade para dormir devido ao trabalho",
      category: "Impactos na Saúde",
      weight: 1
    },
    {
      id: "psico_39",
      text: "Sinto-me exausto após o trabalho",
      category: "Impactos na Saúde",
      weight: 1
    },
    {
      id: "psico_40",
      text: "O ambiente de trabalho é seguro e saudável",
      category: "Impactos na Saúde",
      weight: 1
    }
  ];
}

// Perguntas SRQ-20 (Self-Reporting Questionnaire) - COMPLETO
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

// Perguntas PHQ-9 (Patient Health Questionnaire) - COMPLETO
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

// Perguntas GAD-7 (Generalized Anxiety Disorder) - COMPLETO
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

// Perguntas MBI (Maslach Burnout Inventory) - NOVO COMPLETO
export function getMBIQuestions(): PsicossocialQuestion[] {
  return [
    // Exaustão Emocional
    { id: "mbi_1", text: "Sinto-me emocionalmente esgotado pelo meu trabalho", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_2", text: "Estou exausto no final do dia de trabalho", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_3", text: "Sinto-me fatigado quando me levanto e tenho que enfrentar outro dia de trabalho", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_4", text: "Trabalhar com pessoas todo dia é realmente um estresse para mim", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_5", text: "Sinto-me esgotado pelo meu trabalho", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_6", text: "Sinto-me frustrado em meu trabalho", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_7", text: "Sinto que estou trabalhando demais em meu emprego", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_8", text: "Trabalhar diretamente com pessoas me causa estresse", category: "Exaustão Emocional", weight: 1 },
    { id: "mbi_9", text: "Sinto-me como se estivesse no limite", category: "Exaustão Emocional", weight: 1 },
    
    // Despersonalização
    { id: "mbi_10", text: "Trato alguns clientes/colegas como se fossem objetos impessoais", category: "Despersonalização", weight: 1 },
    { id: "mbi_11", text: "Tornei-me mais insensível com as pessoas desde que comecei este trabalho", category: "Despersonalização", weight: 1 },
    { id: "mbi_12", text: "Preocupa-me o fato de que este trabalho esteja me endurecendo emocionalmente", category: "Despersonalização", weight: 1 },
    { id: "mbi_13", text: "Não me preocupo realmente com o que acontece com algumas pessoas", category: "Despersonalização", weight: 1 },
    { id: "mbi_14", text: "Sinto que os clientes/colegas me culpam por alguns de seus problemas", category: "Despersonalização", weight: 1 },
    
    // Realização Pessoal
    { id: "mbi_15", text: "Posso entender facilmente como meus clientes/colegas se sentem", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_16", text: "Lido eficazmente com os problemas das pessoas", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_17", text: "Sinto que influencio positivamente a vida das pessoas através do meu trabalho", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_18", text: "Sinto-me estimulado depois de trabalhar próximo aos meus clientes/colegas", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_19", text: "Tenho conseguido muitas coisas valiosas neste trabalho", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_20", text: "No meu trabalho, lido com problemas emocionais de forma calma", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_21", text: "Sinto-me muito energético", category: "Realização Pessoal", weight: 1 },
    { id: "mbi_22", text: "Crio facilmente uma atmosfera relaxada com meus clientes/colegas", category: "Realização Pessoal", weight: 1 }
  ];
}

// Perguntas AUDIT (Alcohol Use Disorders Identification Test) - NOVO COMPLETO
export function getAUDITQuestions(): PsicossocialQuestion[] {
  return [
    { id: "audit_1", text: "Com que frequência você consome bebidas alcoólicas?", category: "Frequência de Uso", weight: 1 },
    { id: "audit_2", text: "Quantas doses de álcool você consome tipicamente ao beber?", category: "Quantidade", weight: 1 },
    { id: "audit_3", text: "Com que frequência você bebe seis ou mais doses de uma vez?", category: "Binge Drinking", weight: 1 },
    { id: "audit_4", text: "Durante o último ano, com que frequência você achou que não conseguiria parar de beber uma vez tendo começado?", category: "Controle", weight: 1 },
    { id: "audit_5", text: "Durante o último ano, com que frequência você não conseguiu fazer o que era esperado de você por causa do álcool?", category: "Funcionamento", weight: 1 },
    { id: "audit_6", text: "Durante o último ano, com que frequência você precisou beber pela manhã para se recuperar depois de ter bebido muito no dia anterior?", category: "Dependência", weight: 1 },
    { id: "audit_7", text: "Durante o último ano, com que frequência você se sentiu culpado ou com remorso depois de ter bebido?", category: "Sentimentos", weight: 1 },
    { id: "audit_8", text: "Durante o último ano, com que frequência você foi incapaz de lembrar o que aconteceu na noite anterior por causa do álcool?", category: "Memória", weight: 1 },
    { id: "audit_9", text: "Você ou alguém já se machucou como resultado do seu beber?", category: "Consequências", weight: 1 },
    { id: "audit_10", text: "Algum parente, amigo, médico ou outro profissional da saúde já demonstrou preocupação com o seu beber ou sugeriu que você parasse?", category: "Preocupação Externa", weight: 1 }
  ];
}

// Perguntas PSS (Perceived Stress Scale) - NOVO COMPLETO
export function getPSSQuestions(): PsicossocialQuestion[] {
  return [
    { id: "pss_1", text: "Com que frequência você tem ficado aborrecido por causa de algo que aconteceu inesperadamente?", category: "Estresse Percebido", weight: 1 },
    { id: "pss_2", text: "Com que frequência você tem se sentido incapaz de controlar as coisas importantes em sua vida?", category: "Controle", weight: 1 },
    { id: "pss_3", text: "Com que frequência você tem se sentido nervoso e estressado?", category: "Estresse Percebido", weight: 1 },
    { id: "pss_4", text: "Com que frequência você tem tratado com sucesso dos problemas difíceis da vida?", category: "Enfrentamento", weight: 1 },
    { id: "pss_5", text: "Com que frequência você tem sentido que está enfrentando efetivamente as mudanças importantes que estão ocorrendo em sua vida?", category: "Adaptação", weight: 1 },
    { id: "pss_6", text: "Com que frequência você tem se sentido confiante na sua habilidade de resolver problemas pessoais?", category: "Autoeficácia", weight: 1 },
    { id: "pss_7", text: "Com que frequência você tem sentido que as coisas estão acontecendo de acordo com a sua vontade?", category: "Controle", weight: 1 },
    { id: "pss_8", text: "Com que frequência você tem achado que não conseguiria lidar com todas as coisas que você tem que fazer?", category: "Sobrecarga", weight: 1 },
    { id: "pss_9", text: "Com que frequência você tem conseguido controlar as irritações em sua vida?", category: "Controle Emocional", weight: 1 },
    { id: "pss_10", text: "Com que frequência você tem se sentido que as coisas estão sob o seu controle?", category: "Controle", weight: 1 },
    { id: "pss_11", text: "Com que frequência você tem ficado irritado porque as coisas que acontecem estão fora do seu controle?", category: "Frustração", weight: 1 },
    { id: "pss_12", text: "Com que frequência você tem se encontrado pensando sobre as coisas que deve fazer?", category: "Preocupação", weight: 1 },
    { id: "pss_13", text: "Com que frequência você tem conseguido controlar a maneira como gasta seu tempo?", category: "Gestão do Tempo", weight: 1 },
    { id: "pss_14", text: "Com que frequência você tem sentido que as dificuldades se acumulam a ponto de você acreditar que não pode superá-las?", category: "Sobrecarga", weight: 1 }
  ];
}

// Perguntas de Vida Pessoal/Familiar - EXPANDIDO
export function getPersonalLifeQuestions(): PersonalLifeQuestion[] {
  return [
    { id: "personal_1", text: "Como você avalia sua situação financeira atual?", category: "Situação Financeira", weight: 1, isPrivate: true },
    { id: "personal_2", text: "Tem dificuldades financeiras que o preocupam?", category: "Situação Financeira", weight: 1, isPrivate: true },
    { id: "personal_3", text: "Consegue arcar com todas as despesas básicas da família?", category: "Situação Financeira", weight: 1, isPrivate: true },
    { id: "personal_4", text: "Como está o relacionamento com sua família?", category: "Relacionamentos Familiares", weight: 1, isPrivate: true },
    { id: "personal_5", text: "Tem conflitos familiares frequentes?", category: "Relacionamentos Familiares", weight: 1, isPrivate: true },
    { id: "personal_6", text: "Sente apoio emocional da sua família?", category: "Relacionamentos Familiares", weight: 1, isPrivate: true },
    { id: "personal_7", text: "Como avalia sua saúde física geral?", category: "Saúde Física", weight: 1, isPrivate: true },
    { id: "personal_8", text: "Tem problemas de saúde que o preocupam?", category: "Saúde Física", weight: 1, isPrivate: true },
    { id: "personal_9", text: "Faz acompanhamento médico regular?", category: "Saúde Física", weight: 1, isPrivate: true },
    { id: "personal_10", text: "Consegue equilibrar trabalho e vida pessoal?", category: "Equilíbrio Vida-Trabalho", weight: 1, isPrivate: true },
    { id: "personal_11", text: "Sente que tem tempo suficiente para sua família?", category: "Equilíbrio Vida-Trabalho", weight: 1, isPrivate: true },
    { id: "personal_12", text: "Consegue descansar adequadamente nos fins de semana?", category: "Equilíbrio Vida-Trabalho", weight: 1, isPrivate: true },
    { id: "personal_13", text: "Como está sua vida social fora do trabalho?", category: "Vida Social", weight: 1, isPrivate: true },
    { id: "personal_14", text: "Tem apoio emocional de amigos/família?", category: "Suporte Social", weight: 1, isPrivate: true },
    { id: "personal_15", text: "Sente-se isolado socialmente?", category: "Vida Social", weight: 1, isPrivate: true }
  ];
}

// Perguntas para Avaliação 360° - Colegas - EXPANDIDO
export function getEvaluation360ColleagueQuestions(): Evaluation360Question[] {
  return [
    { id: "360_col_1", text: "Demonstra colaboração no trabalho em equipe", category: "Trabalho em Equipe", evaluationType: "colleague", weight: 1 },
    { id: "360_col_2", text: "Comunica-se de forma clara e efetiva", category: "Comunicação", evaluationType: "colleague", weight: 1 },
    { id: "360_col_3", text: "É confiável e cumpre com seus compromissos", category: "Confiabilidade", evaluationType: "colleague", weight: 1 },
    { id: "360_col_4", text: "Oferece ajuda quando necessário", category: "Colaboração", evaluationType: "colleague", weight: 1 },
    { id: "360_col_5", text: "Mantém relacionamento profissional respeitoso", category: "Relacionamento", evaluationType: "colleague", weight: 1 },
    { id: "360_col_6", text: "Contribui positivamente para o ambiente de trabalho", category: "Ambiente", evaluationType: "colleague", weight: 1 },
    { id: "360_col_7", text: "Demonstra iniciativa em suas atividades", category: "Proatividade", evaluationType: "colleague", weight: 1 },
    { id: "360_col_8", text: "É receptivo a feedback e sugestões", category: "Feedback", evaluationType: "colleague", weight: 1 },
    { id: "360_col_9", text: "Compartilha conhecimentos e experiências", category: "Compartilhamento", evaluationType: "colleague", weight: 1 },
    { id: "360_col_10", text: "Resolve conflitos de forma construtiva", category: "Resolução de Conflitos", evaluationType: "colleague", weight: 1 }
  ];
}

// Perguntas para Avaliação 360° - Gestores - EXPANDIDO
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
    { id: "360_mgr_10", text: "É acessível para discutir problemas e preocupações", category: "Acessibilidade", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_11", text: "Delega responsabilidades adequadamente", category: "Delegação", evaluationType: "manager", weight: 1 },
    { id: "360_mgr_12", text: "Toma decisões de forma oportuna", category: "Tomada de Decisão", evaluationType: "manager", weight: 1 }
  ];
}

// Função para carregar perguntas padrão baseado no tipo - EXPANDIDA
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
    case "mbi":
      return getMBIQuestions();
    case "audit":
      return getAUDITQuestions();
    case "pss":
      return getPSSQuestions();
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
