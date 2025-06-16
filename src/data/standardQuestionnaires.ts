
import { ChecklistTemplate } from "@/types/checklist";
import { ScaleType } from "@/types";
import { DiscFactorType } from "@/types/disc";
import { 
  getDefaultDiscQuestions, 
  getDefaultPsicossocialQuestions, 
  getSRQ20Questions, 
  getPHQ9Questions, 
  getGAD7Questions,
  getMBIQuestions,
  getAUDITQuestions,
  getPSSQuestions,
  getPersonalLifeQuestions,
  getEvaluation360ColleagueQuestions,
  getEvaluation360ManagerQuestions
} from "@/services/checklist/templateUtils";

export const STANDARD_QUESTIONNAIRE_TEMPLATES = [
  {
    id: "disc_standard",
    name: "Avaliação DISC Padrão",
    description: "Avaliação de perfil comportamental baseada na metodologia DISC",
    type: "disc" as const,
    scaleType: ScaleType.YesNo,
    questions: [
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
    ],
    estimatedTimeMinutes: 10,
    instructions: "Responda de acordo com como você geralmente se comporta no ambiente de trabalho."
  },
  {
    id: "psicossocial_mte",
    name: "Avaliação Psicossocial - MTE Completa",
    description: "Avaliação completa baseada no Guia de Fatores de Riscos Psicossociais do Ministério do Trabalho e Emprego",
    type: "psicossocial" as const,
    scaleType: ScaleType.Psicossocial,
    questions: getDefaultPsicossocialQuestions(),
    estimatedTimeMinutes: 25,
    instructions: "Avalie cada afirmação considerando sua experiência no trabalho nos últimos 6 meses."
  },
  {
    id: "srq20_standard",
    name: "SRQ-20 - Transtornos Mentais Comuns",
    description: "Self-Reporting Questionnaire para identificação de transtornos mentais comuns",
    type: "srq20" as const,
    scaleType: ScaleType.YesNo,
    questions: getSRQ20Questions(),
    estimatedTimeMinutes: 8,
    instructions: "Responda SIM se o sintoma esteve presente nos últimos 30 dias."
  },
  {
    id: "phq9_standard",
    name: "PHQ-9 - Questionário de Saúde Mental",
    description: "Patient Health Questionnaire para avaliação de sintomas depressivos",
    type: "phq9" as const,
    scaleType: ScaleType.Frequency,
    questions: getPHQ9Questions(),
    estimatedTimeMinutes: 5,
    instructions: "Indique com que frequência você foi incomodado por cada problema nas últimas 2 semanas."
  },
  {
    id: "gad7_standard",
    name: "GAD-7 - Transtorno de Ansiedade",
    description: "Generalized Anxiety Disorder Scale para avaliação de ansiedade",
    type: "gad7" as const,
    scaleType: ScaleType.Frequency,
    questions: getGAD7Questions(),
    estimatedTimeMinutes: 5,
    instructions: "Indique com que frequência você foi incomodado pelos seguintes problemas nas últimas 2 semanas."
  },
  {
    id: "mbi_standard",
    name: "MBI - Inventário de Burnout de Maslach",
    description: "Avaliação de síndrome de burnout em três dimensões: exaustão emocional, despersonalização e realização pessoal",
    type: "mbi" as const,
    scaleType: ScaleType.Frequency,
    questions: getMBIQuestions(),
    estimatedTimeMinutes: 15,
    instructions: "Indique com que frequência você experiencia cada situação descrita."
  },
  {
    id: "audit_standard",
    name: "AUDIT - Transtornos por Uso de Álcool",
    description: "Alcohol Use Disorders Identification Test para identificação de problemas relacionados ao álcool",
    type: "audit" as const,
    scaleType: ScaleType.Frequency,
    questions: getAUDITQuestions(),
    estimatedTimeMinutes: 5,
    instructions: "Responda honestamente sobre seus hábitos relacionados ao consumo de álcool."
  },
  {
    id: "pss_standard",
    name: "PSS - Escala de Estresse Percebido",
    description: "Perceived Stress Scale para avaliação do nível de estresse percebido",
    type: "pss" as const,
    scaleType: ScaleType.Frequency,
    questions: getPSSQuestions(),
    estimatedTimeMinutes: 8,
    instructions: "Pense em como você se sentiu e pensou durante o último mês."
  },
  {
    id: "personal_life_standard",
    name: "Questionário de Vida Pessoal e Familiar",
    description: "Avaliação de fatores pessoais e familiares que podem influenciar o bem-estar no trabalho",
    type: "personal_life" as const,
    scaleType: ScaleType.Likert,
    questions: getPersonalLifeQuestions(),
    estimatedTimeMinutes: 12,
    instructions: "Este questionário é confidencial. Responda honestamente sobre sua situação pessoal."
  },
  {
    id: "evaluation_360_colleague",
    name: "Avaliação 360° - Colegas de Trabalho",
    description: "Avaliação de colegas de trabalho do mesmo nível hierárquico",
    type: "evaluation_360" as const,
    scaleType: ScaleType.Likert,
    questions: getEvaluation360ColleagueQuestions(),
    estimatedTimeMinutes: 10,
    instructions: "Avalie seu colega de trabalho de forma honesta e construtiva. Suas respostas são anônimas.",
    isAnonymous: true,
    restrictToSector: true
  },
  {
    id: "evaluation_360_manager",
    name: "Avaliação 360° - Gestores",
    description: "Avaliação de gestores e supervisores",
    type: "evaluation_360" as const,
    scaleType: ScaleType.Likert,
    questions: getEvaluation360ManagerQuestions(),
    estimatedTimeMinutes: 15,
    instructions: "Avalie seu gestor de forma honesta e construtiva. Suas respostas são anônimas.",
    isAnonymous: true,
    restrictToSector: true
  }
];

export function createStandardTemplate(templateId: string): ChecklistTemplate | null {
  const template = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  return {
    id: crypto.randomUUID(),
    title: template.name,
    description: template.description,
    type: template.type,
    scaleType: template.scaleType,
    questions: template.questions,
    createdAt: new Date(),
    isStandard: true,
    estimatedTimeMinutes: template.estimatedTimeMinutes,
    instructions: template.instructions,
    isAnonymous: template.isAnonymous || false,
    restrictToSector: template.restrictToSector || false
  };
}
