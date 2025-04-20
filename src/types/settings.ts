
export type PeriodicityType = "monthly" | "quarterly" | "semiannual" | "annual";

export interface PeriodicitySettings {
  id?: string;
  default_periodicity: PeriodicityType;
  risk_high_periodicity: PeriodicityType;
  risk_medium_periodicity: PeriodicityType;
  risk_low_periodicity: PeriodicityType;
}
