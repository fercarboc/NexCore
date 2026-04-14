import { useState, useEffect, useCallback } from 'react'
import { getCrmLeads } from '@/src/services/crm.service'
import type { CrmLead } from '@/src/services/crm.service'

export const useCrmLeads = () => {
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCrmLeads()
      .then(setLeads)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [trigger])

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  return { leads, loading, error, refetch }
}
