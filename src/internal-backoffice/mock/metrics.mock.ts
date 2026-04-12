import { MrrData, PlanDistribution } from '../types/metrics';

export const MRR_DATA: MrrData[] = [
  { month: 'Oct', mrr: 12400 },
  { month: 'Nov', mrr: 14800 },
  { month: 'Dic', mrr: 15200 },
  { month: 'Ene', mrr: 18900 },
  { month: 'Feb', mrr: 21500 },
  { month: 'Mar', mrr: 24800 },
];

export const PLAN_DISTRIBUTION: PlanDistribution[] = [
  { name: 'Basic', value: 45, color: '#94a3b8' },
  { name: 'Pro', value: 30, color: '#6366f1' },
  { name: 'Premium', value: 15, color: '#4f46e5' },
  { name: 'Enterprise', value: 10, color: '#1e1b4b' },
];
