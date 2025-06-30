
import { ScaleType } from './index';

// Database scale types (from Supabase) - EXPANDIDO
export type DbScaleType = "likert5" | "likert7" | "binary" | "range10" | "frequency" | "stanine" | "percentile" | "tscore" | "custom" | "numeric" | "likert_5" | "percentage" | "psicossocial";

// Mapping between app scale types and DB scale types
export const scaleTypeToDbScaleType = (scaleType: ScaleType): DbScaleType => {
  switch (scaleType) {
    case "likert":
      return "likert5";
    case "likert_5":
      return "likert_5";
    case "yes_no":
      return "binary";
    case "custom":
      return "custom";
    case "frequency":
      return "frequency";
    case "numeric":
      return "numeric";
    case "binary":
      return "binary";
    case "percentage":
      return "percentage";
    case "psicossocial":
      return "psicossocial";
    case "likert5":
      return "likert5";
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
    case "likert_5":
      return "likert_5";
    case "binary":
      return "binary";
    case "frequency":
      return "frequency";
    case "numeric":
      return "numeric";
    case "percentage":
      return "percentage";
    case "psicossocial":
      return "psicossocial";
    case "stanine":
    case "percentile":
    case "tscore":
    case "range10":
    case "custom":
      return "custom";
    default:
      return "likert";
  }
};
