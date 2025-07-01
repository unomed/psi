
export interface PsychosocialCategory {
  id: string;
  name: string;
  description: string;
  questions: PsychosocialQuestion[];
}

export interface PsychosocialQuestion {
  id: string;
  text: string;
  category: string;
  weight: number;
  reverseScored?: boolean;
}

export const PSYCHOSOCIAL_CATEGORIES: PsychosocialCategory[] = [
  {
    id: "demandas_trabalho",
    name: "Demandas de Trabalho",
    description: "Avalia a carga de trabalho física e mental",
    questions: [
      {
        id: "dt_01",
        text: "Tenho que trabalhar muito rapidamente",
        category: "demandas_trabalho",
        weight: 1
      },
      {
        id: "dt_02", 
        text: "Meu trabalho exige muito de mim",
        category: "demandas_trabalho",
        weight: 1
      },
      {
        id: "dt_03",
        text: "Tenho tempo suficiente para fazer meu trabalho",
        category: "demandas_trabalho",
        weight: 1,
        reverseScored: true
      },
      {
        id: "dt_04",
        text: "Frequentemente tenho que trabalhar com muito esforço",
        category: "demandas_trabalho", 
        weight: 1
      },
      {
        id: "dt_05",
        text: "Meu trabalho me deixa mentalmente exausto",
        category: "demandas_trabalho",
        weight: 1
      }
    ]
  },
  {
    id: "controle_autonomia",
    name: "Controle e Autonomia",
    description: "Avalia o grau de controle sobre o próprio trabalho",
    questions: [
      {
        id: "ca_01",
        text: "Posso decidir como fazer meu trabalho",
        category: "controle_autonomia",
        weight: 1,
        reverseScored: true
      },
      {
        id: "ca_02",
        text: "Tenho influência sobre o que acontece no meu trabalho",
        category: "controle_autonomia", 
        weight: 1,
        reverseScored: true
      },
      {
        id: "ca_03",
        text: "Posso decidir o ritmo do meu trabalho",
        category: "controle_autonomia",
        weight: 1,
        reverseScored: true
      },
      {
        id: "ca_04",
        text: "Tenho liberdade para decidir como fazer meu trabalho",
        category: "controle_autonomia",
        weight: 1,
        reverseScored: true
      }
    ]
  },
  {
    id: "suporte_social",
    name: "Suporte Social",
    description: "Avalia o apoio recebido de colegas e supervisores",
    questions: [
      {
        id: "ss_01",
        text: "Recebo ajuda de meus colegas quando necessário",
        category: "suporte_social",
        weight: 1,
        reverseScored: true
      },
      {
        id: "ss_02",
        text: "Meu supervisor me dá apoio quando preciso",
        category: "suporte_social",
        weight: 1,
        reverseScored: true
      },
      {
        id: "ss_03",
        text: "Sinto-me isolado dos meus colegas de trabalho",
        category: "suporte_social",
        weight: 1
      },
      {
        id: "ss_04",
        text: "Tenho bom relacionamento com meus colegas",
        category: "suporte_social", 
        weight: 1,
        reverseScored: true
      }
    ]
  },
  {
    id: "relacionamentos",
    name: "Relacionamentos Interpessoais",
    description: "Avalia a qualidade dos relacionamentos no trabalho",
    questions: [
      {
        id: "ri_01",
        text: "Existe conflito entre as pessoas no meu local de trabalho",
        category: "relacionamentos",
        weight: 1
      },
      {
        id: "ri_02",
        text: "As pessoas no meu trabalho são hostis umas com as outras",
        category: "relacionamentos",
        weight: 1
      },
      {
        id: "ri_03",
        text: "Sou tratado de forma justa no trabalho",
        category: "relacionamentos",
        weight: 1,
        reverseScored: true
      },
      {
        id: "ri_04",
        text: "Existe boa comunicação entre os colegas",
        category: "relacionamentos",
        weight: 1,
        reverseScored: true
      }
    ]
  },
  {
    id: "clareza_papel",
    name: "Clareza de Papel",
    description: "Avalia a clareza sobre responsabilidades e expectativas",
    questions: [
      {
        id: "cp_01",
        text: "Sei exatamente o que é esperado de mim no trabalho",
        category: "clareza_papel",
        weight: 1,
        reverseScored: true
      },
      {
        id: "cp_02",
        text: "Tenho objetivos claros para meu trabalho",
        category: "clareza_papel",
        weight: 1,
        reverseScored: true
      },
      {
        id: "cp_03",
        text: "Sei quais são minhas responsabilidades",
        category: "clareza_papel",
        weight: 1,
        reverseScored: true
      },
      {
        id: "cp_04",
        text: "Recebo informações contraditórias sobre meu trabalho",
        category: "clareza_papel",
        weight: 1
      }
    ]
  }
];

export const createPsychosocialTemplate = (title: string, categories: string[]) => {
  const selectedQuestions = PSYCHOSOCIAL_CATEGORIES
    .filter(cat => categories.includes(cat.id))
    .flatMap(cat => cat.questions);

  return {
    title,
    description: "Questionário psicossocial estruturado conforme metodologia científica",
    type: "psicossocial",
    scaleType: "Psicossocial",
    questions: selectedQuestions.map((q, index) => ({
      id: q.id,
      text: q.text,
      category: q.category,
      weight: q.weight,
      order_number: index + 1,
      reverse_scored: q.reverseScored || false
    }))
  };
};

// Templates pré-definidos
export const PREDEFINED_PSYCHOSOCIAL_TEMPLATES = [
  {
    id: "avaliacao_completa",
    name: "Avaliação Psicossocial Completa",
    description: "Avaliação abrangente de todos os fatores psicossociais",
    categories: ["demandas_trabalho", "controle_autonomia", "suporte_social", "relacionamentos", "clareza_papel"]
  },
  {
    id: "estresse_ocupacional",
    name: "Estresse Ocupacional",
    description: "Focado em demandas de trabalho e controle",
    categories: ["demandas_trabalho", "controle_autonomia"]
  },
  {
    id: "ambiente_social",
    name: "Ambiente Social de Trabalho", 
    description: "Focado em relacionamentos e suporte social",
    categories: ["suporte_social", "relacionamentos"]
  },
  {
    id: "organizacao_trabalho",
    name: "Organização do Trabalho",
    description: "Focado em clareza de papel e controle",
    categories: ["clareza_papel", "controle_autonomia"]
  }
];
