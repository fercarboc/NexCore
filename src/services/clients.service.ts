import { supabase } from '@/src/lib/supabase'
import type { SaaSClientWithDetails } from '@/src/internal-backoffice/types/clients'

export const getClients = async (): Promise<SaaSClientWithDetails[]> => {
  const { data, error } = await supabase.functions.invoke<SaaSClientWithDetails[]>('get-clients')
  if (error) throw new Error(error.message)
  return data ?? []
}
