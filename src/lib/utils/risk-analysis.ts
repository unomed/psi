
// ===== UTILITÁRIOS DE ANÁLISE DE RISCO PSICOSSOCIAL =====

import { ChecklistResult } from '@/types';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAnalysis {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export const calculateRiskLevel = (score: number, maxScore: number): RiskLevel => {
  const percentage = (score / maxScore) * 100;
  
  if (percentage <= 25) return 'low';
  if (percentage <= 50) return 'medium';  
  if (percentage <= 75) return 'high';
  return 'critical';
};

export const analyzeDiscProfile = (results: { D: number; I: number; S: number; C: number }): {
  dominantFactor: string;
  profile: string;
  recommendations: string[];
} => {
  const factors = Object.entries(results);
  const dominant = factors.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );
  
  const profiles = {
    D: {
      name: 'Dominante',
      description: 'Focado em resultados e controle',
      recommendations: [
        'Desenvolver habilidades de delegação',
        'Praticar escuta ativa',
        'Trabalhar paciência em equipe'
      ]
    },
    I: {
      name: 'Influente',
      description: 'Sociável e comunicativo',
      recommendations: [
        'Focar mais em detalhes',
        'Desenvolver organização pessoal',
        'Praticar follow-up consistente'
      ]
    },
    S: {
      name: 'Estável',
      description: 'Confiável e cooperativo',
      recommendations: [
        'Desenvolver assertividade',
        'Praticar tomada de decisão rápida',
        'Expandir zona de conforto'
      ]
    },
    C: {
      name: 'Consciencioso',
      description: 'Analítico e detalhista',
      recommendations: [
        'Praticar tomada de decisão sob pressão',
        'Desenvolver flexibilidade',
        'Melhorar comunicação interpessoal'
      ]
    }
  };
  
  const profile = profiles[dominant[0] as keyof typeof profiles];
  
  return {
    dominantFactor: dominant[0],
    profile: profile.name,
    recommendations: profile.recommendations
  };
};

export const generateRiskReport = (result: ChecklistResult): RiskAnalysis => {
  const score = result.total_score || 0;
  const level = result.risk_level || 'low';
  
  const riskFactors = {
    low: ['Ambiente de trabalho adequado', 'Baixo estresse ocupacional'],
    medium: ['Pressão moderada', 'Necessita monitoramento'],
    high: ['Alto estresse', 'Risco de burnout', 'Necessita intervenção'],
    critical: ['Risco extremo', 'Intervenção imediata necessária', 'Afastamento recomendado']
  };
  
  const recommendations = {
    low: ['Manter práticas atuais', 'Monitoramento periódico'],
    medium: [
      'Implementar práticas de bem-estar',
      'Revisar carga de trabalho',
      'Oferecer suporte adicional'
    ],
    high: [
      'Intervenção psicológica',
      'Redução de carga de trabalho',
      'Programa de gestão de estresse',
      'Acompanhamento semanal'
    ],
    critical: [
      'Intervenção imediata',
      'Avaliação médica',
      'Possível afastamento',
      'Suporte psicológico intensivo'
    ]
  };
  
  const urgencyMap = {
    low: 'low' as const,
    medium: 'medium' as const,
    high: 'high' as const,
    critical: 'immediate' as const
  };
  
  return {
    level,
    score,
    factors: riskFactors[level] || [],
    recommendations: recommendations[level] || [],
    urgency: urgencyMap[level]
  };
};
