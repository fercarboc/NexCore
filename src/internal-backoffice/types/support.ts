import type { Tables } from '@/src/lib/database.types'

// Tipos base derivados del schema de BD
export type SupportTicket = Tables<'support_tickets'>
export type SupportTicketEvent = Tables<'support_ticket_events'>

// Enums alineados con BD
export type TicketType = 'technical' | 'billing' | 'general' | 'integration'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketStatus = 'open' | 'in_progress' | 'pending_client' | 'resolved' | 'closed'
export type TicketEventType = 'message' | 'note' | 'status_change' | 'assignment'

// Tipo extendido para la UI (incluye nombre del cliente y asignado)
export interface TicketWithDetails extends SupportTicket {
  client_name?: string
  assignee_name?: string
  events?: SupportTicketEvent[]
}
