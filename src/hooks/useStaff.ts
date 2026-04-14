import { useState, useEffect } from 'react'
import { getStaff } from '@/src/services/staff.service'
import type { StaffMember } from '@/src/services/staff.service'

export const useStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStaff()
      .then(setStaff)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { staff, loading, error }
}
