export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor: string
          client_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip: string | null
          new_data: Json | null
          old_data: Json | null
        }
        Insert: {
          action: string
          actor: string
          client_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip?: string | null
          new_data?: Json | null
          old_data?: Json | null
        }
        Update: {
          action?: string
          actor?: string
          client_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip?: string | null
          new_data?: Json | null
          old_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_product_instances: {
        Row: {
          client_id: string
          created_at: string
          domain: string | null
          external_property_id: string | null
          external_tenant_id: string | null
          id: string
          last_synced_at: string | null
          onboarding_status: string
          product_code: string
          status: string
          supabase_project_ref: string | null
          supabase_user_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          domain?: string | null
          external_property_id?: string | null
          external_tenant_id?: string | null
          id?: string
          last_synced_at?: string | null
          onboarding_status?: string
          product_code: string
          status?: string
          supabase_project_ref?: string | null
          supabase_user_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          domain?: string | null
          external_property_id?: string | null
          external_tenant_id?: string | null
          id?: string
          last_synced_at?: string | null
          onboarding_status?: string
          product_code?: string
          status?: string
          supabase_project_ref?: string | null
          supabase_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_product_instances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_stripe_accounts: {
        Row: {
          charges_enabled: boolean
          client_id: string
          created_at: string
          id: string
          mode: string
          onboarding_completed: boolean
          payouts_enabled: boolean
          product_code: string
          status_checked_at: string | null
          stripe_account_id: string
          stripe_connect_type: string
          updated_at: string
        }
        Insert: {
          charges_enabled?: boolean
          client_id: string
          created_at?: string
          id?: string
          mode?: string
          onboarding_completed?: boolean
          payouts_enabled?: boolean
          product_code?: string
          status_checked_at?: string | null
          stripe_account_id: string
          stripe_connect_type?: string
          updated_at?: string
        }
        Update: {
          charges_enabled?: boolean
          client_id?: string
          created_at?: string
          id?: string
          mode?: string
          onboarding_completed?: boolean
          payouts_enabled?: boolean
          product_code?: string
          status_checked_at?: string | null
          stripe_account_id?: string
          stripe_connect_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_stripe_accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_usage_stats: {
        Row: {
          client_id: string
          count: number
          id: string
          metric: string
          period_month: number
          period_year: number
          product_code: string
          updated_at: string
        }
        Insert: {
          client_id: string
          count?: number
          id?: string
          metric: string
          period_month: number
          period_year: number
          product_code: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          count?: number
          id?: string
          metric?: string
          period_month?: number
          period_year?: number
          product_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_usage_stats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      provisioning_jobs: {
        Row: {
          action: string
          attempts: number
          client_id: string
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number
          payload: Json
          status: string
          steps: Json
          target_product: string
          updated_at: string
        }
        Insert: {
          action: string
          attempts?: number
          client_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          payload?: Json
          status?: string
          steps?: Json
          target_product: string
          updated_at?: string
        }
        Update: {
          action?: string
          attempts?: number
          client_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          payload?: Json
          status?: string
          steps?: Json
          target_product?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisioning_jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      saas_clients: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          legal_name: string
          notes: string | null
          status: string
          tax_id: string | null
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          legal_name: string
          notes?: string | null
          status?: string
          tax_id?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          legal_name?: string
          notes?: string | null
          status?: string
          tax_id?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saas_invoices: {
        Row: {
          amount_cents: number
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
        }
        Insert: {
          amount_cents: number
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount_cents?: number
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saas_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saas_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "saas_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      saas_plans: {
        Row: {
          advanced_reporting: boolean
          api_calls_per_day: number
          code: string
          created_at: string
          crm_enabled: boolean
          debacu_enabled: boolean
          dynamic_pricing_enabled: boolean
          id: string
          is_active: boolean
          max_domains: number
          max_properties: number
          max_units: number
          max_users: number
          monthly_price_cents: number
          multi_property_enabled: boolean
          name: string
          setup_fee_cents: number
          yearly_price_cents: number
        }
        Insert: {
          advanced_reporting?: boolean
          api_calls_per_day?: number
          code: string
          created_at?: string
          crm_enabled?: boolean
          debacu_enabled?: boolean
          dynamic_pricing_enabled?: boolean
          id?: string
          is_active?: boolean
          max_domains?: number
          max_properties?: number
          max_units?: number
          max_users?: number
          monthly_price_cents: number
          multi_property_enabled?: boolean
          name: string
          setup_fee_cents?: number
          yearly_price_cents: number
        }
        Update: {
          advanced_reporting?: boolean
          api_calls_per_day?: number
          code?: string
          created_at?: string
          crm_enabled?: boolean
          debacu_enabled?: boolean
          dynamic_pricing_enabled?: boolean
          id?: string
          is_active?: boolean
          max_domains?: number
          max_properties?: number
          max_units?: number
          max_users?: number
          monthly_price_cents?: number
          multi_property_enabled?: boolean
          name?: string
          setup_fee_cents?: number
          yearly_price_cents?: number
        }
        Relationships: []
      }
      saas_subscriptions: {
        Row: {
          billing_cycle: string
          cancel_at: string | null
          cancelled_at: string | null
          client_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          saas_stripe_customer_id: string | null
          saas_stripe_subscription_id: string | null
          status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          billing_cycle: string
          cancel_at?: string | null
          cancelled_at?: string | null
          client_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          saas_stripe_customer_id?: string | null
          saas_stripe_subscription_id?: string | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          cancel_at?: string | null
          cancelled_at?: string | null
          client_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          saas_stripe_customer_id?: string | null
          saas_stripe_subscription_id?: string | null
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saas_subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saas_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "saas_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_ticket_events: {
        Row: {
          actor: string
          content: string | null
          created_at: string
          id: string
          ticket_id: string
          type: string
        }
        Insert: {
          actor: string
          content?: string | null
          created_at?: string
          id?: string
          ticket_id: string
          type: string
        }
        Update: {
          actor?: string
          content?: string | null
          created_at?: string
          id?: string
          ticket_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_events_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assignee_id: string | null
          client_id: string | null
          created_at: string
          id: string
          priority: string
          status: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject: string
          type: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "saas_clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
