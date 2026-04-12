import type { Tables } from '@/src/lib/database.types'

// Tipo base derivado del schema de BD
export type SaaSInvoice = Tables<'saas_invoices'>

// Enum alineado con BD
export type InvoiceStatus = 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE'

// Tipo extendido para la UI (incluye nombre del cliente en queries con join)
export interface InvoiceWithClient extends SaaSInvoice {
  client_name?: string
  plan_name?: string
}

// Registro de pago de Stripe (no tiene tabla propia — viene de Stripe API / webhooks)
export interface StripePayment {
  id: string
  date: string
  amount_cents: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending'
  method: string
  stripe_payment_intent_id: string
  client_id: string
}
