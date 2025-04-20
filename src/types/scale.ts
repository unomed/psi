
// Application-specific scale types 
export enum ScaleType {
  Likert = "likert",
  YesNo = "yesno",
  Agree3 = "agree3",
  Custom = "custom",
}

// Database scale types (from Supabase)
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case ScaleType.Likert: return "likert5";
    case ScaleType.YesNo: return "binary";
    case ScaleType.Agree3: return "custom";
    case ScaleType.Custom: return "custom";
    default: return "likert5";
  }
};
