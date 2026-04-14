import { useState, useEffect } from 'react'
import { getTicketEvents } from '@/src/services/support.service'
import type { SupportTicketEvent } from '@/src/internal-backoffice/types/support'

export const useTicketEvents = (ticketId: string | null) => {
  const [events, setEvents] = useState<SupportTicketEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ticketId) return
    setLoading(true)
    getTicketEvents(ticketId)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [ticketId])

  return { events, loading }
}
