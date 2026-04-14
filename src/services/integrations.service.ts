import { supabase } from '@/src/lib/supabase'
import type { InfraIntegration } from '@/src/internal-backoffice/types/integrations'

export interface IntegrationRow {
  id: string
  name: string
  provider: string
  category: string
  status: string
  environment: string
  health: number
  last_sync: string
  description: string | null
  version: string | null
  owner: string | null
  uptime: string
  latency: string
  success_rate: string
  created_at: string
}

const toInfraIntegration = (row: IntegrationRow): InfraIntegration => ({
  id: row.id,
  name: row.name,
  provider: row.provider,
  category: row.category as InfraIntegration['category'],
  status: row.status as InfraIntegration['status'],
  environment: row.environment as InfraIntegration['environment'],
  health: row.health,
  lastSync: row.last_sync,
  description: row.description ?? '',
  version: row.version ?? '',
  owner: row.owner ?? '',
  uptime: row.uptime,
  latency: row.latency,
  successRate: row.success_rate,
})

export const getIntegrations = async (): Promise<InfraIntegration[]> => {
  const { data, error } = await supabase.functions.invoke<IntegrationRow[]>('get-integrations')
  if (error) throw new Error(error.message)
  return (data ?? []).map(toInfraIntegration)
}
