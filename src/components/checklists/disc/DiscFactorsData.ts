
import { DiscFactor, DiscFactorType } from '@/types';

export const DISC_FACTORS: DiscFactor[] = [
  {
    type: DiscFactorType.D,
    name: 'Dominância',
    description: 'Pessoas com alta pontuação em D são diretas, decididas e orientadas para resultados.',
    characteristics: [
      'Direto e assertivo',
      'Orientado para resultados',
      'Toma decisões rapidamente',
      'Gosta de desafios',
      'Confiante e determinado'
    ]
  },
  {
    type: DiscFactorType.I,
    name: 'Influência',
    description: 'Pessoas com alta pontuação em I são sociáveis, comunicativas e otimistas.',
    characteristics: [
      'Sociável e extrovertido',
      'Comunicativo e persuasivo',
      'Otimista e entusiasta',
      'Gosta de trabalhar em equipe',
      'Inspira e motiva outros'
    ]
  },
  {
    type: DiscFactorType.S,
    name: 'Estabilidade',
    description: 'Pessoas com alta pontuação em S são pacientes, confiáveis e cooperativas.',
    characteristics: [
      'Paciente e calmo',
      'Confiável e leal',
      'Cooperativo e prestativo',
      'Prefere ambiente estável',
      'Bom ouvinte'
    ]
  },
  {
    type: DiscFactorType.C,
    name: 'Conformidade',
    description: 'Pessoas com alta pontuação em C são analíticas, precisas e seguem regras.',
    characteristics: [
      'Analítico e preciso',
      'Segue regras e procedimentos',
      'Atento aos detalhes',
      'Busca qualidade',
      'Diplomático e cauteloso'
    ]
  }
];

export const getFactorProgressColor = (factor: DiscFactorType): string => {
  const colors = {
    [DiscFactorType.D]: 'bg-red-500',
    [DiscFactorType.I]: 'bg-yellow-500',
    [DiscFactorType.S]: 'bg-green-500',
    [DiscFactorType.C]: 'bg-blue-500'
  };
  return colors[factor] || 'bg-gray-500';
};

export const getFactorColor = (factor: DiscFactorType): string => {
  const colors = {
    [DiscFactorType.D]: 'text-red-600',
    [DiscFactorType.I]: 'text-yellow-600',
    [DiscFactorType.S]: 'text-green-600',
    [DiscFactorType.C]: 'text-blue-600'
  };
  return colors[factor] || 'text-gray-600';
};

export const getFactorBgColor = (factor: DiscFactorType): string => {
  const colors = {
    [DiscFactorType.D]: 'bg-red-50',
    [DiscFactorType.I]: 'bg-yellow-50',
    [DiscFactorType.S]: 'bg-green-50',
    [DiscFactorType.C]: 'bg-blue-50'
  };
  return colors[factor] || 'bg-gray-50';
};

export const getFactorByType = (type: DiscFactorType): DiscFactor => {
  return DISC_FACTORS.find(factor => factor.type === type) || DISC_FACTORS[0];
};

export const getDominantFactor = (scores: Record<string, number>): DiscFactorType => {
  const maxScore = Math.max(...Object.values(scores));
  const dominantKey = Object.keys(scores).find(key => scores[key] === maxScore);
  return (dominantKey as DiscFactorType) || DiscFactorType.D;
};

export const calculateFactorPercentage = (score: number, maxScore: number = 100): number => {
  return Math.round((score / maxScore) * 100);
};

// Compatibility exports
export const discFactors = DISC_FACTORS;
