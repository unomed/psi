
import { ScaleType } from './index';

// Database scale types (from Supabase)
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case ScaleType.Likert:
      return "likert5";
    case ScaleType.YesNo:
      return "binary";
    case ScaleType.Agree3:
      return "custom";
    case ScaleType.Custom:
      return "custom";
    case ScaleType.Frequency:
      return "frequency";
    case ScaleType.Importance:
      return "custom";
    case ScaleType.Probability:
      return "custom";
    case ScaleType.Impact:
      return "custom";
    case ScaleType.RiskLevel:
      return "custom";
    case ScaleType.Psicossocial:
      return "custom";
    default:
      return "likert5";
  }
};

// Mapping from DB scale types to app scale types
export const dbScaleTypeToScaleType = (dbScaleType: DbScaleType | string): ScaleType => {
  switch (dbScaleType) {
    case "likert5":
    case "likert7":
      return ScaleType.Likert;
    case "binary":
      return ScaleType.YesNo;
    case "frequency":
      return ScaleType.Frequency;
    case "custom":
      return ScaleType.Custom;
    case "stanine":
    case "percentile":
    case "tscore":
    case "range10":
      return ScaleType.Custom;
    default:
      return ScaleType.Likert;
  }
};
