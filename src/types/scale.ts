
// Application-specific scale types 
export type ScaleType = "likert5" | "yesno" | "agree3" | "custom";

// Database scale types (from Supabase)
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case "likert5": return "likert5";
    case "yesno": return "binary";
    case "agree3": return "custom";
    case "custom": return "custom";
    default: return "likert5";
  }
};
