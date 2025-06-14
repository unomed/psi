export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_plan_items: {
        Row: {
          action_plan_id: string
          actual_hours: number | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          department: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: string
          progress_percentage: number
          responsible_email: string | null
          responsible_name: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          action_plan_id: string
          actual_hours?: number | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          responsible_email?: string | null
          responsible_name?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_plan_id?: string
          actual_hours?: number | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          responsible_email?: string | null
          responsible_name?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plan_items_action_plan_id_fkey"
            columns: ["action_plan_id"]
            isOneToOne: false
            referencedRelation: "action_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      action_plans: {
        Row: {
          assessment_response_id: string | null
          budget_allocated: number | null
          budget_used: number | null
          company_id: string | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          progress_percentage: number
          responsible_user_id: string | null
          risk_level: string | null
          sector_id: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assessment_response_id?: string | null
          budget_allocated?: number | null
          budget_used?: number | null
          company_id?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress_percentage?: number
          responsible_user_id?: string | null
          risk_level?: string | null
          sector_id?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assessment_response_id?: string | null
          budget_allocated?: number | null
          budget_used?: number | null
          company_id?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress_percentage?: number
          responsible_user_id?: string | null
          risk_level?: string | null
          sector_id?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_assessment_response_id_fkey"
            columns: ["assessment_response_id"]
            isOneToOne: false
            referencedRelation: "assessment_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_billing_records: {
        Row: {
          amount_charged: number
          assessment_response_id: string
          billing_status: string
          charged_at: string | null
          company_id: string
          created_at: string
          id: string
          invoice_id: string | null
          updated_at: string
        }
        Insert: {
          amount_charged: number
          assessment_response_id: string
          billing_status?: string
          charged_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_charged?: number
          assessment_response_id?: string
          billing_status?: string
          charged_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_billing_records_assessment_response_id_fkey"
            columns: ["assessment_response_id"]
            isOneToOne: false
            referencedRelation: "assessment_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_billing_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_criteria_settings: {
        Row: {
          company_risk_calculation_type: string | null
          created_at: string
          days_before_reminder_sent: number | null
          default_recurrence_type: string
          enable_recurrence_reminders: boolean | null
          id: string
          low_risk_threshold: number | null
          medium_risk_threshold: number | null
          minimum_employee_percentage: number | null
          notify_managers_on_high_risk: boolean | null
          prioritize_high_risk_roles: boolean | null
          reassessment_max_days: number | null
          require_all_roles: boolean | null
          require_all_sectors: boolean | null
          require_reassessment_for_high_risk: boolean | null
          sector_risk_calculation_type: string | null
          updated_at: string
        }
        Insert: {
          company_risk_calculation_type?: string | null
          created_at?: string
          days_before_reminder_sent?: number | null
          default_recurrence_type: string
          enable_recurrence_reminders?: boolean | null
          id?: string
          low_risk_threshold?: number | null
          medium_risk_threshold?: number | null
          minimum_employee_percentage?: number | null
          notify_managers_on_high_risk?: boolean | null
          prioritize_high_risk_roles?: boolean | null
          reassessment_max_days?: number | null
          require_all_roles?: boolean | null
          require_all_sectors?: boolean | null
          require_reassessment_for_high_risk?: boolean | null
          sector_risk_calculation_type?: string | null
          updated_at?: string
        }
        Update: {
          company_risk_calculation_type?: string | null
          created_at?: string
          days_before_reminder_sent?: number | null
          default_recurrence_type?: string
          enable_recurrence_reminders?: boolean | null
          id?: string
          low_risk_threshold?: number | null
          medium_risk_threshold?: number | null
          minimum_employee_percentage?: number | null
          notify_managers_on_high_risk?: boolean | null
          prioritize_high_risk_roles?: boolean | null
          reassessment_max_days?: number | null
          require_all_roles?: boolean | null
          require_all_sectors?: boolean | null
          require_reassessment_for_high_risk?: boolean | null
          sector_risk_calculation_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      assessment_emails: {
        Row: {
          body: string
          created_at: string
          delivery_status: string | null
          id: string
          recipient_email: string
          scheduled_assessment_id: string
          sent_at: string | null
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          recipient_email: string
          scheduled_assessment_id: string
          sent_at?: string | null
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          recipient_email?: string
          scheduled_assessment_id?: string
          sent_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_emails_scheduled_assessment_id_fkey"
            columns: ["scheduled_assessment_id"]
            isOneToOne: false
            referencedRelation: "scheduled_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_links: {
        Row: {
          created_at: string
          created_by: string | null
          employee_id: string
          expires_at: string | null
          id: string
          template_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_id: string
          expires_at?: string | null
          id?: string
          template_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_id?: string
          expires_at?: string | null
          id?: string
          template_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_links_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_links_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_responses: {
        Row: {
          classification:
            | Database["public"]["Enums"]["result_classification"]
            | null
          completed_at: string
          created_by: string | null
          dominant_factor: string | null
          employee_id: string | null
          employee_name: string | null
          factors_scores: Json | null
          id: string
          normalized_score: number | null
          notes: string | null
          percentile: number | null
          raw_score: number | null
          response_data: Json
          stanine: number | null
          template_id: string
          tscore: number | null
        }
        Insert: {
          classification?:
            | Database["public"]["Enums"]["result_classification"]
            | null
          completed_at?: string
          created_by?: string | null
          dominant_factor?: string | null
          employee_id?: string | null
          employee_name?: string | null
          factors_scores?: Json | null
          id?: string
          normalized_score?: number | null
          notes?: string | null
          percentile?: number | null
          raw_score?: number | null
          response_data: Json
          stanine?: number | null
          template_id: string
          tscore?: number | null
        }
        Update: {
          classification?:
            | Database["public"]["Enums"]["result_classification"]
            | null
          completed_at?: string
          created_by?: string | null
          dominant_factor?: string | null
          employee_id?: string | null
          employee_name?: string | null
          factors_scores?: Json | null
          id?: string
          normalized_score?: number | null
          notes?: string | null
          percentile?: number | null
          raw_score?: number | null
          response_data?: Json
          stanine?: number | null
          template_id?: string
          tscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plans: {
        Row: {
          assessment_price: number
          bulk_discounts: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          assessment_price?: number
          bulk_discounts?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          assessment_price?: number
          bulk_discounts?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      checklist_templates: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          cutoff_scores: Json | null
          derived_from_id: string | null
          description: string | null
          estimated_time_minutes: number | null
          id: string
          instructions: string | null
          interpretation_guide: string | null
          is_active: boolean
          is_standard: boolean | null
          max_score: number | null
          scale_type: Database["public"]["Enums"]["scale_type"]
          title: string
          type: Database["public"]["Enums"]["checklist_type"]
          updated_at: string
          version: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cutoff_scores?: Json | null
          derived_from_id?: string | null
          description?: string | null
          estimated_time_minutes?: number | null
          id?: string
          instructions?: string | null
          interpretation_guide?: string | null
          is_active?: boolean
          is_standard?: boolean | null
          max_score?: number | null
          scale_type: Database["public"]["Enums"]["scale_type"]
          title: string
          type: Database["public"]["Enums"]["checklist_type"]
          updated_at?: string
          version?: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cutoff_scores?: Json | null
          derived_from_id?: string | null
          description?: string | null
          estimated_time_minutes?: number | null
          id?: string
          instructions?: string | null
          interpretation_guide?: string | null
          is_active?: boolean
          is_standard?: boolean | null
          max_score?: number | null
          scale_type?: Database["public"]["Enums"]["scale_type"]
          title?: string
          type?: Database["public"]["Enums"]["checklist_type"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_derived_from_id_fkey"
            columns: ["derived_from_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_billing: {
        Row: {
          assessment_credit_balance: number
          auto_recharge_amount: number | null
          auto_recharge_enabled: boolean
          auto_recharge_threshold: number | null
          billing_plan_id: string
          company_id: string
          created_at: string
          id: string
          payment_method: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          assessment_credit_balance?: number
          auto_recharge_amount?: number | null
          auto_recharge_enabled?: boolean
          auto_recharge_threshold?: number | null
          billing_plan_id: string
          company_id: string
          created_at?: string
          id?: string
          payment_method?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          assessment_credit_balance?: number
          auto_recharge_amount?: number | null
          auto_recharge_enabled?: boolean
          auto_recharge_threshold?: number | null
          billing_plan_id?: string
          company_id?: string
          created_at?: string
          id?: string
          payment_method?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_billing_billing_plan_id_fkey"
            columns: ["billing_plan_id"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_billing_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_purchases: {
        Row: {
          amount_paid: number
          company_id: string
          created_at: string
          credits_purchased: number
          id: string
          payment_transaction_id: string | null
          status: string
          stripe_session_id: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          amount_paid: number
          company_id: string
          created_at?: string
          credits_purchased: number
          id?: string
          payment_transaction_id?: string | null
          status?: string
          stripe_session_id?: string | null
          unit_price: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          company_id?: string
          created_at?: string
          credits_purchased?: number
          id?: string
          payment_transaction_id?: string | null
          status?: string
          stripe_session_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_purchases_payment_transaction_id_fkey"
            columns: ["payment_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_server_settings: {
        Row: {
          created_at: string
          id: string
          imap_port: number | null
          imap_server: string | null
          password: string
          pop3_port: number | null
          sender_email: string
          sender_name: string
          smtp_port: number
          smtp_server: string
          updated_at: string
          use_ssl: boolean | null
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          imap_port?: number | null
          imap_server?: string | null
          password: string
          pop3_port?: number | null
          sender_email: string
          sender_name: string
          smtp_port: number
          smtp_server: string
          updated_at?: string
          use_ssl?: boolean | null
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          imap_port?: number | null
          imap_server?: string | null
          password?: string
          pop3_port?: number | null
          sender_email?: string
          sender_name?: string
          smtp_port?: number
          smtp_server?: string
          updated_at?: string
          use_ssl?: boolean | null
          username?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          birth_date: string | null
          company_id: string
          cpf: string
          created_at: string
          email: string | null
          gender: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          role_id: string
          sector_id: string
          special_conditions: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          company_id: string
          cpf: string
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          role_id: string
          sector_id: string
          special_conditions?: string | null
          start_date: string
          status: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          company_id?: string
          cpf?: string
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          role_id?: string
          sector_id?: string
          special_conditions?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          assessment_count: number
          billing_period_end: string
          billing_period_start: string
          company_id: string
          created_at: string
          discounts_applied: number | null
          due_date: string
          id: string
          invoice_number: string
          paid_at: string | null
          status: string
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          assessment_count?: number
          billing_period_end: string
          billing_period_start: string
          company_id: string
          created_at?: string
          discounts_applied?: number | null
          due_date: string
          id?: string
          invoice_number: string
          paid_at?: string | null
          status?: string
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          assessment_count?: number
          billing_period_end?: string
          billing_period_start?: string
          company_id?: string
          created_at?: string
          discounts_applied?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          paid_at?: string | null
          status?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          company_id: string | null
          created_at: string
          deadline_alerts: boolean | null
          deadline_warning_days: number | null
          email_notifications: boolean | null
          high_risk_threshold: number | null
          id: string
          last_notification_sent: string | null
          notification_frequency: unknown | null
          risk_alerts: boolean | null
          system_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          deadline_alerts?: boolean | null
          deadline_warning_days?: number | null
          email_notifications?: boolean | null
          high_risk_threshold?: number | null
          id?: string
          last_notification_sent?: string | null
          notification_frequency?: unknown | null
          risk_alerts?: boolean | null
          system_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          deadline_alerts?: boolean | null
          deadline_warning_days?: number | null
          email_notifications?: boolean | null
          high_risk_threshold?: number | null
          id?: string
          last_notification_sent?: string | null
          notification_frequency?: unknown | null
          risk_alerts?: boolean | null
          system_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      nr01_action_templates: {
        Row: {
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          created_at: string | null
          description: string | null
          exposure_level: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id: string
          is_mandatory: boolean | null
          legal_requirements: string | null
          mandatory_actions: Json
          recommended_timeline_days: number | null
          responsible_roles: Json | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          created_at?: string | null
          description?: string | null
          exposure_level: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id?: string
          is_mandatory?: boolean | null
          legal_requirements?: string | null
          mandatory_actions?: Json
          recommended_timeline_days?: number | null
          responsible_roles?: Json | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["psychosocial_risk_category"]
          created_at?: string | null
          description?: string | null
          exposure_level?: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id?: string
          is_mandatory?: boolean | null
          legal_requirements?: string | null
          mandatory_actions?: Json
          recommended_timeline_days?: number | null
          responsible_roles?: Json | null
          template_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nr01_compliance: {
        Row: {
          action_plans_completed: number | null
          action_plans_generated: number | null
          auditor_notes: string | null
          company_id: string
          compliance_percentage: number | null
          created_at: string | null
          employees_evaluated: number | null
          evaluation_period_end: string
          evaluation_period_start: string
          high_risk_findings: number | null
          id: string
          last_audit_date: string | null
          next_audit_date: string | null
          sectors_evaluated: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action_plans_completed?: number | null
          action_plans_generated?: number | null
          auditor_notes?: string | null
          company_id: string
          compliance_percentage?: number | null
          created_at?: string | null
          employees_evaluated?: number | null
          evaluation_period_end: string
          evaluation_period_start: string
          high_risk_findings?: number | null
          id?: string
          last_audit_date?: string | null
          next_audit_date?: string | null
          sectors_evaluated?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action_plans_completed?: number | null
          action_plans_generated?: number | null
          auditor_notes?: string | null
          company_id?: string
          compliance_percentage?: number | null
          created_at?: string | null
          employees_evaluated?: number | null
          evaluation_period_end?: string
          evaluation_period_start?: string
          high_risk_findings?: number | null
          id?: string
          last_audit_date?: string | null
          next_audit_date?: string | null
          sectors_evaluated?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nr01_compliance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          id: string
          invoice_id: string | null
          payment_method: string
          processed_at: string | null
          status: string
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_method: string
          processed_at?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      periodicity_settings: {
        Row: {
          created_at: string
          default_periodicity: string
          id: string
          risk_high_periodicity: string
          risk_low_periodicity: string
          risk_medium_periodicity: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_periodicity: string
          id?: string
          risk_high_periodicity: string
          risk_low_periodicity: string
          risk_medium_periodicity: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_periodicity?: string
          id?: string
          risk_high_periodicity?: string
          risk_low_periodicity?: string
          risk_medium_periodicity?: string
          updated_at?: string
        }
        Relationships: []
      }
      permission_settings: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions: Json
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      psychosocial_automation_config: {
        Row: {
          auto_generate_action_plans: boolean
          auto_process_enabled: boolean
          company_id: string
          created_at: string
          critical_risk_escalation: boolean | null
          high_risk_immediate_notification: boolean | null
          id: string
          notification_enabled: boolean
          notification_recipients: Json | null
          processing_delay_minutes: number | null
          updated_at: string
        }
        Insert: {
          auto_generate_action_plans?: boolean
          auto_process_enabled?: boolean
          company_id: string
          created_at?: string
          critical_risk_escalation?: boolean | null
          high_risk_immediate_notification?: boolean | null
          id?: string
          notification_enabled?: boolean
          notification_recipients?: Json | null
          processing_delay_minutes?: number | null
          updated_at?: string
        }
        Update: {
          auto_generate_action_plans?: boolean
          auto_process_enabled?: boolean
          company_id?: string
          created_at?: string
          critical_risk_escalation?: boolean | null
          high_risk_immediate_notification?: boolean | null
          id?: string
          notification_enabled?: boolean
          notification_recipients?: Json | null
          processing_delay_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      psychosocial_criteria: {
        Row: {
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id: string | null
          created_at: string | null
          description: string | null
          factor_name: string
          id: string
          is_active: boolean | null
          mandatory_actions: Json | null
          threshold_high: number | null
          threshold_low: number | null
          threshold_medium: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          factor_name: string
          id?: string
          is_active?: boolean | null
          mandatory_actions?: Json | null
          threshold_high?: number | null
          threshold_low?: number | null
          threshold_medium?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          factor_name?: string
          id?: string
          is_active?: boolean | null
          mandatory_actions?: Json | null
          threshold_high?: number | null
          threshold_low?: number | null
          threshold_medium?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "psychosocial_criteria_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      psychosocial_notifications: {
        Row: {
          company_id: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          priority: string
          recipients: Json
          risk_analysis_id: string | null
          sent_at: string | null
          status: string
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string
          recipients?: Json
          risk_analysis_id?: string | null
          sent_at?: string | null
          status?: string
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string
          recipients?: Json
          risk_analysis_id?: string | null
          sent_at?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      psychosocial_processing_logs: {
        Row: {
          assessment_response_id: string
          company_id: string
          completed_at: string | null
          created_at: string
          details: Json | null
          error_message: string | null
          id: string
          processing_stage: string
          started_at: string
          status: string
        }
        Insert: {
          assessment_response_id: string
          company_id: string
          completed_at?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          id?: string
          processing_stage: string
          started_at?: string
          status?: string
        }
        Update: {
          assessment_response_id?: string
          company_id?: string
          completed_at?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          id?: string
          processing_stage?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      psychosocial_risk_analysis: {
        Row: {
          assessment_response_id: string | null
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id: string
          contributing_factors: Json | null
          created_at: string | null
          created_by: string | null
          evaluation_date: string
          exposure_level: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id: string
          mandatory_measures: Json | null
          next_evaluation_date: string | null
          recommended_actions: Json | null
          risk_score: number
          role_id: string | null
          sector_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_response_id?: string | null
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id: string
          contributing_factors?: Json | null
          created_at?: string | null
          created_by?: string | null
          evaluation_date?: string
          exposure_level: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id?: string
          mandatory_measures?: Json | null
          next_evaluation_date?: string | null
          recommended_actions?: Json | null
          risk_score: number
          role_id?: string | null
          sector_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_response_id?: string | null
          category?: Database["public"]["Enums"]["psychosocial_risk_category"]
          company_id?: string
          contributing_factors?: Json | null
          created_at?: string | null
          created_by?: string | null
          evaluation_date?: string
          exposure_level?: Database["public"]["Enums"]["psychosocial_exposure_level"]
          id?: string
          mandatory_measures?: Json | null
          next_evaluation_date?: string | null
          recommended_actions?: Json | null
          risk_score?: number
          role_id?: string | null
          sector_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychosocial_risk_analysis_assessment_response_id_fkey"
            columns: ["assessment_response_id"]
            isOneToOne: false
            referencedRelation: "assessment_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychosocial_risk_analysis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychosocial_risk_analysis_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychosocial_risk_analysis_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      psychosocial_risk_config: {
        Row: {
          auto_generate_plans: boolean
          company_id: string
          created_at: string
          id: string
          notification_enabled: boolean
          periodicidade_dias: number
          prazo_acao_alta_dias: number
          prazo_acao_critica_dias: number
          threshold_high: number
          threshold_low: number
          threshold_medium: number
          updated_at: string
        }
        Insert: {
          auto_generate_plans?: boolean
          company_id: string
          created_at?: string
          id?: string
          notification_enabled?: boolean
          periodicidade_dias?: number
          prazo_acao_alta_dias?: number
          prazo_acao_critica_dias?: number
          threshold_high?: number
          threshold_low?: number
          threshold_medium?: number
          updated_at?: string
        }
        Update: {
          auto_generate_plans?: boolean
          company_id?: string
          created_at?: string
          id?: string
          notification_enabled?: boolean
          periodicidade_dias?: number
          prazo_acao_alta_dias?: number
          prazo_acao_critica_dias?: number
          threshold_high?: number
          threshold_low?: number
          threshold_medium?: number
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          order_number: number
          question_text: string
          reverse_scored: boolean | null
          target_factor: string | null
          template_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_number: number
          question_text: string
          reverse_scored?: boolean | null
          target_factor?: string | null
          template_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: number
          question_text?: string
          reverse_scored?: boolean | null
          target_factor?: string | null
          template_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          assessment_response_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          employee_id: string | null
          id: string
          mitigation_actions: Json | null
          next_assessment_date: string | null
          probability_index: number
          recommended_action: string | null
          risk_factors: Json | null
          risk_level: string
          risk_value: number
          role_id: string | null
          sector_id: string | null
          severity_index: number
          status: string
          updated_at: string
        }
        Insert: {
          assessment_response_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          employee_id?: string | null
          id?: string
          mitigation_actions?: Json | null
          next_assessment_date?: string | null
          probability_index: number
          recommended_action?: string | null
          risk_factors?: Json | null
          risk_level: string
          risk_value: number
          role_id?: string | null
          sector_id?: string | null
          severity_index: number
          status?: string
          updated_at?: string
        }
        Update: {
          assessment_response_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          employee_id?: string | null
          id?: string
          mitigation_actions?: Json | null
          next_assessment_date?: string | null
          probability_index?: number
          recommended_action?: string | null
          risk_factors?: Json | null
          risk_level?: string
          risk_value?: number
          role_id?: string | null
          sector_id?: string | null
          severity_index?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_assessment_response_id_fkey"
            columns: ["assessment_response_id"]
            isOneToOne: false
            referencedRelation: "assessment_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_matrix_configurations: {
        Row: {
          col_labels: Json
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean
          matrix_size: number
          risk_actions: Json
          risk_matrix: Json
          row_labels: Json
          updated_at: string
        }
        Insert: {
          col_labels?: Json
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          matrix_size?: number
          risk_actions?: Json
          risk_matrix?: Json
          row_labels?: Json
          updated_at?: string
        }
        Update: {
          col_labels?: Json
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          matrix_size?: number
          risk_actions?: Json
          risk_matrix?: Json
          row_labels?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_matrix_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          required_skills: string[] | null
          risk_level: string | null
          sector_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          required_skills?: string[] | null
          risk_level?: string | null
          sector_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          required_skills?: string[] | null
          risk_level?: string | null
          sector_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_assessments: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          employee_id: string
          employee_name: string | null
          id: string
          link_url: string | null
          next_scheduled_date: string | null
          phone_number: string | null
          recurrence_type: string | null
          scheduled_date: string
          sent_at: string | null
          status: string
          template_id: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_id: string
          employee_name?: string | null
          id?: string
          link_url?: string | null
          next_scheduled_date?: string | null
          phone_number?: string | null
          recurrence_type?: string | null
          scheduled_date: string
          sent_at?: string | null
          status: string
          template_id: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_id?: string
          employee_name?: string | null
          id?: string
          link_url?: string | null
          next_scheduled_date?: string | null
          phone_number?: string | null
          recurrence_type?: string | null
          scheduled_date?: string
          sent_at?: string | null
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_assessments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          responsible_name: string | null
          risk_level: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          responsible_name?: string | null
          risk_level?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          responsible_name?: string | null
          risk_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_companies: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          create_assessments: boolean | null
          create_checklists: boolean | null
          create_companies: boolean | null
          create_employees: boolean | null
          create_functions: boolean | null
          create_sectors: boolean | null
          created_at: string | null
          delete_assessments: boolean | null
          delete_checklists: boolean | null
          delete_companies: boolean | null
          delete_employees: boolean | null
          delete_functions: boolean | null
          delete_sectors: boolean | null
          edit_assessments: boolean | null
          edit_checklists: boolean | null
          edit_companies: boolean | null
          edit_employees: boolean | null
          edit_functions: boolean | null
          edit_sectors: boolean | null
          edit_settings: boolean | null
          export_reports: boolean | null
          id: string
          updated_at: string | null
          user_id: string
          view_assessments: boolean | null
          view_checklists: boolean | null
          view_companies: boolean | null
          view_dashboard: boolean | null
          view_employees: boolean | null
          view_functions: boolean | null
          view_reports: boolean | null
          view_sectors: boolean | null
          view_settings: boolean | null
        }
        Insert: {
          create_assessments?: boolean | null
          create_checklists?: boolean | null
          create_companies?: boolean | null
          create_employees?: boolean | null
          create_functions?: boolean | null
          create_sectors?: boolean | null
          created_at?: string | null
          delete_assessments?: boolean | null
          delete_checklists?: boolean | null
          delete_companies?: boolean | null
          delete_employees?: boolean | null
          delete_functions?: boolean | null
          delete_sectors?: boolean | null
          edit_assessments?: boolean | null
          edit_checklists?: boolean | null
          edit_companies?: boolean | null
          edit_employees?: boolean | null
          edit_functions?: boolean | null
          edit_sectors?: boolean | null
          edit_settings?: boolean | null
          export_reports?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
          view_assessments?: boolean | null
          view_checklists?: boolean | null
          view_companies?: boolean | null
          view_dashboard?: boolean | null
          view_employees?: boolean | null
          view_functions?: boolean | null
          view_reports?: boolean | null
          view_sectors?: boolean | null
          view_settings?: boolean | null
        }
        Update: {
          create_assessments?: boolean | null
          create_checklists?: boolean | null
          create_companies?: boolean | null
          create_employees?: boolean | null
          create_functions?: boolean | null
          create_sectors?: boolean | null
          created_at?: string | null
          delete_assessments?: boolean | null
          delete_checklists?: boolean | null
          delete_companies?: boolean | null
          delete_employees?: boolean | null
          delete_functions?: boolean | null
          delete_sectors?: boolean | null
          edit_assessments?: boolean | null
          edit_checklists?: boolean | null
          edit_companies?: boolean | null
          edit_employees?: boolean | null
          edit_functions?: boolean | null
          edit_sectors?: boolean | null
          edit_settings?: boolean | null
          export_reports?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
          view_assessments?: boolean | null
          view_checklists?: boolean | null
          view_companies?: boolean | null
          view_dashboard?: boolean | null
          view_employees?: boolean | null
          view_functions?: boolean | null
          view_reports?: boolean | null
          view_sectors?: boolean | null
          view_settings?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_with_emails: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      associate_user_with_company: {
        Args: { _user_id: string; _company_id: string }
        Returns: boolean
      }
      calculate_psychosocial_risk: {
        Args: { p_assessment_response_id: string; p_company_id: string }
        Returns: {
          category: Database["public"]["Enums"]["psychosocial_risk_category"]
          risk_score: number
          exposure_level: Database["public"]["Enums"]["psychosocial_exposure_level"]
          recommended_actions: Json
        }[]
      }
      calculate_risk_level: {
        Args: {
          p_company_id: string
          p_severity_index: number
          p_probability_index: number
        }
        Returns: {
          risk_value: number
          risk_level: string
          recommended_action: string
          risk_color: string
        }[]
      }
      check_company_access: {
        Args: { user_id: string; company_id: string }
        Returns: boolean
      }
      copy_template_for_company: {
        Args:
          | Record<PropertyKey, never>
          | { template_id: string; company_id: string; new_title?: string }
        Returns: string
      }
      create_action_plan: {
        Args: { plan_data: Json }
        Returns: string
      }
      create_action_plan_item: {
        Args: { item_data: Json }
        Returns: string
      }
      delete_action_plan: {
        Args: { plan_id: string }
        Returns: undefined
      }
      delete_action_plan_item: {
        Args: { item_id: string }
        Returns: undefined
      }
      dissociate_user_from_company: {
        Args: { _user_id: string; _company_id: string }
        Returns: boolean
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_nr01_action_plan: {
        Args: { p_risk_analysis_id: string }
        Returns: string
      }
      get_action_plan_items: {
        Args: { plan_id: string }
        Returns: {
          id: string
          action_plan_id: string
          title: string
          description: string
          status: string
          priority: string
          responsible_name: string
          responsible_email: string
          department: string
          estimated_hours: number
          actual_hours: number
          start_date: string
          due_date: string
          completion_date: string
          progress_percentage: number
          dependencies: string[]
          notes: string
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_action_plans: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          company_id: string
          assessment_response_id: string
          title: string
          description: string
          status: string
          priority: string
          responsible_user_id: string
          sector_id: string
          sector_name: string
          start_date: string
          due_date: string
          completion_date: string
          progress_percentage: number
          risk_level: string
          budget_allocated: number
          budget_used: number
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_psychosocial_processing_stats: {
        Args: {
          p_company_id: string
          p_start_date?: string
          p_end_date?: string
        }
        Returns: {
          total_processed: number
          successful_processed: number
          failed_processed: number
          avg_processing_time_seconds: number
          high_risk_found: number
          critical_risk_found: number
          action_plans_generated: number
          notifications_sent: number
        }[]
      }
      get_risk_assessments_by_company: {
        Args: { p_company_id?: string }
        Returns: {
          id: string
          company_id: string
          company_name: string
          employee_id: string
          employee_name: string
          sector_id: string
          sector_name: string
          role_id: string
          role_name: string
          assessment_response_id: string
          severity_index: number
          probability_index: number
          risk_value: number
          risk_level: string
          recommended_action: string
          risk_factors: Json
          mitigation_actions: Json
          status: string
          next_assessment_date: string
          created_at: string
          updated_at: string
        }[]
      }
      get_user_emails: {
        Args: { user_ids: string[] }
        Returns: {
          id: string
          email: string
        }[]
      }
      has_company_access: {
        Args: { _user_id: string; _company_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_psychosocial_assessment_auto: {
        Args: { p_assessment_response_id: string }
        Returns: Json
      }
      update_action_plan: {
        Args: { plan_id: string; plan_data: Json }
        Returns: string
      }
      update_action_plan_item: {
        Args: { item_id: string; item_data: Json }
        Returns: string
      }
    }
    Enums: {
      app_role: "superadmin" | "admin" | "evaluator" | "profissionais"
      checklist_type:
        | "srq20"
        | "phq9"
        | "gad7"
        | "mbi"
        | "audit"
        | "pss"
        | "copsoq"
        | "jcq"
        | "eri"
        | "disc"
        | "custom"
      psychosocial_exposure_level: "baixo" | "medio" | "alto" | "critico"
      psychosocial_risk_category:
        | "organizacao_trabalho"
        | "condicoes_ambientais"
        | "relacoes_socioprofissionais"
        | "reconhecimento_crescimento"
        | "elo_trabalho_vida_social"
      result_classification:
        | "normal"
        | "mild"
        | "moderate"
        | "severe"
        | "critical"
      scale_type:
        | "likert5"
        | "likert7"
        | "binary"
        | "range10"
        | "frequency"
        | "stanine"
        | "percentile"
        | "tscore"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "admin", "evaluator", "profissionais"],
      checklist_type: [
        "srq20",
        "phq9",
        "gad7",
        "mbi",
        "audit",
        "pss",
        "copsoq",
        "jcq",
        "eri",
        "disc",
        "custom",
      ],
      psychosocial_exposure_level: ["baixo", "medio", "alto", "critico"],
      psychosocial_risk_category: [
        "organizacao_trabalho",
        "condicoes_ambientais",
        "relacoes_socioprofissionais",
        "reconhecimento_crescimento",
        "elo_trabalho_vida_social",
      ],
      result_classification: [
        "normal",
        "mild",
        "moderate",
        "severe",
        "critical",
      ],
      scale_type: [
        "likert5",
        "likert7",
        "binary",
        "range10",
        "frequency",
        "stanine",
        "percentile",
        "tscore",
        "custom",
      ],
    },
  },
} as const
