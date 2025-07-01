
import { PsicossocialQuestion } from "@/types/checklist";

export const MTE_PSICOSSOCIAL_TEMPLATE: PsicossocialQuestion[] = [
  // Organização do trabalho
  {
    id: "org_01",
    text: "Tenho autonomia para organizar meu trabalho da forma que considero mais adequada",
    category: "Organização do trabalho"
  },
  {
    id: "org_02", 
    text: "Participo das decisões que afetam diretamente meu trabalho",
    category: "Organização do trabalho"
  },
  {
    id: "org_03",
    text: "Recebo informações claras sobre o que é esperado do meu trabalho",
    category: "Organização do trabalho"
  },
  {
    id: "org_04",
    text: "O ritmo de trabalho me permite realizar as tarefas com qualidade",
    category: "Organização do trabalho"
  },
  {
    id: "org_05",
    text: "Tenho tempo suficiente para realizar minhas tarefas sem pressão excessiva",
    category: "Organização do trabalho"
  },

  // Condições ambientais de trabalho
  {
    id: "amb_01",
    text: "O ambiente físico de trabalho é adequado para realizar minhas atividades",
    category: "Condições ambientais de trabalho"
  },
  {
    id: "amb_02",
    text: "Tenho acesso aos equipamentos e materiais necessários para fazer meu trabalho",
    category: "Condições ambientais de trabalho"
  },
  {
    id: "amb_03",
    text: "O nível de ruído no ambiente de trabalho não interfere na minha concentração",
    category: "Condições ambientais de trabalho"
  },
  {
    id: "amb_04",
    text: "A iluminação e ventilação do local de trabalho são adequadas",
    category: "Condições ambientais de trabalho"
  },
  {
    id: "amb_05",
    text: "Me sinto seguro em relação aos riscos físicos do meu ambiente de trabalho",
    category: "Condições ambientais de trabalho"
  },

  // Relações socioprofissionais
  {
    id: "rel_01",
    text: "Tenho um bom relacionamento com meus colegas de trabalho",
    category: "Relações socioprofissionais"
  },
  {
    id: "rel_02",
    text: "Recebo apoio dos meus superiores quando necessário",
    category: "Relações socioprofissionais"
  },
  {
    id: "rel_03",
    text: "Existe respeito mútuo entre os membros da equipe",
    category: "Relações socioprofissionais"
  },
  {
    id: "rel_04",
    text: "Conflitos são resolvidos de forma construtiva na minha equipe",
    category: "Relações socioprofissionais"
  },
  {
    id: "rel_05",
    text: "Me sinto à vontade para expressar minhas opiniões no trabalho",
    category: "Relações socioprofissionais"
  },

  // Reconhecimento e crescimento profissional
  {
    id: "rec_01",
    text: "Meu trabalho é reconhecido e valorizado pela organização",
    category: "Reconhecimento e crescimento profissional"
  },
  {
    id: "rec_02",
    text: "Tenho oportunidades de desenvolvimento e crescimento profissional",
    category: "Reconhecimento e crescimento profissional"
  },
  {
    id: "rec_03",
    text: "Recebo feedback regular sobre meu desempenho",
    category: "Reconhecimento e crescimento profissional"
  },
  {
    id: "rec_04",
    text: "A remuneração é adequada ao trabalho que realizo",
    category: "Reconhecimento e crescimento profissional"
  },
  {
    id: "rec_05",
    text: "Tenho perspectivas claras de carreira na organização",
    category: "Reconhecimento e crescimento profissional"
  },

  // Elo trabalho-vida social
  {
    id: "elo_01",
    text: "Consigo conciliar as demandas do trabalho com minha vida pessoal",
    category: "Elo trabalho-vida social"
  },
  {
    id: "elo_02",
    text: "Raramente levo trabalho para casa ou trabalho além do horário",
    category: "Elo trabalho-vida social"
  },
  {
    id: "elo_03",
    text: "Tenho tempo adequado para descanso e lazer",
    category: "Elo trabalho-vida social"
  },
  {
    id: "elo_04",
    text: "O trabalho não interfere negativamente na minha saúde física e mental",
    category: "Elo trabalho-vida social"
  },
  {
    id: "elo_05",
    text: "Me sinto motivado e satisfeito com meu trabalho",
    category: "Elo trabalho-vida social"
  }
];

export const PSICOSSOCIAL_CATEGORIES = [
  "Organização do trabalho",
  "Condições ambientais de trabalho", 
  "Relações socioprofissionais",
  "Reconhecimento e crescimento profissional",
  "Elo trabalho-vida social"
];

export const RISK_THRESHOLDS = {
  baixo: { level: "baixo", min: 0, max: 30, color: "green", label: "Baixo Risco" },
  medio: { level: "medio", min: 31, max: 60, color: "yellow", label: "Médio Risco" },
  alto: { level: "alto", min: 61, max: 80, color: "orange", label: "Alto Risco" },
  critico: { level: "critico", min: 81, max: 100, color: "red", label: "Risco Crítico" }
};

export function calculatePsicossocialRisk(score: number): { level: string; color: string; label: string } {
  if (score <= 30) return RISK_THRESHOLDS.baixo;
  if (score <= 60) return RISK_THRESHOLDS.medio;
  if (score <= 80) return RISK_THRESHOLDS.alto;
  return RISK_THRESHOLDS.critico;
}
