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
          email: string | null
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      associate_user_with_company: {
        Args: { _user_id: string; _company_id: string }
        Returns: boolean
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
      dissociate_user_from_company: {
        Args: { _user_id: string; _company_id: string }
        Returns: boolean
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
