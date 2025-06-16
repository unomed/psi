
import { ChecklistTemplateType } from "@/types";

export function mapDbTemplateTypeToApp(dbType: string): ChecklistTemplateType {
  console.log("Mapeando tipo de template:", dbType);
  
  const typeMap: Record<string, ChecklistTemplateType> = {
    'disc': 'disc',
    'psicossocial': 'psicossocial',
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
    'evaluation_360': 'evaluation_360',
    'custom': 'custom'
  };

  const mappedType = typeMap[dbType] || 'custom';
  console.log("Tipo mapeado de", dbType, "para", mappedType);
  
  return mappedType;
}

// Função para verificar se é template psicossocial
export function isTemplateTypePsicossocial(template: any): boolean {
  return template.type === 'psicossocial' || template.type === 'custom';
}

// Função para obter nome de exibição do tipo
export function getTemplateTypeDisplayName(template: any): string {
  const typeNames: Record<string, string> = {
    'disc': 'DISC',
    'psicossocial': 'Psicossocial',
    'srq20': 'SRQ-20',
    'phq9': 'PHQ-9',
    'gad7': 'GAD-7',
    'mbi': 'MBI',
    'audit': 'AUDIT',
    'pss': 'PSS',
    'personal_life': 'Vida Pessoal',
    'evaluation_360': 'Avaliação 360°',
    'custom': 'Personalizado'
  };
  
  return typeNames[template.type] || 'Personalizado';
}

// Funções para questões padrão
export function getDefaultQuestions(templateType: ChecklistTemplateType) {
  switch (templateType) {
    case 'disc':
      return getDefaultDiscQuestions();
    case 'psicossocial':
      return getDefaultPsicossocialQuestions();
    case 'srq20':
      return getSRQ20Questions();
    case 'phq9':
      return getPHQ9Questions();
    case 'gad7':
      return getGAD7Questions();
    case 'mbi':
      return getMBIQuestions();
    case 'audit':
      return getAUDITQuestions();
    case 'pss':
      return getPSSQuestions();
    case 'personal_life':
      return getPersonalLifeQuestions();
    case 'evaluation_360':
      return getEvaluation360ColleagueQuestions();
    default:
      return [];
  }
}

export function getDefaultDiscQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Sou uma pessoa que gosta de liderar projetos e tomar decisões importantes",
      targetFactor: "D",
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Prefiro trabalhar em equipe e colaborar com outras pessoas",
      targetFactor: "I",
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Valorizo a estabilidade e a consistência no trabalho",
      targetFactor: "S",
      weight: 2
    },
    {
      id: crypto.randomUUID(),
      text: "Sou detalhista e gosto de seguir procedimentos estabelecidos",
      targetFactor: "C",
      weight: 2
    }
  ];
}

export function getDefaultPsicossocialQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Meu trabalho exige que eu aprenda coisas novas",
      category: "Demandas de Trabalho"
    },
    {
      id: crypto.randomUUID(),
      text: "Tenho liberdade para decidir como fazer meu trabalho",
      category: "Controle e Autonomia"
    },
    {
      id: crypto.randomUUID(),
      text: "Recebo apoio adequado dos meus colegas",
      category: "Suporte Social"
    }
  ];
}

export function getSRQ20Questions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Tem dores de cabeça frequentemente?",
      category: "Sintomas Físicos"
    },
    {
      id: crypto.randomUUID(),
      text: "Tem falta de apetite?",
      category: "Sintomas Físicos"
    },
    {
      id: crypto.randomUUID(),
      text: "Dorme mal?",
      category: "Sintomas Físicos"
    }
  ];
}

export function getPHQ9Questions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Pouco interesse ou prazer em fazer as coisas",
      category: "Humor"
    },
    {
      id: crypto.randomUUID(),
      text: "Sentindo-se desanimado, deprimido ou sem esperança",
      category: "Humor"
    }
  ];
}

export function getGAD7Questions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Sentindo-se nervoso, ansioso ou no limite",
      category: "Ansiedade"
    },
    {
      id: crypto.randomUUID(),
      text: "Não conseguindo parar ou controlar as preocupações",
      category: "Ansiedade"
    }
  ];
}

export function getMBIQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Sinto-me emocionalmente esgotado pelo meu trabalho",
      category: "Exaustão Emocional"
    },
    {
      id: crypto.randomUUID(),
      text: "Sinto-me esgotado ao final de um dia de trabalho",
      category: "Exaustão Emocional"
    }
  ];
}

export function getAUDITQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Com que frequência você consome bebidas alcoólicas?",
      category: "Frequência de Uso"
    },
    {
      id: crypto.randomUUID(),
      text: "Quantas doses você consome num dia normal?",
      category: "Quantidade"
    }
  ];
}

export function getPSSQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "No último mês, com que frequência você ficou chateado por causa de algo que aconteceu inesperadamente?",
      category: "Estresse Percebido"
    },
    {
      id: crypto.randomUUID(),
      text: "No último mês, com que frequência você sentiu que não conseguia controlar as coisas importantes da sua vida?",
      category: "Controle"
    }
  ];
}

export function getPersonalLifeQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Estou satisfeito com minha situação financeira atual",
      category: "Situação Financeira"
    },
    {
      id: crypto.randomUUID(),
      text: "Tenho relacionamentos familiares saudáveis",
      category: "Relacionamentos Familiares"
    }
  ];
}

export function getEvaluation360ColleagueQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Demonstra boa colaboração em projetos de equipe",
      category: "Trabalho em Equipe"
    },
    {
      id: crypto.randomUUID(),
      text: "Comunica-se de forma clara e efetiva",
      category: "Comunicação"
    }
  ];
}

export function getEvaluation360ManagerQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      text: "Fornece direcionamento claro para a equipe",
      category: "Liderança"
    },
    {
      id: crypto.randomUUID(),
      text: "Oferece feedback construtivo regularmente",
      category: "Feedback"
    }
  ];
}

export function get360Questions(type: 'colleague' | 'manager') {
  return type === 'colleague' 
    ? getEvaluation360ColleagueQuestions()
    : getEvaluation360ManagerQuestions();
}

// Funções para conversão de dados do banco
export function getSafeDbScaleType(scaleType: string): string {
  const validTypes = ['yes_no', 'likert', 'frequency', 'psicossocial'];
  return validTypes.includes(scaleType) ? scaleType : 'likert';
}

export function getSafeDbTemplateType(templateType: string): string {
  const validTypes = [
    'disc', 'psicossocial', 'srq20', 'phq9', 'gad7', 'mbi', 
    'audit', 'pss', 'personal_life', 'evaluation_360', 'custom'
  ];
  return validTypes.includes(templateType) ? templateType : 'custom';
}

export function formatQuestionsForDb(questions: any[]) {
  return questions.map((question, index) => ({
    question_text: question.text,
    target_factor: question.targetFactor || question.category || null,
    weight: question.weight || 1,
    order_number: index + 1
  }));
}
