import { useState, useEffect, useCallback } from 'react'
import { getCrmContact } from '@/src/services/crm.service'
import type { CrmContactDetail } from '@/src/services/crm.service'

export const useCrmContact = (contactId: string | null) => {
  const [contact, setContact] = useState<CrmContactDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    if (!contactId) { setContact(null); return }
    setLoading(true)
    getCrmContact(contactId)
      .then(setContact)
      .catch(() => setContact(null))
      .finally(() => setLoading(false))
  }, [contactId, trigger])

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  return { contact, loading, refetch }
}
