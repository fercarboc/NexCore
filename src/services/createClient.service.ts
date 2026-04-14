import { supabase } from '@/src/lib/supabase'

export interface CreateClientPayload {
  legal_name: string
  trade_name?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  tax_id?: string
  plan_id: string
  billing_cycle: 'MONTHLY' | 'YEARLY'
}

export interface CreateClientResult {
  success: boolean
  client_id: string
  casarural_user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  message: string
}

export const createClient = async (payload: CreateClientPayload): Promise<CreateClientResult> => {
  const { data, error } = await supabase.functions.invoke<CreateClientResult>('create-client', {
    body: payload,
  })
  if (error) throw new Error(error.message)
  if (!data?.success) throw new Error('Error al crear el cliente')
  return data
}
