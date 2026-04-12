import type { Tables } from '@/src/lib/database.types'

// Secciones navegables del backoffice
export type InternalSection =
  | 'dashboard'
  | 'clientes'
  | 'suscripciones'
  | 'planes'
  | 'facturacion'
  | 'integraciones'
  | 'api'
  | 'metricas'
  | 'soporte'
  | 'configuracion'
  | 'inbox'

// Tipo base derivado de BD
export type StaffProfile = Tables<'staff_profiles'>

// Enum de roles alineado con BD
export type StaffRole = 'super_admin' | 'support' | 'billing' | 'integrations' | 'read_only'
export type StaffStatus = 'active' | 'inactive'

// Tipo extendido para la UI (incluye email de auth.users, que no está en staff_profiles)
export interface InternalUser extends StaffProfile {
  email?: string
  lastAccess?: string
}

// Documento legal (pendiente de tabla en futuras fases)
export interface LegalDocument {
  id: string
  name: string
  version: string
  updatedAt: string
  status: 'draft' | 'published'
  responsible: string
}
