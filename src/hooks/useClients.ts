import { useState, useEffect, useCallback } from 'react'
import { getClients } from '@/src/services/clients.service'
import type { SaaSClientWithDetails } from '@/src/internal-backoffice/types/clients'

export const useClients = () => {
  const [clients, setClients] = useState<SaaSClientWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getClients()
      .then(setClients)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [trigger])

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  return { clients, loading, error, refetch }
}
