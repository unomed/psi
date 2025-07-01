
export enum DiscFactorType {
  D = "D",
  I = "I",
  S = "S",
  C = "C",
}

export interface DiscFactor {
  type: DiscFactorType;
  name: string;
  description: string;
}

export interface DiscQuestion {
  id: string;
  text: string;
  targetFactor: DiscFactorType;
  weight: number;
}
