import type { Tables } from '@/src/lib/database.types'

// Instancia de producto (casarural-v2, Debacu) — derivado de BD
export type ClientProductInstance = Tables<'client_product_instances'>
export type ClientStripeAccount = Tables<'client_stripe_accounts'>

// Enums alineados con BD
export type ProductCode = 'CASARURAL_V2' | 'DEBACU_API'
export type InstanceStatus = 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'ERROR'
export type ConnectMode = 'test' | 'live'

// Integración de infraestructura (Stripe, Resend, Supabase…)
// No tiene tabla propia — es configuración operativa del staff
export interface InfraIntegration {
  id: string
  name: string
  provider: string
  category: 'payment' | 'ai' | 'email' | 'backend' | 'connector' | 'webhook'
  status: 'active' | 'inactive' | 'error' | 'pending'
  environment: 'test' | 'production'
  health: number // 0-100
  lastSync: string
  description: string
  version: string
  owner: string
  uptime: string
  latency: string
  successRate: string
}

export interface IntegrationLog {
  id: string
  timestamp: string
  type: string
  integration: string
  result: 'success' | 'error' | 'warning'
  code: string
  details: string
}
