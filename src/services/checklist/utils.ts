
import { DiscFactorType } from "@/types/disc";

export function stringToDiscFactorType(str: string): DiscFactorType {
  const upperStr = str.toUpperCase();
  if (upperStr === 'D' || upperStr === 'I' || upperStr === 'S' || upperStr === 'C') {
    return upperStr as DiscFactorType;
  }
  return 'D'; // Default fallback
}

export function calculateDominantFactor(scores: Record<string, number>): DiscFactorType {
  const factors: DiscFactorType[] = ['D', 'I', 'S', 'C'];
  let maxScore = -1;
  let dominant: DiscFactorType = 'D';
  
  factors.forEach(factor => {
    if (scores[factor] > maxScore) {
      maxScore = scores[factor];
      dominant = factor;
    }
  });
  
  return dominant;
}
