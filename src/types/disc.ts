
export type DiscFactorType = "D" | "I" | "S" | "C";

export enum DiscFactorTypeEnum {
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
