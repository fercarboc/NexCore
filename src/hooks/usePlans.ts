import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import type { Tables } from '@/src/lib/database.types'

export type SaasPlan = Tables<'saas_plans'>

export const usePlans = () => {
  const [plans, setPlans] = useState<SaasPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.functions.invoke<SaasPlan[]>('get-plans')
      .then(({ data }) => setPlans(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { plans, loading }
}
