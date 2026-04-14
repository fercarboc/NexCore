import { useState, useEffect } from 'react'
import { getInvoices } from '@/src/services/billing.service'
import type { InvoiceWithClient } from '@/src/internal-backoffice/types/billing'

export const useBilling = (clientId?: string) => {
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getInvoices(clientId)
      .then(setInvoices)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [clientId])

  return { invoices, loading, error }
}
