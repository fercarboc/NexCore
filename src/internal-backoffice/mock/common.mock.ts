import type { InternalUser, LegalDocument } from '../types/common'

export const MOCK_INTERNAL_USERS: InternalUser[] = [
  { id: 'usr_1', name: 'Fernando Admin',    role: 'super_admin',  status: 'active',   created_at: '2025-01-01T00:00:00Z', updated_at: '2026-04-09T10:00:00Z', email: 'fernando@staynexapp.com', lastAccess: 'Ahora mismo' },
  { id: 'usr_2', name: 'Laura Soporte',     role: 'support',      status: 'active',   created_at: '2025-03-01T00:00:00Z', updated_at: '2026-04-09T09:48:00Z', email: 'laura@staynexapp.com',    lastAccess: 'Hace 12 min' },
  { id: 'usr_3', name: 'Carlos Billing',    role: 'billing',      status: 'active',   created_at: '2025-05-15T00:00:00Z', updated_at: '2026-04-09T09:00:00Z', email: 'carlos@staynexapp.com',   lastAccess: 'Hace 1h' },
  { id: 'usr_4', name: 'Marta Integrations',role: 'integrations', status: 'active',   created_at: '2025-06-20T00:00:00Z', updated_at: '2026-04-09T08:00:00Z', email: 'marta@staynexapp.com',    lastAccess: 'Hace 2h' },
  { id: 'usr_5', name: 'Pablo ReadOnly',    role: 'read_only',    status: 'inactive', created_at: '2025-09-10T00:00:00Z', updated_at: '2026-04-06T10:00:00Z', email: 'pablo@staynexapp.com',    lastAccess: 'Hace 3 días' },
]

export const MOCK_LEGAL_DOCS: LegalDocument[] = [
  { id: 'leg_1', name: 'Aviso Legal',             version: 'v2.1', updatedAt: '2026-01-15', status: 'published', responsible: 'Fernando Admin' },
  { id: 'leg_2', name: 'Política de Privacidad',  version: 'v3.0', updatedAt: '2026-03-01', status: 'published', responsible: 'Fernando Admin' },
  { id: 'leg_3', name: 'Términos y Condiciones',  version: 'v2.5', updatedAt: '2026-02-20', status: 'published', responsible: 'Fernando Admin' },
  { id: 'leg_4', name: 'Contrato SaaS',           version: 'v1.2', updatedAt: '2026-04-05', status: 'draft',     responsible: 'Fernando Admin' },
]
