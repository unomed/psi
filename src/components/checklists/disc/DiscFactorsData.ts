
import { DiscFactor, DiscFactorType } from "@/types";

export interface DiscFactorData {
  name: string;
  description: string;
}

// DISC factor explanations
export const discFactors: Record<DiscFactorType, DiscFactor> = {
  [DiscFactorType.D]: {
    type: DiscFactorType.D,
    name: "Dominância",
    description: "Pessoas com alta dominância são diretas, decisivas, orientadas a resultados e frequentemente assertivas. Preferem liderar e assumir riscos."
  },
  [DiscFactorType.I]: {
    type: DiscFactorType.I,
    name: "Influência",
    description: "Pessoas com alta influência são entusiasmadas, amigáveis, otimistas e carismáticas. Valorizam relações interpessoais e comunicação aberta."
  },
  [DiscFactorType.S]: {
    type: DiscFactorType.S,
    name: "Estabilidade",
    description: "Pessoas com alta estabilidade são pacientes, confiáveis, previsíveis e bons ouvintes. Valorizam cooperação, segurança e rotinas estabelecidas."
  },
  [DiscFactorType.C]: {
    type: DiscFactorType.C,
    name: "Conformidade",
    description: "Pessoas com alta conformidade são analíticas, precisas, sistemáticas e cuidadosas. Valorizam qualidade, conhecimento técnico e processos estruturados."
  }
};

// Get color for factor
export const getFactorColor = (type: DiscFactorType) => {
  switch (type) {
    case DiscFactorType.D: return "text-red-700";
    case DiscFactorType.I: return "text-yellow-700";
    case DiscFactorType.S: return "text-green-700";
    case DiscFactorType.C: return "text-blue-700";
  }
};

// Get background color for factor card
export const getFactorBackgroundColor = (type: DiscFactorType) => {
  switch (type) {
    case DiscFactorType.D: return "bg-red-50 border-red-200";
    case DiscFactorType.I: return "bg-yellow-50 border-yellow-200";
    case DiscFactorType.S: return "bg-green-50 border-green-200";
    case DiscFactorType.C: return "bg-blue-50 border-blue-200";
    default: return "";
  }
};

// Get progress bar color for factor
export const getFactorProgressColor = (type: DiscFactorType) => {
  switch (type) {
    case DiscFactorType.D: return "bg-red-500";
    case DiscFactorType.I: return "bg-yellow-500";
    case DiscFactorType.S: return "bg-green-500";
    case DiscFactorType.C: return "bg-blue-500";
  }
};
