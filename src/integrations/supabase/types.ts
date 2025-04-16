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
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
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
      scheduled_assessments: {
        Row: {
          completed_at: string | null
          created_at: string
          employee_id: string
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
          completed_at?: string | null
          created_at?: string
          employee_id: string
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
          completed_at?: string | null
          created_at?: string
          employee_id?: string
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
            foreignKeyName: "scheduled_assessments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
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
      [_ in never]: never
    }
    Functions: {
      copy_template_for_company: {
        Args: { template_id: string; company_id: string; new_title?: string }
        Returns: string
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
      app_role: "superadmin" | "admin" | "evaluator"
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
      app_role: ["superadmin", "admin", "evaluator"],
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
