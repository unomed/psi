
import { DiscFactorType } from "@/types/disc";

export function stringToDiscFactorType(str: string): DiscFactorType {
  const upperStr = str.toUpperCase();
  if (upperStr === 'D' || upperStr === 'I' || upperStr === 'S' || upperStr === 'C') {
    return upperStr as DiscFactorType;
  }
  return 'D' as DiscFactorType; // Default fallback
}

export function calculateDominantFactor(scores: Record<string, number>): DiscFactorType {
  const factors: DiscFactorType[] = ['D' as DiscFactorType, 'I' as DiscFactorType, 'S' as DiscFactorType, 'C' as DiscFactorType];
  let maxScore = -1;
  let dominant: DiscFactorType = 'D' as DiscFactorType;
  
  factors.forEach(factor => {
    if (scores[factor] > maxScore) {
      maxScore = scores[factor];
      dominant = factor;
    }
  });
  
  return dominant;
}
