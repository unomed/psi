
export type PlanType = "pay_per_assessment" | "credits" | "hybrid" | "volume";
export type BillingStatus = "pending" | "charged" | "credited" | "failed";
export type InvoiceStatus = "pending" | "sent" | "paid" | "overdue" | "cancelled";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type SubscriptionStatus = "active" | "suspended" | "cancelled" | "trial";
export type BillingCycle = "monthly" | "quarterly" | "annual";

export interface BillingPlan {
  id: string;
  name: string;
  type: PlanType;
  assessment_price: number;
  is_active: boolean;
  bulk_discounts: BulkDiscount[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BulkDiscount {
  quantity: number;
  unit_price: number;
  discount_percent: number;
}

export interface CompanyBilling {
  id: string;
  company_id: string;
  billing_plan_id: string;
  assessment_credit_balance: number;
  auto_recharge_enabled: boolean;
  auto_recharge_threshold: number;
  auto_recharge_amount: number;
  payment_method?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  billing_plans?: BillingPlan;
  companies?: {
    name: string;
    cnpj: string;
  };
}

export interface AssessmentBillingRecord {
  id: string;
  assessment_response_id: string;
  company_id: string;
  amount_charged: number;
  billing_status: BillingStatus;
  invoice_id?: string;
  charged_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  company_id: string;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  total_amount: number;
  assessment_count: number;
  unit_price: number;
  discounts_applied: number;
  status: InvoiceStatus;
  due_date: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  companies?: {
    name: string;
    cnpj: string;
  };
}

export interface PaymentTransaction {
  id: string;
  company_id: string;
  invoice_id?: string;
  amount: number;
  payment_method: string;
  stripe_payment_id?: string;
  status: PaymentStatus;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditPurchase {
  id: string;
  company_id: string;
  credits_purchased: number;
  amount_paid: number;
  unit_price: number;
  payment_transaction_id?: string;
  stripe_session_id?: string;
  status: PaymentStatus;
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
  billing_plans?: {
    id: string;
    name: string;
    type: string;
    price_per_company: number;
    price_per_employee: number;
    max_companies: number;
    max_employees: number;
    features: string[];
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  companies?: {
    name: string;
    cnpj: string;
  };
}
