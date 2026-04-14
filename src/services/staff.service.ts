import { supabase } from '@/src/lib/supabase'

export interface StaffMember {
  id: string
  name: string
  role: string
  status: string
  created_at: string
  updated_at: string
  email: string
  last_sign_in_at: string | null
}

export const getStaff = async (): Promise<StaffMember[]> => {
  const { data, error } = await supabase.functions.invoke<StaffMember[]>('get-staff')
  if (error) throw new Error(error.message)
  return data ?? []
}
