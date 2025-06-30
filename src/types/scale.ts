
import { ScaleType } from './index';

// Database scale types (from Supabase)
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom" | "numeric";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case "likert":
      return "likert5";
    case "yesno":
      return "binary";
    case "agree3":
      return "custom";
    case "custom":
      return "custom";
    case "frequency":
      return "frequency";
    case "importance":
      return "custom";
    case "probability":
      return "custom";
    case "impact":
      return "custom";
    case "riskLevel":
      return "custom";
    case "psicossocial":
      return "custom";
    case "numeric":
      return "numeric";
    default:
      return "likert5";
  }
};

// Mapping from DB scale types to app scale types
export const dbScaleTypeToScaleType = (dbScaleType: DbScaleType | string): ScaleType => {
  switch (dbScaleType) {
    case "likert5":
    case "likert7":
      return "likert";
    case "binary":
      return "yesno";
    case "frequency":
      return "frequency";
    case "numeric":
      return "numeric";
    case "stanine":
    case "percentile":
    case "tscore":
    case "range10":
      return "custom";
    case "custom":
      return "custom";
    default:
      return "likert";
  }
};
