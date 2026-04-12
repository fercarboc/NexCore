import type { Tables } from '@/src/lib/database.types'

// Tipos base derivados directamente del schema de BD
export type SaaSClient = Tables<'saas_clients'>
export type SaaSPlan = Tables<'saas_plans'>
export type SaaSSubscription = Tables<'saas_subscriptions'>
export type ClientProductInstance = Tables<'client_product_instances'>
export type ClientStripeAccount = Tables<'client_stripe_accounts'>

// Enums alineados con los CHECK constraints de la BD
export type ClientStatus = 'LEAD' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED'
export type BillingCycle = 'MONTHLY' | 'YEARLY'
export type PlanCode = 'BASIC' | 'PRO' | 'PREMIUM' | 'ENTERPRISE'
export type ProductCode = 'CASARURAL_V2' | 'DEBACU_API'
export type InstanceStatus = 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'ERROR'
export type OnboardingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

// Tipo extendido para vistas que necesitan datos del plan y suscripción
export interface SaaSClientWithDetails extends SaaSClient {
  subscription?: SaaSSubscription & {
    plan?: SaaSPlan
  }
  product_instances?: ClientProductInstance[]
  stripe_accounts?: ClientStripeAccount[]
}

// Tipo para el log de actividad (derivado de audit_logs filtrado por client_id)
export interface ClientActivity {
  id: string
  type: string
  description: string
  timestamp: string
}

// Nota interna sobre un cliente (campo notes de saas_clients o future tabla)
export interface ClientNote {
  id: string
  author: string
  content: string
  timestamp: string
}

// Contacto adicional del cliente (pendiente de tabla en futuras fases)
export interface ClientContact {
  id: string
  name: string
  role: string
  email: string
  phone: string
  primary: boolean
}
