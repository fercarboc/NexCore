// Tipos de métricas — son datos calculados/agregados, no filas directas de BD

export interface MrrData {
  month: string
  mrr: number
}

export interface PlanDistribution {
  name: string
  value: number
  color: string
}

// Métricas del dashboard — calculadas con queries agregadas sobre saas_clients,
// saas_subscriptions y saas_invoices
export interface DashboardMetrics {
  totalClients: number
  activeClients: number
  mrr: number
  mrrGrowth: number
  churnRate: number
  trialClients: number
  suspendedClients: number
}
