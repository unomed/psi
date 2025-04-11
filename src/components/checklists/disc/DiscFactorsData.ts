
import { DiscFactor, DiscFactorType } from "@/types/checklist";

// DISC factor explanations
export const discFactors: Record<DiscFactorType, DiscFactor> = {
  D: {
    type: "D",
    name: "Dominância",
    description: "Pessoas com alta dominância são diretas, decisivas, orientadas a resultados e frequentemente assertivas. Preferem liderar e assumir riscos."
  },
  I: {
    type: "I",
    name: "Influência",
    description: "Pessoas com alta influência são entusiasmadas, amigáveis, otimistas e carismáticas. Valorizam relações interpessoais e comunicação aberta."
  },
  S: {
    type: "S",
    name: "Estabilidade",
    description: "Pessoas com alta estabilidade são pacientes, confiáveis, previsíveis e bons ouvintes. Valorizam cooperação, segurança e rotinas estabelecidas."
  },
  C: {
    type: "C",
    name: "Conformidade",
    description: "Pessoas com alta conformidade são analíticas, precisas, sistemáticas e cuidadosas. Valorizam qualidade, conhecimento técnico e processos estruturados."
  }
};

// Get color for factor
export const getFactorColor = (type: DiscFactorType) => {
  switch (type) {
    case "D": return "text-red-700";
    case "I": return "text-yellow-700";
    case "S": return "text-green-700";
    case "C": return "text-blue-700";
  }
};

// Get background color for factor card
export const getFactorBackgroundColor = (type: string) => {
  switch (type) {
    case "D": return "bg-red-50 border-red-200";
    case "I": return "bg-yellow-50 border-yellow-200";
    case "S": return "bg-green-50 border-green-200";
    case "C": return "bg-blue-50 border-blue-200";
    default: return "";
  }
};

// Get progress bar color for factor
export const getFactorProgressColor = (type: DiscFactorType) => {
  switch (type) {
    case "D": return "bg-red-500";
    case "I": return "bg-yellow-500";
    case "S": return "bg-green-500";
    case "C": return "bg-blue-500";
  }
};
