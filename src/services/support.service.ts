import { supabase } from '@/src/lib/supabase'
import type { TicketWithDetails, SupportTicketEvent } from '@/src/internal-backoffice/types/support'

export const getTickets = async (clientId?: string): Promise<TicketWithDetails[]> => {
  const { data, error } = await supabase.functions.invoke<TicketWithDetails[]>('get-tickets', {
    body: clientId ? { client_id: clientId } : {},
  })
  if (error) throw new Error(error.message)
  return data ?? []
}

export const getTicketEvents = async (ticketId: string): Promise<SupportTicketEvent[]> => {
  const { data, error } = await supabase.functions.invoke<SupportTicketEvent[]>('get-ticket-events', {
    body: { ticket_id: ticketId },
  })
  if (error) throw new Error(error.message)
  return data ?? []
}
