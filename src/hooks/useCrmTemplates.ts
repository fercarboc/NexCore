import { useState, useEffect, useCallback } from 'react'
import { getCrmTemplates } from '@/src/services/crm.service'
import type { CrmEmailTemplate } from '@/src/services/crm.service'

export const useCrmTemplates = () => {
  const [templates, setTemplates] = useState<CrmEmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCrmTemplates()
      .then(setTemplates)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [trigger])

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  return { templates, loading, error, refetch }
}
