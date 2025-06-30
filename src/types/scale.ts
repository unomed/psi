
export type ScaleType = 
  | "binary" 
  | "likert3" 
  | "likert5" 
  | "likert7" 
  | "numeric" 
  | "disc";

export interface ScaleOption {
  value: number;
  label: string;
  description?: string;
}

export const SCALE_OPTIONS: Record<ScaleType, ScaleOption[]> = {
  binary: [
    { value: 0, label: "Não" },
    { value: 1, label: "Sim" }
  ],
  likert3: [
    { value: 1, label: "Discordo" },
    { value: 2, label: "Neutro" },
    { value: 3, label: "Concordo" }
  ],
  likert5: [
    { value: 1, label: "Discordo Totalmente" },
    { value: 2, label: "Discordo" },
    { value: 3, label: "Neutro" },
    { value: 4, label: "Concordo" },
    { value: 5, label: "Concordo Totalmente" }
  ],
  likert7: [
    { value: 1, label: "Discordo Totalmente" },
    { value: 2, label: "Discordo Muito" },
    { value: 3, label: "Discordo" },
    { value: 4, label: "Neutro" },
    { value: 5, label: "Concordo" },
    { value: 6, label: "Concordo Muito" },
    { value: 7, label: "Concordo Totalmente" }
  ],
  numeric: [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" }
  ],
  disc: [
    { value: 1, label: "Mais", description: "Mais parecido comigo" },
    { value: 0, label: "Menos", description: "Menos parecido comigo" }
  ]
};

export function getScaleOptions(scaleType: ScaleType): ScaleOption[] {
  return SCALE_OPTIONS[scaleType] || SCALE_OPTIONS["likert5"];
}
