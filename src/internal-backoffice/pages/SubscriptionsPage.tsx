import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight, 
  MoreVertical,
  X,
  Calendar,
  ArrowRightLeft,
  Ban,
  Play,
  Pause,
  History
} from 'lucide-react';
import { SectionHeader, Badge } from '../components/UI';
import { MOCK_CLIENTS_WITH_DETAILS } from '../mock/clients.mock';
import { motion, AnimatePresence } from 'motion/react';

export const SubscriptionsPage = () => {
  const [selectedSub, setSelectedSub] = useState<any>(null);

  const handleManage = (client: any) => {
    setSelectedSub(client);
  };

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Gestión de Suscripciones" 
        description="Monitoriza estados de suscripción, ciclos de facturación y recupera pagos fallidos."
        actions={
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-3 h-3" /> Reporte de Churn
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suscripciones Activas</p>
            <p className="text-2xl font-black text-slate-900">142</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Periodo de Prueba</p>
            <p className="text-2xl font-black text-slate-900">14</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pagos Fallidos</p>
            <p className="text-2xl font-black text-slate-900">3</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por cliente o ID Stripe..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/10 w-64 font-medium"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Ciclo</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Próximo Cobro</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENTS_WITH_DETAILS.map((client) => {
                const displayName = client.trade_name || client.legal_name
                const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                const planCode = client.subscription?.plan?.code
                const planName = client.subscription?.plan?.name ?? '—'
                const stripeId = client.subscription?.saas_stripe_customer_id ?? '—'
                return (
                <tr key={client.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{displayName}</p>
                        <p className="text-[10px] font-mono text-slate-400">{stripeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={planCode === 'ENTERPRISE' ? 'indigo' : 'slate'}>{planName}</Badge>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 font-medium">{client.subscription?.billing_cycle ?? '—'}</td>
                  <td className="py-4 px-6">
                    <Badge variant={client.status === 'ACTIVE' ? 'emerald' : 'amber'}>{client.status}</Badge>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">12 Nov 2026</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleManage(client)}
                        className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold hover:text-indigo-600 transition-colors"
                      >
                        Gestionar
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}

            </tbody>
          </table>
        </div>
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSub(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gestionar Suscripción</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedSub.name} • {selectedSub.stripeCustomerId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSub(null)}
                  className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Current Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan Actual</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-slate-900">{selectedSub.plan}</p>
                      <Badge variant="indigo">Anual</Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Próximo Cobro</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <p className="text-lg font-black text-slate-900">12 Nov 2026</p>
                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Acciones de Gestión</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-slate-50 transition-all text-left group">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Cambiar Plan</p>
                        <p className="text-[10px] text-slate-500">Upgrade o Downgrade</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-slate-50 transition-all text-left group">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Ciclo de Facturación</p>
                        <p className="text-[10px] text-slate-500">Cambiar a Mensual</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group">
                      <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors">
                        <Pause className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Suspender</p>
                        <p className="text-[10px] text-slate-500">Pausar temporalmente</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all text-left group">
                      <div className="p-2 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-100 transition-colors">
                        <Ban className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 text-rose-600">Cancelar Suscripción</p>
                        <p className="text-[10px] text-slate-500">Baja inmediata</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* History / Info */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold">Últimos Eventos</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Renovación automática exitosa</span>
                      <span className="font-mono">12 Nov 2025</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Cambio de plan: Basic &rarr; {selectedSub.plan}</span>
                      <span className="font-mono">05 Oct 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedSub(null)}
                  className="px-6 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cerrar
                </button>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
