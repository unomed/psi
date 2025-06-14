
export type PlanType = "basic" | "professional" | "enterprise" | "custom";
export type BillingCycle = "monthly" | "quarterly" | "annual";
export type SubscriptionStatus = "active" | "suspended" | "cancelled" | "trial";
export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";

export interface BillingPlan {
  id: string;
  name: string;
  type: PlanType;
  price_per_company: number;
  price_per_employee: number;
  max_companies: number | null; // null = unlimited
  max_employees: number | null; // null = unlimited
  features: string[];
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  company_id: string;
  plan_id: string;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  next_billing_date: string;
  trial_end_date: string | null;
  monthly_amount: number;
  created_at: string;
  updated_at: string;
  // Relations
  billing_plans?: BillingPlan;
  companies?: {
    name: string;
    cnpj: string;
  };
}

export interface Invoice {
  id: string;
  company_id: string;
  subscription_id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: InvoiceStatus;
  billing_period_start: string;
  billing_period_end: string;
  companies_count: number;
  employees_count: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  companies?: {
    name: string;
    cnpj: string;
  };
  subscriptions?: Subscription;
}

export interface BillingUsage {
  id: string;
  company_id: string;
  month_year: string; // Format: YYYY-MM
  companies_count: number;
  employees_count: number;
  calculated_amount: number;
  created_at: string;
  updated_at: string;
  // Relations
  companies?: {
    name: string;
    cnpj: string;
  };
}

export interface PaymentMethod {
  id: string;
  company_id: string;
  type: "credit_card" | "bank_transfer" | "pix";
  card_last_four?: string;
  card_brand?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
