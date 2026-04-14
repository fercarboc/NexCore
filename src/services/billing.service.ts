import { supabase } from '@/src/lib/supabase'
import type { InvoiceWithClient } from '@/src/internal-backoffice/types/billing'

export const getInvoices = async (clientId?: string): Promise<InvoiceWithClient[]> => {
  const { data, error } = await supabase.functions.invoke<InvoiceWithClient[]>('get-invoices', {
    body: clientId ? { client_id: clientId } : {},
  })
  if (error) throw new Error(error.message)
  return data ?? []
}
