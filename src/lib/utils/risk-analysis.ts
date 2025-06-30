export type RiskLevel = "low" | "medium" | "high" | "critical";

export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function categorizeResponses(responses: Record<string, any>): Record<string, number> {
  const categories: Record<string, number> = {};

  for (const questionId in responses) {
    const response = responses[questionId];
    if (typeof response === 'string') {
      const [category, score] = response.split(':');
      if (category && score) {
        categories[category] = (categories[category] || 0) + parseInt(score, 10);
      }
    }
  }

  return categories;
}

export function summarizeRiskFactors(categorizedResponses: Record<string, number>): string[] {
  const riskFactors: string[] = [];

  for (const category in categorizedResponses) {
    const score = categorizedResponses[category];
    if (score > 5) {
      riskFactors.push(category);
    }
  }

  return riskFactors;
}

export function generateRecommendations(riskFactors: string[]): string[] {
  const recommendations: string[] = [];

  if (riskFactors.includes('stress')) {
    recommendations.push("Implement stress management programs.");
  }
  if (riskFactors.includes('workload')) {
    recommendations.push("Redistribute workload to avoid overload.");
  }
  if (riskFactors.includes('relationships')) {
    recommendations.push("Improve communication and conflict resolution skills.");
  }

  return recommendations;
}

export function analyzeRiskFactors(responses: Record<string, any>): {
  riskLevel: RiskLevel;
  factors: string[];
  recommendations: string[];
} {
  const scores = Object.values(responses).map(Number).filter(n => !isNaN(n));
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  const riskLevel: RiskLevel = calculateRiskLevel(averageScore); // Corrigido: tipo explícito
  
  return {
    riskLevel,
    factors: [],
    recommendations: []
  };
}
