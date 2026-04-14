import {
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MetricCard, SectionHeader, Badge } from '../components/UI';
import { MRR_DATA, PLAN_DISTRIBUTION } from '../mock/metrics.mock';
import { useClients } from '@/src/hooks/useClients';

export const DashboardPage = () => {
  const { clients } = useClients()

  const activeClients = clients.filter(c => c.status === 'ACTIVE')
  const mrr = activeClients.reduce((sum, c) => {
    const price = c.subscription?.plan?.monthly_price_cents ?? 0
    const cycle = c.subscription?.billing_cycle
    return sum + (cycle === 'YEARLY' ? Math.round(price / 12) : price)
  }, 0)
  const mrrDisplay = mrr > 0 ? `${(mrr / 100).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€` : '—'

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Dashboard General" 
        description="Vista global del rendimiento y estado de la plataforma StayNexApp."
        actions={
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Descargar Reporte Mensual
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="MRR Total" value={mrrDisplay} trend="up" trendValue="+12.5%" icon={TrendingUp} />
        <MetricCard title="Clientes Activos" value={String(activeClients.length)} trend="up" trendValue="+8" icon={Users} />
        <MetricCard title="Churn Rate" value="1.2%" trend="down" trendValue="-0.4%" icon={Activity} />
        <MetricCard title="LTV Promedio" value="842€" trend="up" trendValue="+5.2%" icon={CreditCard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Crecimiento MRR (6 meses)</h3>
            <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 focus:outline-none">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MRR_DATA}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                  itemStyle={{color: '#818cf8'}}
                />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Distribución por Plan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLAN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PLAN_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {PLAN_DISTRIBUTION.map((plan) => (
              <div key={plan.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: plan.color}} />
                  <span className="text-sm font-medium text-slate-600">{plan.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{plan.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Últimos Clientes Registrados</h3>
          <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Fecha Alta</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 5).map((client) => {
                const displayName = client.trade_name || client.legal_name
                const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2)
                const planCode = client.subscription?.plan?.code
                return (
                  <tr key={client.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{displayName}</p>
                          <p className="text-[10px] text-slate-500">{client.contact_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={planCode === 'ENTERPRISE' ? 'indigo' : 'slate'}>{client.subscription?.plan?.name ?? '—'}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-medium text-slate-600 capitalize">{client.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">{new Date(client.created_at).toLocaleDateString('es-ES')}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
