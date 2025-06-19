
import { DiscFactor, DiscFactorType } from "@/types";

// DISC Factors data
export const DISC_FACTORS: Record<DiscFactorType, DiscFactor> = {
  [DiscFactorType.D]: {
    type: DiscFactorType.D,
    name: "Dominância",
    description: "Foco em resultados, controle e desafios",
    characteristics: ["Direto", "Decisivo", "Orientado a resultados", "Competitivo", "Gosta de desafios"]
  },
  [DiscFactorType.I]: {
    type: DiscFactorType.I,
    name: "Influência", 
    description: "Foco em pessoas, comunicação e otimismo",
    characteristics: ["Sociável", "Comunicativo", "Otimista", "Persuasivo", "Gosta de interação"]
  },
  [DiscFactorType.S]: {
    type: DiscFact orType.S,
    name: "Estabilidade",
    description: "Foco em estabilidade, cooperação e harmonia",
    characteristics: ["Paciente", "Confiável", "Cooperativo", "Leal", "Busca harmonia"]
  },
  [DiscFactorType.C]: {
    type: DiscFactorType.C,
    name: "Conformidade",
    description: "Foco em precisão, qualidade e análise",
    characteristics: ["Analítico", "Detalhista", "Preciso", "Sistemático", "Busca qualidade"]
  }
};

export const getFactorColor = (factorType: DiscFactorType): string => {
  switch (factorType) {
    case DiscFactorType.D:
      return "text-red-600";
    case DiscFactorType.I:
      return "text-yellow-600";
    case DiscFactorType.S:
      return "text-green-600";
    case DiscFactorType.C:
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

export const getFactorBackgroundColor = (factorType: DiscFactorType): string => {
  switch (factorType) {
    case DiscFactorType.D:
      return "bg-red-50 border-red-200";
    case DiscFactorType.I:
      return "bg-yellow-50 border-yellow-200";
    case DiscFactorType.S:
      return "bg-green-50 border-green-200";
    case DiscFactorType.C:
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};
