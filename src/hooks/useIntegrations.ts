import { useState, useEffect } from 'react'
import { getIntegrations } from '@/src/services/integrations.service'
import type { InfraIntegration } from '@/src/internal-backoffice/types/integrations'

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<InfraIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getIntegrations()
      .then(setIntegrations)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { integrations, loading, error }
}
