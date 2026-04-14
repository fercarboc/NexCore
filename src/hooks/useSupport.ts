import { useState, useEffect } from 'react'
import { getTickets } from '@/src/services/support.service'
import type { TicketWithDetails } from '@/src/internal-backoffice/types/support'

export const useSupport = (clientId?: string) => {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTickets(clientId)
      .then(setTickets)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [clientId])

  return { tickets, loading, error }
}
