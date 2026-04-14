import {
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { SectionHeader, Badge, MetricCard } from '../components/UI';
import { useBilling } from '@/src/hooks/useBilling';

export const BillingPage = () => {
  const { invoices, loading, error } = useBilling()

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64 text-rose-500 text-sm font-bold">{error}</div>
  )

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Facturación y Pagos" 
        description="Gestión centralizada de facturas, cobros, impuestos y conciliación con Stripe."
        actions={
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Download className="w-3 h-3" /> Exportar para Contabilidad
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Facturación Mes Actual" value="12.450€" trend="up" trendValue="+8.2%" icon={TrendingUp} />
        <MetricCard title="Pendiente de Cobro" value="840€" trend="down" trendValue="-15%" icon={AlertTriangle} />
        <MetricCard title="Cobros Exitosos" value="98.5%" trend="up" trendValue="+0.2%" icon={CheckCircle2} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por factura, cliente o Stripe ID..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 w-64 font-medium"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Plus className="w-3 h-3" /> Crear Factura Manual
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">Factura / ID</th>
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Periodo</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{inv.id}</p>
                        <p className="text-[10px] font-mono text-slate-400">{inv.stripe_invoice_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">{inv.client_name}</td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                    {inv.period_start ? new Date(inv.period_start).toLocaleDateString('es-ES') : '—'} – {inv.period_end ? new Date(inv.period_end).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="py-4 px-6 text-sm font-black text-slate-900">{(inv.amount_cents / 100).toFixed(2)}€</td>
                  <td className="py-4 px-6">
                    <Badge variant={inv.status === 'PAID' ? 'emerald' : 'amber'}>{inv.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
